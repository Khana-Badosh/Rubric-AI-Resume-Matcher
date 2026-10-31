import { API_URL } from './config';

const STATUS_MESSAGES = {
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to do that.',
  404: 'We could not find that. The link may be wrong or the report may have expired.',
  413: 'That file is too large. Try a smaller one.',
  429: 'Too many requests. Please wait a moment and try again.',
};

const OFFLINE_MESSAGE = 'We could not reach the server. Check your connection and try again.';
const TIMEOUT_MESSAGE = 'The request took too long. Please try again.';
const SERVER_MESSAGE = 'Something went wrong on our side. Please try again in a moment.';

const DEFAULT_TIMEOUT_MS = 120000;

export async function apiRequest(path, { timeout = DEFAULT_TIMEOUT_MS, ...options } = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, signal: options.signal ?? AbortSignal.timeout(timeout) });
  } catch (err) {
    if (err.name === 'TimeoutError') throw new Error(TIMEOUT_MESSAGE);
    if (err.name === 'AbortError') throw err;
    throw new Error(OFFLINE_MESSAGE);
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const fallback = res.status >= 500 ? SERVER_MESSAGE : STATUS_MESSAGES[res.status] ?? 'Request failed. Please try again.';
    throw Object.assign(new Error(res.status >= 500 ? fallback : data.error || fallback), { code: data.code, status: res.status });
  }
  return data;
}
