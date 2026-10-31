import { Link } from 'react-router-dom';
import { BRAND } from '../../lib/config';

const SIZES = {
  md: { mark: 'w-7 h-7', text: 'text-nav-title font-semibold' },
  sm: { mark: 'w-6 h-6', text: 'text-compact font-semibold' },
};

export function LogoMark({ className = '' }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect width="32" height="32" rx="8" fill="#1d1d1f" />
      <rect x="8" y="8" width="16" height="4" rx="2" fill="#2997ff" />
      <rect x="8" y="14" width="12" height="4" rx="2" fill="#ffffff" />
      <rect x="8" y="20" width="8" height="4" rx="2" fill="#ffffff" fillOpacity="0.65" />
    </svg>
  );
}

export default function Logo({ size = 'md', onClick }) {
  const s = SIZES[size];

  return (
    <Link to="/" onClick={onClick} className="flex items-center gap-2.5 min-h-11">
      <LogoMark className={s.mark} />
      <span translate="no" className={`${s.text} font-sf-pro-display`}>{BRAND}</span>
    </Link>
  );
}
