import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/NavBar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Analyzer from './pages/Analyzer';
import Results from './pages/Results';
import BatchResults from './pages/BatchResults';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { PRIVACY, TERMS } from './pages/legalContent';
import Legal from './pages/Legal';
import { BRAND } from './lib/config';

const PAGE_DESCRIPTION =
  'Upload your resume and a job description to get a match score and a skill gap check with a tailored cover letter.';

export default function App() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [pathname, hash]);

  useEffect(() => {
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', PAGE_DESCRIPTION);
    document.title = BRAND;
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>
      <Navbar />
      <div key={pathname} className="route-enter">
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analyze" element={<Analyzer />} />
        <Route path="/results/:id" element={<Results />} />
        <Route path="/batch-results/:id" element={<BatchResults />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/privacy" element={<Legal document={PRIVACY} />} />
        <Route path="/terms" element={<Legal document={TERMS} />} />
      </Routes>
      </div>
      <Footer />
    </>
  );
}
