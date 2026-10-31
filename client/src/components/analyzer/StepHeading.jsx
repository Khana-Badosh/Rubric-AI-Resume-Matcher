export default function StepHeading({ number, title, children }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-3">
      <div className="flex items-center gap-3">
        <span className="w-6 h-6 rounded-full bg-pricing-blue text-gallery-white text-caption font-semibold flex items-center justify-center tabular" aria-hidden="true">
          {number}
        </span>
        <h2 className="max-w-none text-body font-semibold whitespace-nowrap">{title}</h2>
      </div>
      {children}
    </div>
  );
}
