import Button from '../ui/Button';
import Reveal from '../ui/Reveal';

export default function CallToAction() {
  return (
    <section className="band-mist py-(--section-gap)">
      <Reveal className="container flex flex-col items-center text-center gap-4">
        <h2 className="max-w-none">Know Where You Stand Before You Apply</h2>
        <p className="muted text-body max-w-lg">
          Upload your resume and a job description to get a match score and a gap analysis with a draft cover letter.
        </p>
        <div className="cta-row mt-2">
          <Button to="/analyze">Analyze My Match</Button>
          <Button to="/#features" variant="outline">See How It Works</Button>
        </div>
      </Reveal>
    </section>
  );
}
