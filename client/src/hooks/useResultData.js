import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { apiRequest } from '../lib/api';

export default function useResultData(path) {
  const { state } = useLocation();
  const [attempt, setAttempt] = useState(0);
  const [fetched, setFetched] = useState({ key: null, data: null, error: '' });
  const key = `${path}#${attempt}`;

  useEffect(() => {
    if (state) return undefined;

    const controller = new AbortController();
    apiRequest(path, { signal: controller.signal })
      .then((data) => setFetched({ key, data, error: '' }))
      .catch((err) => err.name !== 'AbortError' && setFetched({ key, data: null, error: err.message }));

    return () => controller.abort();
  }, [path, key, state]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  if (state) return { data: state, loading: false, error: '', retry };
  if (fetched.key !== key) return { data: null, loading: true, error: '', retry };
  return { data: fetched.data, loading: false, error: fetched.error, retry };
}
