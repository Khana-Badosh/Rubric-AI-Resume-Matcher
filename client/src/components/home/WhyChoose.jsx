import { BRAND } from '../../lib/config';
import Icon from '../ui/Icon';
import Reveal from '../ui/Reveal';

const FEATURES = [
  {
    title: 'Built for Applicant Tracking Systems',
    description: 'Check that your resume is structured and worded so screening software can read it.',
  },
  {
    title: 'Grounded in Current Hiring Practice',
    description: 'Recommendations reflect what recruiters and hiring managers look for today.',
  },
  {
    title: 'Specific to Your Experience',
    description: 'Suggestions build on your own skills and achievements instead of generic advice.',
  },
];

const GROUPS = [
  { title: 'Matched', style: 'chip-good', icon: 'check', pills: ['w-12', 'w-16', 'w-10', 'w-14'] },
  { title: 'Missing from resume', style: 'chip-bad', icon: 'close', pills: ['w-14', 'w-10', 'w-16'] },
  { title: 'Additional skills', style: 'chip-plain', icon: null, pills: ['w-10', 'w-14'] },
];

function KeywordPanel() {
  return (
    <div className="card p-5 md:p-6 w-full md:max-w-[460px] md:ml-auto" aria-hidden="true">
      <div className="card-white p-6">
        <p className="text-kicker font-semibold font-sf-pro-display mb-5">Keyword analysis</p>
        <div className="space-y-5">
          {GROUPS.map(({ title, style, icon, pills }) => (
            <div key={title}>
              <p className="text-caption muted mb-2">{title}</p>
              <div className="flex flex-wrap gap-2">
                {pills.map((width, i) => (
                  <span key={i} className={`chip ${style}`}>
                    {icon && <Icon name={icon} className="w-3 h-3" strokeWidth={2.5} />}
                    <span className={`h-1.5 rounded-full bg-current opacity-30 ${width}`} />
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WhyChoose() {
  return (
    <section className="py-(--section-gap) overflow-x-clip">
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-center">
        <div className="flex flex-col gap-8">
          <Reveal>
            <h2>Why {BRAND}</h2>
          </Reveal>

          <div className="flex flex-col gap-6">
            {FEATURES.map(({ title, description }, i) => (
              <Reveal key={title} delay={120 + i * 100} className="flex flex-col gap-1.5">
                <h3>{title}</h3>
                <p className="muted text-compact">{description}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={200}>
          <KeywordPanel />
        </Reveal>
      </div>
    </section>
  );
}
