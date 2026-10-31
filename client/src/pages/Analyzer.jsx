import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';
import { DOCUMENT_ACCEPT, GUEST_LIMIT, GUEST_MAX_FILES, USER_MAX_FILES } from '../lib/config';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import Page from '../components/ui/Page';
import SectionHeading from '../components/ui/SectionHeading';
import GuestLimitWall from '../components/analyzer/GuestLimitWall';
import JobDescriptionInput from '../components/analyzer/JobDescriptionInput';
import LoadingScreen from '../components/analyzer/LoadingScreen';
import ModeCard from '../components/analyzer/ModeCard';
import MultiUploadZone from '../components/analyzer/MultiUploadZone';
import StepHeading from '../components/analyzer/StepHeading';
import UploadZone from '../components/analyzer/UploadZone';

const MIN_JOB_TEXT_LENGTH = 20;

const MODES = {
  seeker: {
    label: 'Job Seeker',
    blurb: 'Analyze your resume against a role',
    icon: 'user',
    title: 'Analyze Your Resume',
    description: 'Get a match score and a keyword gap analysis with suggestions and a tailored cover letter.',
    stepTitle: 'Your resume',
    endpoint: '/api/analyze',
    resultPath: (data) => `/results/${data.analysis_id}`,
    submitLabel: () => 'Analyze My Resume',
  },
  employer: {
    label: 'Employer',
    blurb: 'Rank multiple candidates by fit',
    icon: 'building',
    title: 'Rank Your Candidates',
    description: 'Compare multiple resumes against one job description and rank candidates by fit.',
    stepTitle: 'Candidate resumes',
    endpoint: '/api/batch',
    resultPath: (data) => `/batch-results/${data.batch_id}`,
    submitLabel: (count) => (count > 1 ? `Rank ${count} Candidates` : 'Rank Candidates'),
  },
};

const SEEKER_STEPS = [
  { label: 'Reading your resume…', duration: 2000 },
  { label: 'Analyzing language and structure…', duration: 4000 },
  { label: 'Scoring keyword matches…', duration: 3000 },
  { label: 'Preparing suggestions…', duration: 5000 },
  { label: 'Drafting your cover letter…', duration: 4000 },
];

const buildEmployerSteps = (count) => [
  { label: `Processing ${count} resume${count > 1 ? 's' : ''}…`, duration: 3000 },
  ...Array.from({ length: Math.min(count, 5) }, (_, i) => ({
    label: `Analyzing candidate ${i + 1} of ${count}…`,
    duration: 4000,
  })),
  { label: 'Ranking candidates…', duration: 2000 },
];

