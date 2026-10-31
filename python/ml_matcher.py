"""
Hybrid resume / job-description matcher.

Final score = 50% document semantic similarity
            + 35% semantic skill coverage
            + 15% experience adequacy

Skills are extracted with spaCy (noun chunks, named entities, POS runs) and
matched by sentence-embedding similarity, so no vocabulary list is needed.

Setup: python -m spacy download en_core_web_sm
"""

from __future__ import annotations

import logging
import re
import string
from dataclasses import dataclass
from functools import lru_cache

import numpy as np
import spacy
from sentence_transformers import SentenceTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

try:
    _NLP = spacy.load('en_core_web_sm', disable=['lemmatizer'])
except OSError:
    raise RuntimeError(
        "spaCy model 'en_core_web_sm' not found. Run: python -m spacy download en_core_web_sm"
    )

logger = logging.getLogger(__name__)

SKILL_MATCH_THRESHOLD = 0.60

SEMANTIC_DOC_WEIGHT = 0.50
SEMANTIC_SKILL_WEIGHT = 0.35
EXPERIENCE_WEIGHT = 0.15

_CERT_RE = re.compile(
    r'\b(certified|certification|certificate|ceh|cissp|oscp|osep|ccna|ccnp|'
    r'ccie|pmp|itil|aws\s+certified|azure\s+certified|comptia|security\+|'
    r'network\+|cism|cisa|ejpt|gpen|gwapt|prince2|togaf|scrum|pmi|ec-council|'
    r'microsoft\s+certified|google\s+certified|cisco\s+certified)\b',
    re.IGNORECASE,
)

_GENERIC = {
    'experience', 'knowledge', 'ability', 'skill', 'skills', 'understanding',
    'familiarity', 'proficiency', 'background', 'exposure', 'awareness',
    'work', 'working', 'use', 'using', 'develop', 'development', 'implement',
    'implementation', 'management', 'manager', 'team', 'environment', 'system',
    'systems', 'solution', 'solutions', 'application', 'applications', 'tool',
    'tools', 'platform', 'platforms', 'process', 'processes', 'practice',
    'practices', 'technology', 'technologies', 'role', 'position', 'job',
    'candidate', 'requirement', 'requirements', 'responsibility',
    'responsibilities', 'include', 'including', 'etc', 'year', 'years',
    'plus', 'strong', 'good', 'excellent', 'great', 'best', 'high', 'new',
    'key', 'relevant', 'related', 'various', 'multiple', 'different',
    'prefer', 'preferred', 'required', 'desired', 'ideal', 'optional',
    'equivalent', 'similar', 'basic', 'advanced', 'intermediate', 'junior',
    'senior', 'lead', 'hands', 'hand', 'day', 'time', 'area', 'field',
    'industry', 'sector', 'company', 'organization', 'enterprise', 'client',
    'customer', 'business', 'project', 'projects',
}

_EDUCATION_KW = {
    'bachelor', 'master', 'phd', 'degree', 'university', 'college',
    'bs', 'ms', 'bsc', 'msc', 'be', 'me', 'gpa', 'honours', 'graduated',
    'diploma', 'associate',
}

_DEGREE_REQUIRED_KW = ('bachelor', 'master', 'degree', 'phd', 'bs', 'ms')

_NUMBER_WORDS = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
}

_SECTION_HEADERS = {
    'skills': re.compile(
        r'(technical\s+skills?|skills?\s+summary|core\s+competenc|'
        r'technologies|proficienc|tools|skills?)', re.IGNORECASE),
    'experience': re.compile(
        r'(work\s+experience|professional\s+experience|employment|'
        r'career|experience)', re.IGNORECASE),
    'education': re.compile(
        r'(education|academic|qualification|degree|certification)', re.IGNORECASE),
}

_CONTENT_POS = {'NOUN', 'PROPN', 'ADJ', 'X'}
_CONNECTOR_POS = {'PUNCT', 'SPACE', 'DET', 'CONJ', 'CCONJ'}


@dataclass
class Profile:
    skills: list[str]
    experience: str


