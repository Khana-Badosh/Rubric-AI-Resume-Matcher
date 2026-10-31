import { useEffect, useState } from 'react';
import Icon from '../ui/Icon';
import Page from '../ui/Page';

export default function LoadingScreen({ steps }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (current >= steps.length - 1) return;
    const timer = setTimeout(() => setCurrent((step) => step + 1), steps[current].duration);
    return () => clearTimeout(timer);
  }, [current, steps]);

  const progress = (current + 1) / steps.length;

  return (
    <Page center width="max-w-md">
      <div className="card p-6 md:p-8" role="status" aria-live="polite">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-pricing-blue/10 text-pricing-blue flex items-center justify-center shrink-0">
            <Icon name="bolt" className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-statement max-w-none">Preparing your report…</h1>
            <p className="muted text-compact">
              {current >= steps.length - 1 ? 'Still working. Longer documents take more time.' : 'This may take a few moments.'}
            </p>
          </div>
        </div>

        <div className="h-1.5 rounded-full bg-gallery-white overflow-hidden mb-6" aria-hidden="true">
          <div
            className="h-full w-full rounded-full bg-pricing-blue origin-left"
            style={{ transform: `scaleX(${progress})`, transition: 'transform 600ms var(--ease-out)' }}
          />
        </div>

        <ol className="list-none p-0 m-0 space-y-3">
          {steps.map((step, i) => {
            const done = i < current;
            const active = i === current;

            return (
              <li key={step.label} className={`flex items-center gap-3 transition-opacity duration-300 ${done || active ? 'opacity-100' : 'opacity-50'}`}>
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    done ? 'bg-pricing-blue text-gallery-white' : active ? 'border-2 border-pricing-blue' : 'border border-steel'
                  }`}
                >
                  {done && <Icon name="check" className="w-3 h-3" strokeWidth={3} />}
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-pricing-blue animate-pulse motion-reduce:animate-none" />}
                </span>
                <span className={`text-compact ${active ? 'font-medium' : done ? 'muted' : ''}`}>{step.label}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </Page>
  );
}
