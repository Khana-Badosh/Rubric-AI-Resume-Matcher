const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_NAME = 'gemini-2.5-flash';
const GEMINI_TIMEOUT_MS = 60000;

const FALLBACK_RESULT = {
  suggestions: [
    {
      title: 'AI suggestions unavailable',
      description: "We couldn't generate suggestions right now. Your match results are still accurate. Please try again later.",
    },
  ],
  cover_letter: "We couldn't generate a cover letter right now. Please try again later.",
};

const list = (items) => (items.length > 0 ? items.join(', ') : 'None detected');

function buildPrompt({ match_score, verdict, matched_keywords, missing_keywords, section_scores, token_counts }, jobText) {
  return `You are an expert resume coach and career advisor.

A resume was analyzed against a job description using NLP. Here are the results:

MATCH SCORE: ${match_score}/100 (${verdict})
MATCHED SKILLS: ${list(matched_keywords)}
MISSING SKILLS: ${list(missing_keywords)}
SECTION SCORES (out of 100): Skills: ${section_scores.skills}, Experience: ${section_scores.experience}, Education: ${section_scores.education}
RESUME LENGTH: ${token_counts.resume} meaningful tokens
JOB DESCRIPTION: "${jobText.slice(0, 600)}"

Based on this analysis provide two things:

1. Exactly 4 specific actionable suggestions to improve the resume for this role. Each suggestion must reference the data above. Do not give generic advice.

2. A professional cover letter tailored to this job. 3 paragraphs. Highlight matched skills naturally. Address missing skills as areas of growth. Confident but not arrogant tone. Do not use placeholders like [Your Name].

Respond ONLY with valid JSON. No markdown. No code fences. No explanation. Just the JSON object:
{"suggestions":[{"title":"string","description":"string"},{"title":"string","description":"string"},{"title":"string","description":"string"},{"title":"string","description":"string"}],"cover_letter":"string"}`;
}

async function generateSuggestions(algorithmResult, jobText) {
  try {
    const model = genAI.getGenerativeModel(
      {
        model: MODEL_NAME,
        generationConfig: {
          maxOutputTokens: 4096,
          temperature: 0.7,
          responseMimeType: 'application/json',
        },
      },
      { timeout: GEMINI_TIMEOUT_MS }
    );
    const result = await model.generateContent(buildPrompt(algorithmResult, jobText));
    const parsed = JSON.parse(result.response.text());

    if (!Array.isArray(parsed.suggestions) || !parsed.cover_letter) {
      throw new Error('Unexpected response shape');
    }
    return parsed;
  } catch (err) {
    console.error('[Gemini] Generation failed:', err.message);
    return FALLBACK_RESULT;
  }
}

module.exports = { generateSuggestions };
