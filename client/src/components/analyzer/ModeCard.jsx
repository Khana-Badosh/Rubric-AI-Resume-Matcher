import Icon from '../ui/Icon';

export default function ModeCard({ mode, selected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex items-center justify-center gap-2 h-10 pointer-coarse:h-11 rounded-full text-compact font-medium transition-colors ${
        selected ? 'bg-gallery-white shadow-subtle' : 'muted hover:text-ink'
      }`}
    >
      <Icon name={mode.icon} className="w-4 h-4" />
      {mode.label}
    </button>
  );
}
