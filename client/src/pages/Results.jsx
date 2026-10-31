import { useParams } from 'react-router-dom';
import useResultData from '../hooks/useResultData';
import { toPercent } from '../lib/scoring';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Page from '../components/ui/Page';
import PageStatus from '../components/ui/PageStatus';
import SectionHeading from '../components/ui/SectionHeading';
import CopyButton from '../components/results/CopyButton';
import ScoreBar from '../components/results/ScoreBar';
import ScoreRing from '../components/results/ScoreRing';
import SkillBreakdown from '../components/results/SkillBreakdown';

const STATS = [
  { key: 'semantic_score', label: 'Semantic match' },
  { key: 'skill_score', label: 'Skill match' },
  { key: 'experience_score', label: 'Experience' },
];

const SECTIONS = [
  { key: 'skills', label: 'Skills' },
  { key: 'experience', label: 'Experience' },
  { key: 'education', label: 'Education' },
];

export default function Results() {
  const { id } = useParams();
  const { data, loading, error, retry } = useResultData(`/api/analyze/${id}`);

  if (loading || error) return <PageStatus loading={loading} error={error} onRetry={retry} />;
  if (!data?.algorithm_result) {
    return <PageStatus error="This report is incomplete and cannot be shown." />;
  }

  const { algorithm_result: algo, gemini_result: gemini } = data;
  const stats = STATS.filter(({ key }) => Number.isFinite(algo[key]));
  const hasKeywords = ['matched_keywords', 'missing_keywords', 'extra_keywords'].some((key) => algo[key]?.length > 0);

  return (
    <Page width="max-w-5xl" className="space-y-5">
      <SectionHeading eyebrow="Analysis Complete" title="Your Match Report" className="mb-10" />

      <div className="card p-6 md:p-7 flex flex-col sm:flex-row items-center gap-6 md:gap-8">
        <ScoreRing score={Number.isFinite(algo.match_score) ? algo.match_score : 0} />
        <div className="flex-1 text-center sm:text-left">
          <p className="inline-flex items-center px-4 py-1 min-h-8 rounded-full bg-gallery-white text-compact font-medium mb-4 max-w-full">
            {algo.verdict}
          </p>
          <p className="text-kicker mb-6">{algo.advice}</p>
          <div className="grid grid-cols-3 gap-3">
            {stats.map(({ key, label }) => (
              <div key={key} className="rounded-panel bg-gallery-white/60 p-3 text-center">
                <p className="font-sf-pro-display text-statement font-semibold tabular">{toPercent(algo[key])}%</p>
                <p className="text-compact mt-0.5">{label}</p>
              </div>
            ))}
          </div>
          {stats.length > 0 && (
            <p className="text-compact mt-4 opacity-80">
              Semantic match compares the overall meaning of your resume with the job description. Skill match measures how many of the required skills appear in your resume. Experience compares your background with the level the role asks for.
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-5">
          {gemini?.suggestions?.length > 0 && (
            <Card title="Priority Fixes" className="flex-1">
              <ol className="list-none p-0 m-0 space-y-3">
                {gemini.suggestions.slice(0, 3).map((suggestion, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-pricing-blue/10 text-blue-deep text-compact font-semibold flex items-center justify-center shrink-0 tabular">
                      {i + 1}
                    </span>
                    <span className="text-body font-medium min-w-0 break-words">{suggestion.title}</span>
                  </li>
                ))}
              </ol>
            </Card>
          )}

          <Card title="Section Breakdown" className="flex-1">
            <div className="space-y-5">
              {SECTIONS.map(({ key, label }) => (
                <ScoreBar key={key} label={label} score={algo.section_scores?.[key] ?? 0} />
              ))}
            </div>
          </Card>
        </div>

        <Card title="Keyword Analysis" className="h-full">
          {hasKeywords ? (
            <SkillBreakdown algo={algo} />
          ) : (
            <p className="muted text-compact">No keywords were found for this analysis.</p>
          )}
        </Card>
      </div>

      {gemini?.suggestions?.length > 0 && (
        <Card title="Improvement Suggestions" badge="Gemini">
          <ol className="rows list-none p-0 m-0">
            {gemini.suggestions.map((suggestion, i) => (
              <li key={i} className="flex gap-5 py-5 first:pt-0 last:pb-0">
                <span className="w-8 h-8 rounded-full bg-pricing-blue/10 text-blue-deep text-compact font-semibold flex items-center justify-center shrink-0 tabular">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="text-body font-medium mb-1 break-words">{suggestion.title}</h3>
                  <p className="muted text-body break-words">{suggestion.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {gemini?.cover_letter && (
        <Card title="Cover Letter" badge="Gemini" action={<CopyButton text={gemini.cover_letter} />}>
          <label htmlFor="cover-letter" className="visually-hidden">Cover letter</label>
          <textarea
            id="cover-letter"
            readOnly
            value={gemini.cover_letter}
            rows={12}
            className="field leading-relaxed resize-none"
          />
          <p className="print-only whitespace-pre-wrap text-body">{gemini.cover_letter}</p>
        </Card>
      )}

      <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
        <Button to="/analyze" variant="outline">Analyze another resume</Button>
        <p className="text-compact muted break-all">Report ID: {id}</p>
      </div>
    </Page>
  );
}
