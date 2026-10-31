import { DOCUMENT_ACCEPT, MAX_FILE_SIZE_MB } from '../../lib/config';
import StepHeading from './StepHeading';
import UploadZone from './UploadZone';

const INPUT_MODES = [
  { id: 'upload', label: 'Upload file' },
  { id: 'paste', label: 'Paste text' },
];

export default function JobDescriptionInput({ inputMode, onInputModeChange, text, onTextChange, file, onFileChange }) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <StepHeading number={2} title="Job description">
        <div className="flex items-center gap-1 bg-hairline-silver/60 rounded-full p-1">
          {INPUT_MODES.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onInputModeChange(id)}
              aria-pressed={inputMode === id}
              className={`px-3.5 h-8 sm:h-7 pointer-coarse:h-10 rounded-full text-caption font-medium whitespace-nowrap transition-colors ${
                inputMode === id ? 'bg-gallery-white text-ink shadow-subtle' : 'muted hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </StepHeading>

      {inputMode === 'upload' ? (
        <UploadZone
          label="Job description"
          accept={DOCUMENT_ACCEPT}
          hint={`PDF or DOCX up to ${MAX_FILE_SIZE_MB}\u00A0MB`}
          icon="briefcase"
          file={file}
          onFile={onFileChange}
        />
      ) : (
        <div className="relative flex flex-1 flex-col">
          <label htmlFor="job-text" className="visually-hidden">Job description</label>
          <textarea
            id="job-text"
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Paste the job description here. The responsibilities and requirements give the best match."
            rows={8}
            className="field field-area flex-1 min-h-[200px] resize-none leading-relaxed placeholder:text-compact placeholder:text-steel"
          />
          {text.length > 0 && (
            <span className="absolute bottom-3 right-5 text-caption muted tabular">{new Intl.NumberFormat().format(text.length)}&nbsp;chars</span>
          )}
        </div>
      )}
    </div>
  );
}
