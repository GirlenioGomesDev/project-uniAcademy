import { useEffect, useState } from 'react';
import { getSiteData } from '../../../services/api';

export default function useSiteData() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setError('');
    setData(null);
    getSiteData(controller.signal)
      .then((catalog) => {
        if (!controller.signal.aborted) setData(catalog);
      })
      .catch((failure) => {
        if (controller.signal.aborted) return;
        setError('Não foi possível carregar o catálogo. Verifique a conexão e tente novamente.');
      });
    return () => controller.abort();
  }, [attempt]);
  return { data, error, retry: () => setAttempt((value) => value + 1) };
}
