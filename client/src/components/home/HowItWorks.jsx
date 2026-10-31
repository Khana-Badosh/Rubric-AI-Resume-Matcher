import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import Reveal from '../ui/Reveal';
import { AnalysisRender, ResultsRender, UploadRender } from './Artifacts';

const STEPS = [
  {
    title: 'Upload Your Resume',
    description: 'Add a resume file up to 5\u00A0MB. Drag it in or click to browse.',
    Render: UploadRender,
  },
  {
    title: 'Analysis',
    description: 'We check your resume for keywords and layout and how well it reads to applicant tracking systems.',
    Render: AnalysisRender,
  },
  {
    title: 'Review Your Results',
    description: 'Get a clear report with scores and practical edits that strengthen your resume.',
    Render: ResultsRender,
  },
];

const AUTOPLAY_MS = 4500;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function HowItWorks() {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());
  const [paused, setPaused] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const measure = () => setOverflowing(track.scrollWidth > track.clientWidth + 2);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback((next) => {
    const track = trackRef.current;
    const card = track?.children[next];
    if (!card) return;
    track.scrollTo({ left: card.offsetLeft - (track.clientWidth - card.clientWidth) / 2, behavior: 'smooth' });
    setIndex(next);
  }, []);

  useEffect(() => {
    if (!overflowing || !playing || paused) return undefined;
    const timer = setTimeout(() => goTo((index + 1) % STEPS.length), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [index, overflowing, playing, paused, goTo]);

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track || !overflowing) return;
    const centre = track.scrollLeft + track.clientWidth / 2;
    let nearest = 0;
    let best = Infinity;
    Array.from(track.children).forEach((card, i) => {
      const distance = Math.abs(card.offsetLeft + card.clientWidth / 2 - centre);
      if (distance < best) {
        best = distance;
        nearest = i;
      }
    });
    setIndex(nearest);
  };

  return (
    <section id="features" className="band-mist py-(--section-gap)">
      <div className="container">
        <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
          <div className="flex flex-col gap-2">
            <h2>How It Works</h2>
            <p className="muted text-body">3 steps from upload to a complete report.</p>
          </div>
          <Link to="/analyze" className="arrow-link link text-body inline-flex items-center gap-1 shrink-0 py-2">
            Start Matching
            <Icon name="chevronRight" className="arrow w-4 h-4" />
          </Link>
        </Reveal>
      </div>

      <div
        className="snap-stage"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <ol ref={trackRef} onScroll={handleScroll} className="snap-track list-none m-0 py-1" aria-label="How it works">
          {STEPS.map((step) => {
            const Picture = step.Render;

            return (
              <li key={step.title} className="snap-card card-white p-7 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h3>{step.title}</h3>
                  <p className="muted text-compact">{step.description}</p>
                </div>
                <div className="mt-auto w-full max-w-[300px] mx-auto">
                  <Picture />
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {overflowing && (
        <div className="container flex justify-center mt-6">
          <div className="playback">
            {STEPS.map(({ title }, i) => (
              <button
                key={title}
                onClick={() => goTo(i)}
                className="dot"
                aria-label={`Show ${title}`}
                aria-current={i === index}
              />
            ))}
            <button
              onClick={() => setPlaying(!playing)}
              aria-label={playing ? 'Pause' : 'Play'}
              className="playback-toggle w-6 h-6 flex items-center justify-center text-ink/70 hover:text-ink"
            >
              <Icon name={playing ? 'pause' : 'play'} className="w-3.5 h-3.5" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
