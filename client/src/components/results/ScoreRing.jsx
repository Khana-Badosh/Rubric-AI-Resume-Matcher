import useCountUp from '../../hooks/useCountUp';

const RADIUS = 54;
const STROKE = 8;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScoreRing({ score }) {
  const value = useCountUp(score, 1300);

  return (
    <svg width="136" height="136" viewBox="0 0 128 128" role="img" aria-label={`Match score ${score} out of 100`} className="shrink-0">
      <circle cx="64" cy="64" r={RADIUS} fill="none" className="stroke-control-gray" strokeWidth={STROKE} />
      <circle
        cx="64"
        cy="64"
        r={RADIUS}
        fill="none"
        className="stroke-pricing-blue"
        strokeWidth={STROKE}
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={CIRCUMFERENCE - (value / 100) * CIRCUMFERENCE}
        strokeLinecap="round"
        transform="rotate(-90 64 64)"
      />
      <text x="64" y="68" textAnchor="middle" fontSize="36" fontWeight="600" className="fill-ink font-sf-pro-display tabular">{Math.round(value)}</text>
      <text x="64" y="88" textAnchor="middle" fontSize="12" className="fill-slate">out of 100</text>
    </svg>
  );
}