class NLPExtractor:
    """Extracts skill phrases from raw text, filtering out certifications and generic filler."""

    @staticmethod
    def _clean(text: str) -> str:
        text = re.sub(r'[\r\t\x0b\x0c\xa0]+', ' ', text)
        return re.sub(r' {2,}', ' ', text).strip()

    @staticmethod
    def _normalise(phrase: str) -> str:
        return re.sub(r'\s+', ' ', phrase.lower().strip(string.punctuation + ' '))

    @staticmethod
    def _is_valid(phrase: str) -> bool:
        tokens = phrase.lower().split()
        if not tokens:
            return False
        if len(tokens) == 1 and (tokens[0] in _GENERIC or tokens[0].isdigit() or len(tokens[0]) < 2):
            return False
        if tokens[0] in _GENERIC or tokens[-1] in _GENERIC:
            return False
        return any(t not in _GENERIC and t not in string.punctuation for t in tokens)

    def _pos_runs(self, doc) -> set[str]:
        """Runs of up to 4 content tokens, allowing one connector (/, -, &) inside."""
        phrases: set[str] = set()
        i = 0
        while i < len(doc):
            tok = doc[i]
            if tok.pos_ not in _CONTENT_POS or tok.is_stop:
                i += 1
                continue

            run = [tok]
            j = i + 1
            while j < len(doc) and len(run) < 4:
                nxt = doc[j]
                if nxt.pos_ in _CONTENT_POS and not nxt.is_stop:
                    run.append(nxt)
                    j += 1
                elif nxt.pos_ in _CONNECTOR_POS or nxt.text in ('/', '-', '&'):
                    if j + 1 < len(doc) and doc[j + 1].pos_ in _CONTENT_POS:
                        run.append(nxt)
                        j += 1
                    else:
                        break
                else:
                    break

            if len(run) >= 2:
                phrase = self._normalise(' '.join(t.text for t in run))
                if self._is_valid(phrase):
                    phrases.add(phrase)
            i = j
        return phrases

    def _candidate_phrases(self, doc) -> list[str]:
        candidates: set[str] = set()

        for chunk in doc.noun_chunks:
            for text in (chunk.text, chunk.root.text):
                phrase = self._normalise(text)
                if self._is_valid(phrase):
                    candidates.add(phrase)

        for ent in doc.ents:
            phrase = self._normalise(ent.text)
            if self._is_valid(phrase):
                candidates.add(phrase)

        candidates |= self._pos_runs(doc)
        return sorted(candidates)

    @staticmethod
    def _tfidf_filter(phrases: list[str], source_text: str) -> list[str]:
        """Drops zero-weight and low-weight (below the 25th percentile) phrases."""
        if len(phrases) < 4:
            return phrases
        try:
            vectorizer = TfidfVectorizer(
                ngram_range=(1, 3), min_df=1, max_df=0.95,
                stop_words='english', sublinear_tf=True,
            )
            vectorizer.fit([source_text] + phrases)
            scores = np.asarray(vectorizer.transform(phrases).sum(axis=1)).flatten()
            if scores.max() == 0:
                return phrases

            positive = scores[scores > 0]
            threshold = np.percentile(positive, 25) if len(positive) else 0
            return [p for p, s in zip(phrases, scores) if s >= threshold]
        except Exception:
            return phrases

    def extract_skills(self, text: str) -> list[str]:
        text = self._clean(text)
        if not text:
            return []

        phrases = self._tfidf_filter(self._candidate_phrases(_NLP(text)), text)
        return [p for p in phrases if not _CERT_RE.search(p)]

    @staticmethod
    def _experience_sentence(text: str) -> str:
        for sentence in re.split(r'[.\n]', text):
            if re.search(r'\d+\s*(?:\+\s*)?(?:years?|yrs?|months?)', sentence, re.IGNORECASE):
                return sentence.strip()
        return ''

    def parse(self, text: str) -> Profile:
        return Profile(skills=self.extract_skills(text), experience=self._experience_sentence(text))


class SemanticMatcher:
    MODEL_NAME = 'all-MiniLM-L6-v2'

    def __init__(self):
        self.model = SentenceTransformer(self.MODEL_NAME)

    def encode(self, texts: list[str]) -> np.ndarray:
        return self.model.encode(
            texts, convert_to_numpy=True, show_progress_bar=False, normalize_embeddings=True
        )

    def similarity(self, text_a: str, text_b: str) -> float:
        if not text_a.strip() or not text_b.strip():
            return 0.0
        embeddings = self.encode([text_a, text_b])
        sim = float(cosine_similarity(embeddings[0:1], embeddings[1:2])[0][0])
        return max(0.0, min(1.0, sim))


def match_skills(semantic: SemanticMatcher, jd_skills: list[str], resume_skills: list[str]) -> dict:
    """Matches each JD skill to its closest resume skill by embedding similarity."""
    if not jd_skills:
        return {'score': 0.5, 'matched': [], 'missing': [], 'extra': resume_skills}
    if not resume_skills:
        return {'score': 0.0, 'matched': [], 'missing': jd_skills, 'extra': []}

    similarity = cosine_similarity(semantic.encode(jd_skills), semantic.encode(resume_skills))

    matched, missing, used_resume_idx = [], [], set()
    for i, skill in enumerate(jd_skills):
        best = int(np.argmax(similarity[i]))
        if similarity[i, best] >= SKILL_MATCH_THRESHOLD:
            matched.append(skill)
            used_resume_idx.add(best)
        else:
            missing.append(skill)

    return {
        'score': len(matched) / len(jd_skills),
        'matched': matched,
        'missing': missing,
        'extra': [s for j, s in enumerate(resume_skills) if j not in used_resume_idx],
    }


