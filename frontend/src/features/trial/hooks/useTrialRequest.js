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

    // Open within the user gesture; only navigate after successful persistence.
    const popup = window.open('about:blank', '_blank');
    if (popup) popup.opener = null;

    try {
      const data = await submitTrial(fields);
      setResult(data);
      setState('success');
      if (data.demo || !data.whatsapp_url) {
        popup?.close();
        return;
      }
      if (popup) popup.location.replace(data.whatsapp_url);
      else window.location.assign(data.whatsapp_url);
    } catch (failure) {
      popup?.close();
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
