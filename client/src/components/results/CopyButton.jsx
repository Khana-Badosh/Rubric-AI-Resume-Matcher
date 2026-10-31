import { useEffect, useRef, useState } from 'react';
import Button from '../ui/Button';
import Icon from '../ui/Icon';

const LABELS = { idle: 'Copy', copied: 'Copied', failed: 'Copy failed' };

export default function CopyButton({ text }) {
  const [status, setStatus] = useState('idle');
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('idle'), 2000);
  };

  return (
    <>
      <Button size="sm" onClick={handleCopy}>
        <Icon name={status === 'copied' ? 'check' : 'copy'} className="w-3.5 h-3.5" />
        {LABELS[status]}
      </Button>
      <span className="visually-hidden" role="status" aria-live="polite">
        {status === 'copied' ? 'Copied to clipboard' : status === 'failed' ? 'Could not copy to clipboard' : ''}
      </span>
    </>
  );
}