def _years(text: str) -> float | None:
    if not text:
        return None
    text = text.lower()
    for word, number in _NUMBER_WORDS.items():
        text = re.sub(rf'\b{word}\b', str(number), text)

    if m := re.search(r'(\d+)\s*months?', text):
        return float(m.group(1)) / 12
    if m := re.search(r'(\d+)\s*[-–]\s*(\d+)\s*years?', text):
        return float(m.group(1))
    if m := re.search(r'(\d+(?:\.\d+)?)\+?\s*years?', text):
        return float(m.group(1))
    return None


def score_experience(candidate: Profile, job: Profile) -> float:
    required = _years(job.experience)
    have = _years(candidate.experience)
    if required is None:
        return 0.5
    if have is None:
        return 0.3

    gap = required - have
    if gap <= 0:
        return 1.0
    if gap <= 1:
        return 0.75
    if gap <= 2:
        return 0.45
    return 0.15


def split_sections(text: str) -> dict[str, str]:
    """Splits a resume into skills / experience / education by detecting short header lines."""
    buckets: dict[str, list[str]] = {name: [] for name in _SECTION_HEADERS}
    current = 'other'

    for line in text.split('\n'):
        stripped = line.strip()
        if stripped and len(stripped) < 60:
            for name, pattern in _SECTION_HEADERS.items():
                if pattern.search(stripped):
                    current = name
                    break
        if current in buckets:
            buckets[current].append(line)

    return {name: '\n'.join(lines).strip() for name, lines in buckets.items()}


def score_education_section(section: str, jd_text: str) -> int:
    if not section:
        return 50

    section_lower = section.lower()
    if any(kw in jd_text.lower() for kw in _DEGREE_REQUIRED_KW):
        return 85 if any(kw in section_lower for kw in _EDUCATION_KW) else 35
    return min(100, 50 + sum(kw in section_lower for kw in _EDUCATION_KW) * 8)


def get_verdict(score: int) -> tuple[str, str]:
    if score >= 75:
        return 'Excellent Match', 'Strong alignment. Highly recommended to apply.'
    if score >= 55:
        return 'Good Match', 'Solid fit. Worth applying with minor improvements.'
    if score >= 35:
        return 'Partial Match', 'Some alignment. Address the missing skills first.'
    return 'Weak Match', 'Low alignment. Significant gaps need to be addressed.'


class HybridMatcher:
    """Load once at startup, then call safe_match(resume_text, jd_text) per request."""

    def __init__(self):
        self.semantic = SemanticMatcher()
        self.extractor = NLPExtractor()
        # A batch scores many resumes against one job description, so its profile is parsed once
        self._job_profile = lru_cache(maxsize=32)(self.extractor.parse)

    def _section_scores(self, resume_text: str, jd_text: str, jd_skills: list[str]) -> dict[str, int]:
        sections = split_sections(resume_text)

        skills_text = sections['skills'] or resume_text
        if jd_skills:
            resume_skills = self.extractor.extract_skills(skills_text)
            skills = round(min(1.0, match_skills(self.semantic, jd_skills, resume_skills)['score']) * 100)
        else:
            skills = 50

        experience_text = sections['experience'] or resume_text
        experience = (
            round(self.semantic.similarity(experience_text, jd_text) * 100)
            if experience_text.strip() else 50
        )

        return {
            'skills': skills,
            'experience': experience,
            'education': score_education_section(sections['education'], jd_text),
        }

    def match(self, resume_text: str, jd_text: str) -> dict:
        candidate = self.extractor.parse(resume_text)
        job = self._job_profile(jd_text)

        doc_sim = self.semantic.similarity(resume_text, jd_text)
        skills = match_skills(self.semantic, job.skills, candidate.skills)
        experience = score_experience(candidate, job)

        hybrid = (
            doc_sim * SEMANTIC_DOC_WEIGHT
            + skills['score'] * SEMANTIC_SKILL_WEIGHT
            + experience * EXPERIENCE_WEIGHT
        )
        match_score = round(max(0.0, min(1.0, hybrid)) * 100)
        verdict, advice = get_verdict(match_score)

        return {
            'match_score': match_score,
            'verdict': verdict,
            'advice': advice,
            'matched_keywords': skills['matched'],
            'missing_keywords': skills['missing'],
            'extra_keywords': skills['extra'],
            'section_scores': self._section_scores(resume_text, jd_text, job.skills),
            'semantic_score': round(doc_sim, 4),
            'skill_score': round(skills['score'], 4),
            'experience_score': round(experience, 4),
            'token_counts': {'resume': len(resume_text.split()), 'jd': len(jd_text.split())},
        }

    def safe_match(self, resume_text: str, jd_text: str) -> dict:
        try:
            return self.match(resume_text, jd_text)
        except Exception as e:
            logger.exception('Matching failed')
            return {
                'match_score': 0,
                'verdict': 'Error',
                'advice': 'An error occurred during analysis.',
                'matched_keywords': [],
                'missing_keywords': [],
                'extra_keywords': [],
                'section_scores': {'skills': 0, 'experience': 0, 'education': 0},
                'semantic_score': 0.0,
                'skill_score': 0.0,
                'experience_score': 0.0,
                'token_counts': {'resume': 0, 'jd': 0},
                'error': str(e),
            }
