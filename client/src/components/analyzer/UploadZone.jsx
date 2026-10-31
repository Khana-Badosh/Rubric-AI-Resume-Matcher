import { MAX_FILE_SIZE_MB } from '../../lib/config';
import Icon from '../ui/Icon';
import DropZone from './DropZone';

export default function UploadZone({ label, icon, accept, hint = `PDF or DOCX up to ${MAX_FILE_SIZE_MB}\u00A0MB`, file, onFile }) {
  return (
    <div className="flex flex-1 flex-col">
      <DropZone icon={icon} label={label} accept={accept} highlighted={!!file} onFiles={([f]) => onFile(f)}>
        {file ? (
          <div className="chip max-w-full bg-pricing-blue/10 text-pricing-blue">
            <Icon name="check" className="w-3.5 h-3.5 shrink-0" />
            <span dir="auto" className="truncate min-w-0">{file.name}</span>
          </div>
        ) : (
          <>
            <p className="text-compact">Drag a file here or click to browse</p>
            <p className="muted text-compact">{hint}</p>
          </>
        )}
      </DropZone>

      {file && (
        <button
          onClick={() => onFile(null)}
          aria-label={`Remove ${file.name}`}
          className="link-quiet underline text-compact mt-3"
        >
          Remove
        </button>
      )}
    </div>
  );
}
