import { DOCUMENT_ACCEPT, MAX_FILE_SIZE_MB } from '../../lib/config';
import Icon from '../ui/Icon';
import DropZone from './DropZone';

const isSameFile = (a, b) => a.name === b.name && a.size === b.size;

const formatKilobytes = (bytes) =>
  new Intl.NumberFormat(undefined, { style: 'unit', unit: 'kilobyte', maximumFractionDigits: 0 }).format(bytes / 1024);

export default function MultiUploadZone({ files, onFiles, maxFiles }) {
  const addFiles = (incoming) => {
    const combined = [...files, ...incoming];
    const unique = combined.filter((file, i) => combined.findIndex((other) => isSameFile(other, file)) === i);
    onFiles(unique.slice(0, maxFiles));
  };

  return (
    <div className="flex flex-1 flex-col gap-3">
      <DropZone icon="document" label="Candidate resumes" accept={DOCUMENT_ACCEPT} multiple className="p-6 min-h-[150px]" onFiles={addFiles}>
        <p className="text-compact">Drag files here or click to browse</p>
        <p className="muted text-compact">PDF or DOCX. Up to {maxFiles} files at {MAX_FILE_SIZE_MB}&nbsp;MB each</p>
      </DropZone>

      {files.length > 0 && (
        <ul className="card-white rows overflow-hidden list-none p-0 m-0">
          <li className="flex items-center justify-between px-5 py-3">
            <span className="text-compact font-medium">
              {files.length} resume{files.length > 1 ? 's' : ''} selected
            </span>
            <span className="text-compact muted tabular">
              {files.length}/{maxFiles} max
            </span>
          </li>

          {files.map((file, i) => (
            <li key={`${file.name}-${file.size}`} className="flex items-center gap-3 px-5 py-3">
              <div className="w-8 h-8 rounded-full bg-studio-mist flex items-center justify-center text-slate flex-shrink-0">
                <Icon name="document" className="w-4 h-4" />
              </div>
              <span dir="auto" className="text-compact font-medium flex-1 min-w-0 truncate" title={file.name}>{file.name}</span>
              <span className="text-compact muted flex-shrink-0 tabular">{formatKilobytes(file.size)}</span>
              <button
                onClick={() => onFiles(files.filter((_, index) => index !== i))}
                aria-label={`Remove ${file.name}`}
                className="w-9 h-9 pointer-coarse:w-11 pointer-coarse:h-11 rounded-full hover:bg-studio-mist transition-colors flex items-center justify-center flex-shrink-0"
              >
                <Icon name="close" className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
