import { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { apiRequest } from '../lib/api';
import { GUEST_LIMIT } from '../lib/config';

const TOKEN_KEY = 'token';
const GUEST_KEY = 'guest_id';

const AuthContext = createContext(null);

const postJson = (body) => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

async function restoreUser() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  try {
    const { user } = await apiRequest('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
    return user;
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
}

async function createGuestId() {
  try {
    const { guest_id: guestId } = await apiRequest('/api/auth/guest-session', { method: 'POST' });
    return guestId;
  } catch {
    return uuidv4();
  }
}

async function fetchGuestUsage(guestId) {
  try {
    const { analysis_count } = await apiRequest(`/api/auth/guest-status/${guestId}`);
    return analysis_count;
  } catch (err) {
    return err.status === 404 ? null : 0;
  }
}

async function loadGuest() {
  const stored = localStorage.getItem(GUEST_KEY);
  const used = stored ? await fetchGuestUsage(stored) : null;
  if (used !== null) return { guestId: stored, used };

  const guestId = await createGuestId();
  localStorage.setItem(GUEST_KEY, guestId);
  return { guestId, used: 0 };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [guestId, setGuestId] = useState(null);
  const [guestUsed, setGuestUsed] = useState(0);

  useEffect(() => {
    (async () => {
      setUser(await restoreUser());
      const { guestId: id, used } = await loadGuest();
      setGuestId(id);
      setGuestUsed(used);
    })();
  }, []);

  const authenticate = async (endpoint, email, password) => {
    const data = await apiRequest(`/api/auth/${endpoint}`, postJson({ email, password }));
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
    return data;
  };

  const login = (email, password) => authenticate('login', email, password);
  const register = (email, password) => authenticate('register', email, password);

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const isLoggedIn = !!user;

  const getAnalyzeHeaders = () =>
    isLoggedIn
      ? { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` }
      : { 'x-guest-id': guestId };

  const value = {
    user,
    isLoggedIn,
    login,
    register,
    logout,
    guestRemaining: Math.max(0, GUEST_LIMIT - guestUsed),
    guestLimitHit: !isLoggedIn && guestUsed >= GUEST_LIMIT,
    incrementGuestCount: () => setGuestUsed((used) => used + 1),
    getAnalyzeHeaders,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
