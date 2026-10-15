import { useState } from 'react';
import { submitTrial } from '../../../services/api';

export default function useTrialRequest() {
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

    try {
      // Envia os dados para o back-end.
      const data = await submitTrial(fields);

      // O back-end salva os dados no MySQL.
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
