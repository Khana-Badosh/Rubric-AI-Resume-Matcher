export default function SectionHeading({
  eyebrow,
  title,
  description,
  as: tag = 'h1',
  align = 'center',
  className = '',
  children,
}) {
  const Heading = tag;
  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start';

  return (
    <div className={`flex flex-col gap-4 ${alignClass} ${className}`}>
      {eyebrow && <p className="text-body font-medium text-slate-strong font-sf-pro-display">{eyebrow}</p>}
      <Heading className={`max-w-none ${tag === 'h1' ? 'text-feature' : ''}`}>{title}</Heading>
      {description && <p className="muted text-body max-w-xl">{description}</p>}
      {children}
    </div>
  );
}
