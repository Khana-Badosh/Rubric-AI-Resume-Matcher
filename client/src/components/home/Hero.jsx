import { GUEST_LIMIT } from '../../lib/config';
import Button from '../ui/Button';
import { HeroRender } from './Artifacts';

const LINES = ['Match your resume', 'to any job in seconds'];
const HEADLINE = LINES.join(' ');

function Headline() {
  let index = 0;
  return (
    <h1 aria-label={HEADLINE} className="max-w-none">
      {LINES.map((line) => (
        <span key={line} aria-hidden="true" className="md:block">
          {line.split(' ').map((word) => {
            const delay = 0.12 + index++ * 0.08;
            return (
              <span key={`${word}-${index}`}>
                <span className="word" style={{ '--delay': `${delay}s` }}>{word}</span>{' '}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

export default function Hero() {
  return (
    <section className="pt-16 md:pt-20 pb-(--section-gap) overflow-x-clip">
      <div className="container flex flex-col items-center text-center gap-4">
        <Headline />

        <p className="rise muted text-body md:text-lede max-w-xl" style={{ '--delay': '0.7s' }}>
          Upload your resume and a job description to get a match score and a skill gap check with a tailored cover letter.
        </p>

        <div className="rise cta-row mt-2" style={{ '--delay': '0.85s' }}>
          <Button to="/analyze">Match My Resume</Button>
          <Button to="/#features" variant="outline">See How It Works</Button>
        </div>

        <p className="rise text-caption muted" style={{ '--delay': '1s' }}>
          Free to try. No account needed for your first {GUEST_LIMIT} analyses.
        </p>
      </div>

      <div className="rise container mt-10 md:mt-12" style={{ '--delay': '1.1s' }}>
        <div className="mx-auto w-full max-w-[340px] sm:max-w-[480px] md:max-w-[560px]">
          <HeroRender />
        </div>
      </div>
    </section>
  );
}
