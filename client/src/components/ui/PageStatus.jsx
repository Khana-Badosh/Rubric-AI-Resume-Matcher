import { Link } from 'react-router-dom';
import Button from './Button';
import Page from './Page';

export default function PageStatus({ loading, error, onRetry }) {
  return (
    <Page center className="text-center">
      {loading ? (
        <p role="status" className="muted animate-pulse motion-reduce:animate-none">Loading your results…</p>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p role="alert" className="notice">{error}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {onRetry && <Button variant="outline" size="md" onClick={onRetry}>Try again</Button>}
            <Link to="/analyze" className="link text-body">
              Start a new analysis
            </Link>
          </div>
        </div>
      )}
    </Page>
  );
}
