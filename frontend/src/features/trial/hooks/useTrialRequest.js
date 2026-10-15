import { useRef, useState } from 'react';
import { submitTrial } from '../../../services/api';

export default function useTrialRequest() {
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const pending = useRef(false);

  async function submit(event) {
    event.preventDefault();
    if (pending.current) return;
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    fields.phone = fields.phone.replace(/\D/g, '');
    fields.consent = fields.consent === 'on';
    pending.current = true;
    setState('loading');
    setError('');

    try {
      const registration = await submitTrial(fields);
      setResult(registration);
      setState('success');
    } catch (failure) {
      setError(
        failure.name === 'TimeoutError'
          ? 'Não foi possível confirmar o cadastro a tempo. Confira a solicitação antes de repetir o envio.'
          : failure.message,
      );
      setState('idle');
    } finally {
      pending.current = false;
    }
  }

  return { state, error, result, submit };
}
