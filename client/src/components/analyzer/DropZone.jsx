import { useId, useState } from 'react';
import { MAX_FILE_SIZE_MB } from '../../lib/config';
import Icon from '../ui/Icon';

const MAX_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

function problemWith(file, accept) {
  const extensions = accept.split(',').map((ext) => ext.trim().toLowerCase());
  if (!extensions.some((ext) => file.name.toLowerCase().endsWith(ext))) {
    return `${file.name} is not a supported type. Use ${extensions.join(', ').toUpperCase().replaceAll('.', '')}.`;
  }
  if (file.size === 0) return `${file.name} is empty.`;
  if (file.size > MAX_BYTES) return `${file.name} is larger than ${MAX_FILE_SIZE_MB}\u00A0MB.`;
  return '';
}

export default function DropZone({ icon, label, accept, multiple = false, highlighted = false, className = 'p-6', onFiles, children }) {
  const [dragging, setDragging] = useState(false);
  const [problems, setProblems] = useState([]);
  const problemId = useId();

  const receive = (incoming) => {
    const usable = [];
    const refused = [];
    incoming.forEach((file) => {
      const problem = problemWith(file, accept);
      if (problem) refused.push(problem);
      else usable.push(file);
    });
    setProblems(refused);
    if (usable.length > 0) onFiles(multiple ? usable : usable.slice(0, 1));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    if (dropped.length > 0) receive(dropped);
  };

  const handleChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length > 0) receive(selected);
    e.target.value = '';
  };

  return (
    <>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex-1 flex items-center justify-center min-h-[200px] rounded-panel border border-dashed transition-colors cursor-pointer text-center focus-within:outline-2 focus-within:outline-offset-[3px] focus-within:outline-pricing-blue ${className} ${
          dragging || highlighted
            ? `border-ink bg-gallery-white shadow-subtle ${dragging ? 'scale-[1.015]' : ''}`
            : 'border-steel bg-gallery-white hover:border-ink'
        }`}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          aria-describedby={problems.length > 0 ? problemId : undefined}
          className="visually-hidden"
          onChange={handleChange}
        />
        <div className="flex flex-col items-center gap-2 min-w-0 max-w-full">
          <div className="w-10 h-10 rounded-full bg-pricing-blue/10 text-pricing-blue flex items-center justify-center">
            <Icon name={icon} className="w-5 h-5" />
          </div>
          <p className="text-body font-semibold">{label}</p>
          {children}
        </div>
      </label>

      {problems.length > 0 && (
        <div id={problemId} role="alert" className="notice text-compact break-words">
          {problems.map((problem) => (
            <p key={problem} dir="auto">{problem}</p>
          ))}
        </div>
      )}
    </>
  );
}
