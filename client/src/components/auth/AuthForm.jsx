import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { GUEST_LIMIT } from '../../lib/config';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import Page from '../ui/Page';
import SectionHeading from '../ui/SectionHeading';

export default function AuthForm({ eyebrow, title, switchText, switchLabel, switchTo, submitLabel, pendingLabel, fields, onSubmit }) {
  const [values, setValues] = useState(() => Object.fromEntries(fields.map((f) => [f.name, ''])));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(() => new Set());
  const idPrefix = useId();
  const errorRef = useRef(null);
  const errorId = `${idPrefix}-error`;

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page center width="max-w-md">
      <SectionHeading eyebrow={eyebrow} title={title} className="mb-10">
        <p className="muted text-body">
          {switchText}{' '}
          <Link to={switchTo} className="link">{switchLabel}</Link>
        </p>
      </SectionHeading>

      <div className="card p-6 md:p-8">
        <Alert id={errorId} ref={errorRef} tabIndex={-1} className="mb-6">{error}</Alert>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {fields.map(({ name, label, type, placeholder, autoComplete }) => (
            <div key={name}>
              <label htmlFor={`${idPrefix}-${name}`} className="field-label">{label}</label>
              <div className="relative">
                <input
                  id={`${idPrefix}-${name}`}
                  name={name}
                  autoComplete={autoComplete}
                  spellCheck={type === 'email' ? false : undefined}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? errorId : undefined}
                  type={type === 'password' && revealed.has(name) ? 'text' : type}
                  value={values[name]}
                  onChange={(e) => setValues({ ...values, [name]: e.target.value })}
                  placeholder={placeholder}
                  required
                  className={`field ${type === 'password' ? 'field-action' : ''}`}
                />
                {type === 'password' && (
                  <button
                    type="button"
                    onClick={() => {
                      const next = new Set(revealed);
                      if (next.has(name)) next.delete(name);
                      else next.add(name);
                      setRevealed(next);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center min-h-11 min-w-11 link text-compact muted hover:text-ink underline"
                  >
                    {revealed.has(name) ? 'Hide' : 'Show'}
                  </button>
                )}
              </div>
            </div>
          ))}
          <Button type="submit" block disabled={loading} className="mt-2">
            {loading ? pendingLabel : submitLabel}
          </Button>
        </form>
      </div>

      <p className="text-compact muted text-center mt-6 mx-auto">
        Or{' '}
        <Link to="/analyze" className="link">continue as guest</Link>
        {' '}({GUEST_LIMIT} free analyses)
      </p>
    </Page>
  );
}
