
import { useRef, useState } from 'react';
import { preparePlanInterest } from '../services/planInterest';
import { submitPlanInterest } from '../../../services/api';

const initialFields = {
  client_name: '',
  phone: '',
  email: '',
  preferred_date: '',
  experience_level: '',
  consent: false,
  marketing_consent: false,
};

export default function usePlanInterest(plan) {
  const [fields, setFields] = useState(initialFields);
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState('');
  const [state, setState] = useState('idle');
  const [result, setResult] = useState(null);

  const idempotencyKey = useRef(null);
  const pending = useRef(false);

  // Atualiza os campos do formulário.
  function update(name, value) {
    setFields((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError('');
  }

  // Prepara a revisão antes do envio.
  function review(event) {
    event.preventDefault();

    try {
      const prepared = preparePlanInterest(plan, fields);

      setDraft(prepared);
      idempotencyKey.current = crypto.randomUUID();

      setError('');
      setResult(null);
      setState('idle');
    } catch (failure) {
      setError(failure.message);
    }
  }

  // Envia o interesse para o back-end.
  async function confirm() {
    if (!draft || pending.current || result) return;

    pending.current = true;
    setState('loading');
    setError('');

    try {
      const registration = await submitPlanInterest({
        ...draft,
        idempotency_key: idempotencyKey.current,
      });

      setResult(registration);
      setState('success');
    } catch (failure) {
      setError(
        failure.name === 'TimeoutError'
          ? 'A confirmação demorou. Tente novamente para verificar a solicitação.'
          : failure.message || 'Não foi possível registrar o interesse.',
      );

      setState('idle');
    } finally {
      pending.current = false;
    }
  }

  // Permite voltar e modificar os dados.
  function edit() {
    setDraft(null);
    setError('');
    setResult(null);
    setState('idle');
    idempotencyKey.current = null;
  }

  return {
    fields,
    draft,
    error,
    state,
    result,
    update,
    review,
    confirm,
    edit,
  };
}
