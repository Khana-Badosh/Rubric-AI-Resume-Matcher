import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Logo from '../ui/Logo';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/#features', label: 'Features' },
  { to: '/analyze', label: 'Analyze' },
];

const mobileLink = 'flex items-center min-h-12 text-body font-medium';

function NavLink({ to, className, onClick, children }) {
  const { pathname, hash } = useLocation();
  const [path, fragment] = to.split('#');
  const current = pathname === path && (fragment ? hash === `#${fragment}` : !hash);

  return (
    <Link to={to} className={className} onClick={onClick} aria-current={current ? 'page' : undefined}>
      {children}
    </Link>
  );
}

function HamburgerIcon({ open }) {
  const bar = 'h-0.5 w-full bg-ink rounded-full';

  return (
    <div className="w-5 h-3.5 relative flex flex-col justify-between items-center" aria-hidden="true">
      <span className={`${bar} transition-transform duration-200 ${open ? 'rotate-45 translate-y-[6px]' : ''}`} />
      <span className={`${bar} transition-transform duration-200 ${open ? '-rotate-45 -translate-y-[6px]' : ''}`} />
    </div>
  );
}

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;
    const toggle = toggleRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    menuRef.current?.querySelector('a, button')?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        toggle?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    close();
  };

  return (
    <>
      <header
        className={`nav-bar fixed inset-x-0 top-0 z-300 ${scrolled ? 'is-scrolled' : ''}`}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <nav className="container grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center h-13">
          <div className="justify-self-start">
            <Logo />
          </div>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.label} {...link} className="nav-link">{link.label}</NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4 justify-self-end">
            {isLoggedIn ? (
              <>
                <span className="nav-link" aria-hidden="true">{user.email[0].toUpperCase()}</span>
                <button onClick={handleLogout} className="nav-link">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Button to="/login" variant="outline" size="md">Log in</Button>
                <Button to="/signup" size="md">Sign up</Button>
              </>
            )}
          </div>

          <button
            ref={toggleRef}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="md:hidden w-11 h-11 rounded-full flex items-center justify-center hover:bg-studio-mist transition-colors"
          >
            <HamburgerIcon open={isOpen} />
          </button>
        </nav>
      </header>

      {isOpen && (
        <div id="mobile-menu" className="fixed inset-0 z-200 md:hidden pt-13 px-4 overscroll-contain">
          <button
            type="button"
            aria-label="Close menu"
            tabIndex={-1}
            className="absolute inset-0 bg-ink/30 cursor-default"
            onClick={close}
          />
          <div ref={menuRef} className="menu-enter relative mt-3 bg-paper-frost rounded-panel border border-control-gray px-5 py-2 max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain">
            <div className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <NavLink key={link.label} {...link} className={mobileLink} onClick={close}>{link.label}</NavLink>
              ))}
              <div className="flex flex-col gap-3 pt-3 pb-4">
                {isLoggedIn ? (
                  <>
                    <p className="text-compact muted break-all">Logged in as <strong className="text-ink font-medium">{user.email}</strong></p>
                    <button onClick={handleLogout} className="link text-compact self-start min-h-11">Log out</button>
                  </>
                ) : (
                  <div className="flex flex-col min-[340px]:flex-row gap-3">
                    <Button to="/login" variant="outline" size="md" className="flex-1" onClick={close}>Log in</Button>
                    <Button to="/signup" size="md" className="flex-1" onClick={close}>Sign up</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
