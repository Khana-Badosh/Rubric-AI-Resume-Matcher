import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App.jsx';
import './index.css';

const addLink = (attributes) => {
  const link = document.createElement('link');
  Object.entries(attributes).forEach(([name, value]) => link.setAttribute(name, value));
  document.head.appendChild(link);
};
addLink({ rel: 'preconnect', href: 'https://fonts.googleapis.com' });
addLink({ rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' });
addLink({ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400..600&display=swap' });

document.documentElement.classList.add('js');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
