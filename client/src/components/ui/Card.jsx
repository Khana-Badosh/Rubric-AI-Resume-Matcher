import Reveal from './Reveal';

export default function Card({ title, badge, action, delay = 0, className = '', children }) {
  return (
    <Reveal as="section" delay={delay} className={`card p-6 md:p-7 ${className}`}>
      {title && (
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <h2 className="text-statement max-w-none">{title}</h2>
            {badge && <span className="chip chip-plain">{badge}</span>}
          </div>
          {action}
        </div>
      )}
      {children}
    </Reveal>
  );
}
