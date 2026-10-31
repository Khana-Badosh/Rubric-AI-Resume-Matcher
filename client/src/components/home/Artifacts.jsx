import { useId } from 'react';

const INK = '#1d1d1f';
const BLUE = '#0071e3';
const SKY = '#34c3ff';
const LINE = '#cfd1d6';

function Defs({ id }) {
  return (
    <defs>
      <linearGradient id={`${id}-paper`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#f1f2f6" />
      </linearGradient>
      <linearGradient id={`${id}-ribbon`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={BLUE} />
        <stop offset="1" stopColor={SKY} />
      </linearGradient>
      <linearGradient id={`${id}-avatar`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffd9a8" />
        <stop offset="1" stopColor="#ff8f7a" />
      </linearGradient>
      <linearGradient id={`${id}-beam`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={BLUE} stopOpacity="0" />
        <stop offset="0.8" stopColor={SKY} stopOpacity="0.35" />
        <stop offset="1" stopColor={SKY} stopOpacity="0.9" />
      </linearGradient>
      <filter id={`${id}-shadow`} x="-40%" y="-30%" width="180%" height="200%">
        <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor={INK} floodOpacity="0.12" />
        <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor={INK} floodOpacity="0.06" />
      </filter>
    </defs>
  );
}

function Sheet({ id, x, y, w = 360, h = 480 }) {
  return <rect x={x} y={y} width={w} height={h} rx="22" fill={`url(#${id}-paper)`} stroke="#e6e6e8" filter={`url(#${id}-shadow)`} />;
}

const HERO_LEFT = [
  { y: 96, w: 118, m: true }, { y: 114, w: 92, m: false }, { y: 132, w: 126, m: true },
  { y: 176, w: 108, m: true }, { y: 194, w: 84, m: false }, { y: 212, w: 120, m: true },
  { y: 256, w: 100, m: false }, { y: 274, w: 112, m: true }, { y: 292, w: 78, m: false },
];
const HERO_RIGHT = [
  { y: 96, w: 116, m: true }, { y: 114, w: 128, m: 'miss' }, { y: 132, w: 100, m: true },
  { y: 176, w: 126, m: true }, { y: 194, w: 104, m: 'miss' }, { y: 212, w: 120, m: true },
  { y: 256, w: 90, m: 'miss' }, { y: 274, w: 114, m: true }, { y: 292, w: 96, m: false },
];
const LEFT_SECTIONS = [{ y: 84, label: 'SKILLS' }, { y: 164, label: 'EXPERIENCE' }, { y: 244, label: 'EDUCATION' }];
const RIGHT_SECTIONS = [{ y: 84, label: 'REQUIREMENTS' }, { y: 164, label: 'RESPONSIBILITIES' }, { y: 244, label: 'QUALIFICATIONS' }];
const HERO_PAIRS = [0, 2, 3, 5, 7];
const HERO_L = { x: 20, y: 40 };
const HERO_R = { x: 380, y: 24 };
const SHEET_W = 200;
const SHEET_H = 320;
const MUTED = '#86868b';
const BLUE_DEEP = '#0058b0';
const SCORE_BARS = [
  { label: 'Skills', value: 0.92 },
  { label: 'Experience', value: 0.78 },
  { label: 'Education', value: 0.64 },
];
const PILL_PAD = 12;
const PILL_DOT = 8;
const PILL_GAP = 6;
const CHAR_WIDTH = 5.7;
const TALLY_PILLS = [
  { text: '12 matched', kind: 'good' },
  { text: '3 missing', kind: 'bad' },
  { text: '5 extra', kind: 'plain' },
].map((pill) => {
  const textWidth = Math.round(pill.text.length * CHAR_WIDTH);
  return { ...pill, textWidth, w: PILL_PAD * 2 + PILL_DOT + PILL_GAP + textWidth };
});
const TALLY_GAP = 10;
const TALLY_START = (600 - (TALLY_PILLS.reduce((sum, pill) => sum + pill.w, 0) + (TALLY_PILLS.length - 1) * TALLY_GAP)) / 2;
const TALLY = TALLY_PILLS.map((pill, i) => ({
  ...pill,
  x: TALLY_START + TALLY_PILLS.slice(0, i).reduce((sum, earlier) => sum + earlier.w + TALLY_GAP, 0),
}));

function HeroLines({ lines, ox, oy }) {
  return (
    <g transform={`translate(${ox} ${oy})`}>
      {lines.map(({ y, w, m }) => {
        if (m === 'miss') {
          return <rect key={y} x="14" y={y} width={w + 6} height="14" rx="7" fill="none" stroke={MUTED} strokeOpacity="0.6" strokeDasharray="4 3" />;
        }
        return (
          <g key={y}>
            {m && <rect x="8" y={y} width={w + 16} height="14" rx="7" fill={BLUE} fillOpacity="0.1" />}
            <rect x="16" y={y + 4} width={w} height="6" rx="3" fill={m ? INK : LINE} />
          </g>
        );
      })}
    </g>
  );
}

function HeroSheet({ x, y, caption, sections, resume }) {
  return (
    <>
      <text x={x + 2} y={y - 10} fontSize="12" fontWeight="500" fill={MUTED}>{caption}</text>
      <rect x={x} y={y} width={SHEET_W} height={SHEET_H} rx="16" fill="#ffffff" stroke="#e1e1e5" />
      {resume ? (
        <>
          <circle cx={x + 34} cy={y + 34} r="14" fill="#e8e8ed" />
          <rect x={x + 58} y={y + 26} width="96" height="9" rx="4.5" fill={INK} />
          <rect x={x + 58} y={y + 42} width="62" height="6" rx="3" fill={LINE} />
        </>
      ) : (
        <>
          <rect x={x + 16} y={y + 26} width="124" height="10" rx="5" fill={INK} />
          <rect x={x + 16} y={y + 44} width="78" height="6" rx="3" fill={LINE} />
        </>
      )}
      {sections.map(({ y: dy, label }) => (
        <text key={label} x={x + 16} y={y + dy} fontSize="9" fontWeight="600" letterSpacing="0.8" fill={MUTED}>{label}</text>
      ))}
    </>
  );
}

function TallyPill({ x, y, text, textWidth, w, kind }) {
  const dotX = x + PILL_PAD + PILL_DOT / 2;
  return (
    <g>
      {kind === 'good' && <rect x={x} y={y} width={w} height="26" rx="13" fill={BLUE} fillOpacity="0.12" />}
      {kind === 'bad' && <rect x={x + 0.5} y={y + 0.5} width={w - 1} height="25" rx="12.5" fill="#ffffff" stroke={MUTED} strokeOpacity="0.7" strokeDasharray="4 3" />}
      {kind === 'plain' && <rect x={x} y={y} width={w} height="26" rx="13" fill="#ececf0" />}
      <circle cx={dotX} cy={y + 13} r={PILL_DOT / 2} fill={kind === 'good' ? BLUE : kind === 'bad' ? 'none' : MUTED} stroke={kind === 'bad' ? MUTED : 'none'} strokeWidth="1.5" />
      <text x={x + PILL_PAD + PILL_DOT + PILL_GAP} y={y + 17} fontSize="11" fontWeight="500" textLength={textWidth} fill={kind === 'good' ? BLUE_DEEP : INK}>{text}</text>
    </g>
  );
}

export function HeroRender({ className = '' }) {
  const r = 32;
  const len = 2 * Math.PI * r;

  return (
    <svg
      viewBox="0 0 600 412"
      role="img"
      aria-label="A resume and a job description side by side with the matching lines joined and a match score of 86 between them. Below it a tally shows 12 matched skills, 3 missing and 5 extra."
      className={`w-full h-auto overflow-visible ${className}`}
    >
      <HeroSheet x={HERO_L.x} y={HERO_L.y} caption="Resume" sections={LEFT_SECTIONS} resume />
      <HeroLines lines={HERO_LEFT} ox={HERO_L.x} oy={HERO_L.y} />
      <HeroSheet x={HERO_R.x} y={HERO_R.y} caption="Job description" sections={RIGHT_SECTIONS} />
      <HeroLines lines={HERO_RIGHT} ox={HERO_R.x} oy={HERO_R.y} />

      {HERO_PAIRS.map((i, n) => {
        const x1 = HERO_L.x + 16 + HERO_LEFT[i].w + 20;
        const y1 = HERO_L.y + HERO_LEFT[i].y + 7;
        const x2 = HERO_R.x + 6;
        const y2 = HERO_R.y + HERO_RIGHT[i].y + 7;
        return (
          <path
            key={i}
            d={`M ${x1} ${y1} C ${x1 + 90} ${y1}, ${x2 - 90} ${y2}, ${x2} ${y2}`}
            fill="none"
            stroke={BLUE}
            strokeOpacity="0.55"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="ribbon"
            style={{ '--delay': `${0.4 + n * 0.18}s` }}
          />
        );
      })}

      <rect x="235" y="104" width="130" height="190" rx="20" fill="#ffffff" stroke="#e1e1e5" />
      <circle cx="300" cy="156" r={r} fill="none" stroke="#e8e8ed" strokeWidth="6" />
      <g className="ring-sweep">
        <circle
          cx="300" cy="156" r={r} fill="none" stroke={BLUE} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={len} strokeDashoffset={len * 0.14} transform="rotate(-90 300 156)"
        />
      </g>
      <text x="300" y="166" textAnchor="middle" fontSize="27" fontWeight="600" fill={INK} className="font-sf-pro-display">86</text>
      <text x="300" y="208" textAnchor="middle" fontSize="11" fill={MUTED}>Match score</text>
      {SCORE_BARS.map(({ label, value }, i) => (
        <g key={label}>
          <text x="249" y={235 + i * 18} fontSize="8.5" fill={MUTED}>{label}</text>
          <rect x="300" y={230 + i * 18} width="52" height="5" rx="2.5" fill="#e8e8ed" />
          <rect x="300" y={230 + i * 18} width={52 * value} height="5" rx="2.5" fill={BLUE} />
        </g>
      ))}

      {TALLY.map((pill) => (
        <TallyPill key={pill.text} y={374} {...pill} />
      ))}
    </svg>
  );
}

export function RingMark({ size = 48, stroke = 6, className = '' }) {
  const gradientId = `ring-${useId().replace(/:/g, '')}`;
  const r = (size - stroke) / 2;
  const len = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={BLUE} />
          <stop offset="1" stopColor={SKY} />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e6e6e8" strokeWidth={stroke} />
      <g className="ring-sweep">
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`url(#${gradientId})`} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={len} strokeDashoffset={len * 0.22} transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </g>
    </svg>
  );
}

export function UploadRender() {
  const id = 'up';
  return (
    <svg viewBox="0 0 640 420" role="img" aria-label="A resume sheet dropping into a dashed upload area" className="w-full h-auto overflow-visible">
      <Defs id={id} />
      <rect x="120" y="150" width="400" height="230" rx="28" fill="#ffffff" stroke="#86868b" strokeWidth="2" strokeDasharray="8 8" />
      <g className="float-a">
        <Sheet id={id} x="220" y="40" w="200" h="260" />
        <circle cx="252" cy="82" r="14" fill={`url(#${id}-avatar)`} />
        <rect x="276" y="72" width="90" height="9" rx="4.5" fill={INK} />
        <rect x="276" y="88" width="60" height="6" rx="3" fill={LINE} />
        {[130, 154, 178, 214, 238].map((y, i) => (
          <rect key={y} x="244" y={y} width={[140, 112, 132, 128, 96][i]} height="7" rx="3.5" fill={i % 2 ? LINE : '#3a3c42'} />
        ))}
      </g>
      <circle cx="320" cy="300" r="28" fill={BLUE} className="pop-in" style={{ '--delay': '0.3s' }} />
      <path d="M320 312 V288 M310 298 L320 288 L330 298" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {['PDF', 'DOC', 'DOCX'].map((t, i) => (
        <g key={t} transform={`translate(${222 + i * 68} 344)`}>
          <rect width="58" height="24" rx="12" fill="#f5f5f7" />
          <text x="29" y="16.5" textAnchor="middle" fontSize="12" fontWeight="600" fill="#707070" fontFamily="Inter, sans-serif">{t}</text>
        </g>
      ))}
    </svg>
  );
}

const SCAN_ROWS = [118, 146, 174, 214, 242, 270, 310, 338];
const SCAN_WIDTHS = [230, 190, 210, 220, 170, 200, 214, 180];

export function AnalysisRender() {
  const id = 'an';
  return (
    <svg viewBox="0 0 640 420" role="img" aria-label="A resume sheet with a scanning beam passing over its lines" className="w-full h-auto overflow-visible">
      <Defs id={id} />
      <Sheet id={id} x="170" y="30" w="300" h="360" />
      <circle cx="212" cy="78" r="18" fill={`url(#${id}-avatar)`} />
      <rect x="244" y="64" width="130" height="11" rx="5.5" fill={INK} />
      <rect x="244" y="84" width="86" height="7" rx="3.5" fill={LINE} />
      {SCAN_ROWS.map((y, i) => (
        <g key={y}>
          {i % 3 !== 1 && <rect x="196" y={y - 6} width={SCAN_WIDTHS[i] + 16} height="20" rx="10" fill={BLUE} fillOpacity="0.12" />}
          <rect x="204" y={y} width={SCAN_WIDTHS[i]} height="8" rx="4" fill={i % 3 !== 1 ? INK : LINE} />
        </g>
      ))}
      <g style={{ '--scan-dist': '250px' }} className="scan-beam">
        <rect x="150" y="96" width="340" height="64" fill={`url(#${id}-beam)`} />
        <rect x="150" y="158" width="340" height="3" rx="1.5" fill={SKY} />
      </g>
    </svg>
  );
}

const PILLS = [[96, 270, 70, true], [176, 270, 90, true], [276, 270, 60, true], [96, 316, 84, false], [194, 316, 70, false]];

export function ResultsRender() {
  const id = 'rs';
  const bars = [[96, 0.82], [130, 0.64], [164, 0.48]];
  return (
    <svg viewBox="0 0 640 420" role="img" aria-label="A match report with a score ring, section bars and keyword pills" className="w-full h-auto overflow-visible">
      <Defs id={id} />
      <Sheet id={id} x="60" y="40" w="520" h="340" />
      <g transform="translate(96 78)">
        <RingMark size={132} stroke={12} />
      </g>
      <rect x="260" y="92" width="150" height="12" rx="6" fill={INK} />
      {bars.map(([y, f]) => (
        <g key={y}>
          <rect x="260" y={y + 24} width="270" height="8" rx="4" fill="#e6e6e8" />
          <rect x="260" y={y + 24} width={270 * f} height="8" rx="4" fill={`url(#${id}-ribbon)`} />
        </g>
      ))}
      {PILLS.map(([x, y, w, good], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height="28" rx="14" fill={good ? INK : '#ffffff'} stroke={good ? 'none' : '#86868b'} strokeDasharray={good ? undefined : '4 3'} />
          <rect x={x + 26} y={y + 11} width={w - 40} height="6" rx="3" fill={good ? '#ffffff' : LINE} fillOpacity={good ? 0.4 : 1} />
        </g>
      ))}
    </svg>
  );
}