export default function Analyzer() {
  const navigate = useNavigate();
  const { isLoggedIn, guestRemaining, guestLimitHit, getAnalyzeHeaders, incrementGuestCount } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const modeKey = searchParams.get('mode') === 'employer' ? 'employer' : 'seeker';
  const jobInputMode = searchParams.get('jd') === 'upload' ? 'upload' : 'paste';
  const setQueryParam = (name, value, fallback) =>
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value === fallback) next.delete(name);
        else next.set(name, value);
        return next;
      },
      { replace: true }
    );
  const setModeKey = (key) => setQueryParam('mode', key, 'seeker');
  const setJobInputMode = (key) => setQueryParam('jd', key, 'paste');
  const [resumeFile, setResumeFile] = useState(null);
  const [batchFiles, setBatchFiles] = useState([]);
  const [jobText, setJobText] = useState('');
  const [jobFile, setJobFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [limitReached, setLimitReached] = useState(false);

  const mode = MODES[modeKey];
  const isSeeker = modeKey === 'seeker';
  const maxBatchFiles = isLoggedIn ? USER_MAX_FILES : GUEST_MAX_FILES;

  const jobReady = jobInputMode === 'paste' ? jobText.trim().length > MIN_JOB_TEXT_LENGTH : !!jobFile;
  const resumesReady = isSeeker ? !!resumeFile : batchFiles.length > 0;
  const canAnalyze = resumesReady && jobReady;

  const errorRef = useRef(null);
  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  const hasUnsentInput = !loading && (!!resumeFile || batchFiles.length > 0 || !!jobFile || jobText.trim().length > 0);
  useEffect(() => {
    if (!hasUnsentInput) return undefined;
    const warn = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [hasUnsentInput]);

  const loadingSteps = useMemo(
    () => (isSeeker ? SEEKER_STEPS : buildEmployerSteps(batchFiles.length)),
    [isSeeker, batchFiles.length]
  );

  const switchMode = (key) => {
    setModeKey(key);
    setError('');
  };

  const handleAnalyze = async () => {
    if (loading) return;
    if (!canAnalyze) {
      const missing = [];
      if (!resumesReady) missing.push(isSeeker ? 'your resume' : 'at least one resume');
      if (!jobReady) missing.push(jobInputMode === 'paste' ? `a job description of more than ${MIN_JOB_TEXT_LENGTH} characters` : 'a job description file');
      setError(`Add ${missing.join(' and ')} to continue.`);
      return;
    }
    if (!navigator.onLine) {
      setError('You appear to be offline. Reconnect and try again. Your files are still here.');
      return;
    }
    setError('');
    setLoading(true);

    const formData = new FormData();
    if (isSeeker) formData.append('resume', resumeFile);
    else batchFiles.forEach((file) => formData.append('resumes', file));

    if (jobInputMode === 'paste') formData.append('job_text', jobText.trim());
    else formData.append('job_file', jobFile);

    try {
      const data = await apiRequest(mode.endpoint, {
        method: 'POST',
        headers: getAnalyzeHeaders(),
        body: formData,
      });

      if (!isLoggedIn) incrementGuestCount();
      navigate(mode.resultPath(data), { state: data });
    } catch (err) {
      if (err.code === 'GUEST_LIMIT_REACHED') {
        setLimitReached(true);
        setLoading(false);
        return;
      }
      setError(err.message);
      setLoading(false);
    }
  };

  if (guestLimitHit || limitReached) return <GuestLimitWall />;
  if (loading) return <LoadingScreen steps={loadingSteps} />;

  const submitLabel = mode.submitLabel(batchFiles.length);

  return (
    <Page width="max-w-5xl">
      <SectionHeading eyebrow="Resume and job matcher" title={mode.title} description={mode.description} className="mb-8">
        {!isLoggedIn && (
          <div className="inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-full bg-studio-mist px-5 py-2">
            <span className="text-compact font-medium tabular">
              {guestRemaining} of {GUEST_LIMIT} free submissions remaining
            </span>
            <Link to="/signup" className="link text-compact">
              Sign up for unlimited access
            </Link>
          </div>
        )}
      </SectionHeading>

      <div className="mx-auto w-full max-w-sm mb-8">
        <div className="grid grid-cols-2 gap-1 rounded-full bg-studio-mist p-1" role="group" aria-label="Mode">
          {Object.entries(MODES).map(([key, m]) => (
            <ModeCard key={key} mode={m} selected={key === modeKey} onSelect={() => switchMode(key)} />
          ))}
        </div>
        <p className="muted text-caption text-center mt-3">{mode.blurb}</p>
      </div>

      <Alert id="analyze-error" ref={errorRef} tabIndex={-1} className="mb-5">{error}</Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <section className="rise card p-5 sm:p-6 flex flex-col gap-4" style={{ '--delay': '0.1s' }}>
          <StepHeading number={1} title={mode.stepTitle} />
          {isSeeker ? (
            <UploadZone
              label="Resume"
              accept={DOCUMENT_ACCEPT}
              icon="document"
              file={resumeFile}
              onFile={setResumeFile}
            />
          ) : (
            <MultiUploadZone files={batchFiles} onFiles={setBatchFiles} maxFiles={maxBatchFiles} />
          )}
        </section>

        <section className="rise card p-5 sm:p-6 flex flex-col gap-4" style={{ '--delay': '0.2s' }}>
          <JobDescriptionInput
            inputMode={jobInputMode}
            onInputModeChange={setJobInputMode}
            text={jobText}
            onTextChange={setJobText}
            file={jobFile}
            onFileChange={setJobFile}
          />
        </section>
      </div>

      <div className="cta-row mt-8">
        <Button
          onClick={handleAnalyze}
          aria-describedby={error ? 'analyze-error' : undefined}
          className="min-w-[220px]"
        >
          {submitLabel}
        </Button>
      </div>
    </Page>
  );
}
