import { useEffect, useState } from 'react';
import { getSiteData } from '../../../services/api';
import { demoCatalog } from '../../../../../shared/siteCatalog.js';

export default function useSiteData() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setError('');
    getSiteData(controller.signal)
      .then(setData)
      .catch((failure) => {
        if (failure.name === 'AbortError') return;
        if (import.meta.env.DEV) setData({ ...demoCatalog, source: 'offline-demo' });
        else setError('Não foi possível carregar o catálogo. Tente novamente em instantes.');
      });
    return () => controller.abort();
  }, [attempt]);
  return { data, error, retry: () => setAttempt((value) => value + 1) };
}
