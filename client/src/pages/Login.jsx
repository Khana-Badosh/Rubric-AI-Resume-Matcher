import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/auth/AuthForm';

const FIELDS = [
  { name: 'email', label: 'Email address', type: 'email', placeholder: 'you@example.com', autoComplete: 'email' },
  { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password', autoComplete: 'current-password' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <AuthForm
      eyebrow="Welcome back"
      title="Log in"
      switchText="Don’t have an account?"
      switchLabel="Sign up"
      switchTo="/signup"
      submitLabel="Log in"
      pendingLabel="Logging in…"
      fields={FIELDS}
      onSubmit={async ({ email, password }) => {
        await login(email, password);
        navigate('/analyze');
      }}
    />
  );
}
