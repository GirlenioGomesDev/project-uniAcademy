import { useState } from 'react';
import { submitTrial } from '../../../services/api';

export default function useTrialRequest(demo = false) {
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  async function submit(event) {
    event.preventDefault();
    if (state === 'loading') return;
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    fields.phone = fields.phone.replace(/\D/g, '');
    fields.consent = fields.consent === 'on';
    setState('loading');
    setError('');
    if (demo) {
      setResult({ demo: true, stored: false, whatsapp_url: null });
      setState('success');
      return;
    }

    try {
      const data = await submitTrial(fields);
      setResult(data);
      setState('success');
    } catch (failure) {
      setError(
        failure.name === 'TimeoutError'
          ? 'Tempo de conexão excedido. Tente novamente.'
          : failure.message,
      );
      setState('idle');
    }
  }

  return { state, error, result, submit };
}
