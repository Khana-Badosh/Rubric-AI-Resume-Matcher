import { useParams, useSearchParams } from 'react-router-dom';
import useCountUp from '../hooks/useCountUp';
import useResultData from '../hooks/useResultData';
import Reveal from '../components/ui/Reveal';
import { exportRankingsCsv } from '../lib/exportCsv';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import Page from '../components/ui/Page';
import PageStatus from '../components/ui/PageStatus';
import SectionHeading from '../components/ui/SectionHeading';
import ScoreBar from '../components/results/ScoreBar';
import SkillBreakdown from '../components/results/SkillBreakdown';

const SECTIONS = [
  { key: 'skills', label: 'Skills' },
  { key: 'experience', label: 'Experience' },
  { key: 'education', label: 'Education' },
];

function SummaryStat({ value, label }) {
  const shown = useCountUp(value, 1000);
  return (
    <div className="card p-5 text-center">
      <p className="font-sf-pro-display text-feature font-semibold leading-none tabular">{Math.round(shown)}</p>
      <p className="text-compact muted mt-2">{label}</p>
    </div>
  );
}

function CandidateDetail({ algo }) {
  return (
    <div className="mt-5 pt-5 border-t border-hairline-silver grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-compact muted font-normal mb-3">Section scores</h3>
        <div className="space-y-3">
          {SECTIONS.map(({ key, label }) => (
            <ScoreBar key={key} label={label} score={algo.section_scores?.[key] ?? 0} thin />
          ))}
        </div>
      </div>
      <SkillBreakdown algo={algo} compact />
    </div>
  );
}

function CandidateRow({ candidate, open, onToggle, delay = 0 }) {
  const algo = candidate.algorithm_result ?? {};

  return (
    <Reveal delay={delay} className="card px-4 sm:px-5 py-4">
      <div className="flex items-center gap-4">
        <span
          className={`w-9 h-9 rounded-full text-compact font-semibold flex items-center justify-center shrink-0 tabular ${
            candidate.rank_position === 1 ? 'bg-pricing-blue/10 text-blue-deep' : 'bg-gallery-white'
          }`}
        >
          {candidate.rank_position}
        </span>

        <div className="flex-1 min-w-0">
          <p dir="auto" className="text-body font-medium truncate" title={candidate.resume_filename}>{candidate.resume_filename}</p>
          <p className="text-compact muted mt-0.5">{algo.verdict || 'Not rated'}</p>
        </div>

        <div className="flex-shrink-0 px-3 h-8 rounded-full whitespace-nowrap bg-gallery-white text-compact font-medium flex items-center tabular">
          {candidate.match_score}/100
        </div>

        <div className="hidden sm:block w-24 flex-shrink-0">
          <ScoreBar score={candidate.match_score} />
        </div>

        <button
          onClick={onToggle}
          aria-label={open ? 'Hide details' : 'Show details'}
          aria-expanded={open}
          className="flex-shrink-0 w-9 h-9 pointer-coarse:w-11 pointer-coarse:h-11 rounded-full bg-gallery-white hover:shadow-subtle flex items-center justify-center"
        >
          <Icon name="chevronDown" className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {open && <CandidateDetail algo={algo} />}
    </Reveal>
  );
}

export default function BatchResults() {
  const { id } = useParams();
  const { data, loading, error, retry } = useResultData(`/api/batch/${id}`);
  const [searchParams, setSearchParams] = useSearchParams();
  const expandedIds = new Set((searchParams.get('open') ?? '').split(',').filter(Boolean));

  const toggleRow = (candidateId) => {
    const key = String(candidateId);
    const next = new Set(expandedIds);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSearchParams(next.size ? { open: [...next].join(',') } : {}, { replace: true });
  };

  if (loading || error) return <PageStatus loading={loading} error={error} onRetry={retry} />;
  if (!Array.isArray(data?.results)) {
    return <PageStatus error="This ranking is incomplete and cannot be shown." />;
  }

  const { results } = data;
  const scores = results.map((r) => (Number.isFinite(r.match_score) ? r.match_score : 0));
  const topScore = Math.max(0, ...scores);
  const averageScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const best = results[0];

  return (
    <Page width="max-w-4xl" className="space-y-5">
      <SectionHeading eyebrow="Ranking Complete" title="Candidate Rankings" className="mb-10">
        <p className="text-compact muted break-all">Batch ID: {id}</p>
      </SectionHeading>

      <div className="grid grid-cols-3 gap-4">
        <SummaryStat value={results.length} label="Candidates" />
        <SummaryStat value={topScore} label="Top score" />
        <SummaryStat value={averageScore} label="Average score" />
      </div>

      {best?.match_score > 0 && (
        <div className="card p-5 flex items-center gap-4">
          <span className="w-10 h-10 rounded-full bg-pricing-blue/10 text-blue-deep flex items-center justify-center shrink-0">
            <Icon name="check" className="w-5 h-5" strokeWidth={2.5} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-caption muted">Best match</p>
            <p dir="auto" className="text-body font-medium truncate">{best.resume_filename}</p>
            <p className="text-compact muted">{best.algorithm_result?.verdict}</p>
          </div>
          <span className="shrink-0 px-3 h-8 rounded-full bg-pricing-blue text-gallery-white text-compact font-medium flex items-center tabular">
            {best.match_score}/100
          </span>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 pt-6">
        <h2 className="text-statement">All Candidates</h2>
        <Button size="sm" onClick={() => exportRankingsCsv(results, id)}>
          <Icon name="download" className="w-4 h-4" />
          Download CSV
        </Button>
      </div>

      {results.length === 0 ? (
        <p className="muted text-body">No candidates to show yet.</p>
      ) : (
      <div className="space-y-3">
        {results.map((candidate, index) => (
          <CandidateRow
            key={candidate.id}
            delay={index * 70}
            candidate={candidate}
            open={expandedIds.has(String(candidate.id))}
            onToggle={() => toggleRow(candidate.id)}
          />
        ))}
      </div>
      )}

      <div className="pt-4">
        <Button to="/analyze" variant="outline">Analyze another batch</Button>
      </div>
    </Page>
  );
}
