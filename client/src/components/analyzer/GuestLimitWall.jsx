import { Link } from 'react-router-dom';
import { GUEST_LIMIT } from '../../lib/config';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import Page from '../ui/Page';

export default function GuestLimitWall() {
  return (
    <Page center width="max-w-md">
      <div className="card p-8">
        <div className="w-14 h-14 rounded-full bg-ink text-gallery-white flex items-center justify-center mb-6">
          <Icon name="lock" className="w-6 h-6" />
        </div>
        <h1 className="text-feature mb-3 max-w-none">Guest limit reached</h1>
        <p className="muted text-body mb-8">
          You have used all {GUEST_LIMIT} free submissions. Create a free account for unlimited access; setup takes about 30 seconds.
        </p>
        <div className="flex flex-col gap-4 items-start">
          <Button to="/signup" block>Create free account</Button>
          <Link to="/login" className="link text-compact">
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </Page>
  );
}
