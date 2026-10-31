import { useState } from 'react';
import Icon from '../ui/Icon';
import ScoreBar from './ScoreBar';

const GROUPS = [
  { key: 'matched_keywords', title: 'Matched', icon: 'check', style: 'chip-good' },
  { key: 'missing_keywords', title: 'Missing from resume', hint: 'Add these where they honestly apply.', icon: 'close', style: 'chip-bad' },
  { key: 'extra_keywords', title: 'Additional skills', hint: 'Not required by the job description.', icon: null, style: 'chip-plain bg-gallery-white' },
];

const LIMIT = 12;

function SkillGroup({ title, hint, skills, icon, style, compact }) {
  const [showAll, setShowAll] = useState(false);
  const shown = showAll ? skills : skills.slice(0, LIMIT);

  return (
    <div>
      <div className={`flex items-baseline justify-between gap-3 ${hint && !compact ? 'mb-1' : compact ? 'mb-2' : 'mb-3'}`}>
        <h3 className="text-compact font-medium">{title}</h3>
        <span className="text-compact muted tabular">{skills.length}</span>
      </div>
      {hint && !compact && <p className="text-caption muted mb-3">{hint}</p>}
      <div className={`flex flex-wrap ${compact ? 'gap-1.5' : 'gap-2'}`}>
        {shown.map((skill, i) => (
          <span key={`${skill}-${i}`} className={`chip pop max-w-full break-words ${style}`} style={{ '--delay': `${Math.min(i, 16) * 35}ms` }}>
            {icon && <Icon name={icon} className="w-3 h-3" strokeWidth={2.5} />}
            {skill}
          </span>
        ))}
      </div>
      {skills.length > LIMIT && (
        <button
          onClick={() => setShowAll(!showAll)}
          aria-expanded={showAll}
          className="link-quiet underline text-compact mt-3"
        >
          {showAll ? 'Show fewer' : `Show all ${skills.length}`}
        </button>
      )}
    </div>
  );
}

function Coverage({ matched, required }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <p className="text-compact font-medium">Required skills covered</p>
        <p className="text-compact tabular">
          <span className="font-semibold">{matched}</span> <span className="muted">of {required}</span>
        </p>
      </div>
      <ScoreBar score={Math.round((matched / required) * 100)} />
    </div>
  );
}

export default function SkillBreakdown({ algo, compact = false }) {
  const matched = algo.matched_keywords?.length ?? 0;
  const required = matched + (algo.missing_keywords?.length ?? 0);

  return (
    <div className={compact ? 'space-y-4' : 'space-y-6'}>
      {!compact && required > 0 && <Coverage matched={matched} required={required} />}
      {GROUPS.map(({ key, ...group }) => {
        const skills = algo[key] ?? [];
        if (skills.length === 0) return null;

        return <SkillGroup key={key} skills={skills} compact={compact} {...group} />;
      })}
    </div>
  );
}
