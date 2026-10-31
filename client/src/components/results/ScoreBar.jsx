import { useEffect, useState } from 'react';
import { scoreTier } from '../../lib/scoring';

export default function ScoreBar({ score, label, thin = false, track = 'bg-gallery-white' }) {
  const [grown, setGrown] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const bar = (
    <div className={`${thin ? 'h-1.5' : 'h-2'} rounded-full overflow-hidden ${track}`}>
      <div
        className={`h-full w-full rounded-full origin-left ${scoreTier(score).bar}`}
        style={{ transform: `scaleX(${grown ? score / 100 : 0})`, transition: 'transform 1000ms var(--ease-out)' }}
      />
    </div>
  );

  if (!label) return bar;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-compact font-medium">{label}</span>
        <span className="text-compact font-medium tabular">{score}%</span>
      </div>
      {bar}
    </div>
  );
}
