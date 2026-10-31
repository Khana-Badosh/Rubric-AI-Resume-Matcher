import { Link } from 'react-router-dom';
import { BRAND } from '../../lib/config';
import Logo from '../ui/Logo';

export default function Footer() {
  return (
    <footer className="band-mist border-t border-hairline-silver py-10">
      <div className="container flex flex-col items-center text-center md:grid md:grid-cols-[1fr_auto_1fr] gap-5 md:gap-6">
        <div className="md:justify-self-start"><Logo size="sm" /></div>

        <p className="text-global-nav muted">© {new Date().getFullYear()} <span translate="no">{BRAND}</span>. All rights reserved.</p>

        <div className="flex items-center gap-6 text-global-nav md:justify-self-end">
          <Link to="/privacy" className="link-quiet">Privacy</Link>
          <Link to="/terms" className="link-quiet">Terms</Link>
          <Link to="/analyze" className="link-quiet">Analyze</Link>
        </div>
      </div>
    </footer>
  );
}
