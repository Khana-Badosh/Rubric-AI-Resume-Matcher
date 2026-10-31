import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/auth/AuthForm';

const FIELDS = [
  { name: 'email', label: 'Email address', type: 'email', placeholder: 'you@example.com', autoComplete: 'email' },
  { name: 'password', label: 'Password', type: 'password', placeholder: 'At least 6 characters', autoComplete: 'new-password' },
  { name: 'confirm', label: 'Confirm password', type: 'password', placeholder: 'Re-enter your password', autoComplete: 'new-password' },
];

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();

  return (
    <AuthForm
      title="Create an account"
      switchText="Already have one?"
      switchLabel="Log in"
      switchTo="/login"
      submitLabel="Create account"
      pendingLabel="Creating account…"
      fields={FIELDS}
      onSubmit={async ({ email, password, confirm }) => {
        if (password !== confirm) throw new Error('Passwords do not match. Re-enter them and try again.');
        await register(email, password);
        navigate('/analyze');
      }}
    />
  );
}
