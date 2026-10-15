import { useState } from 'react';
import { preparePlanInterest } from '../services/planInterest';

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
  function update(name, value) {
    setFields((previous) => ({
      ...previous,
      [name]: value,
    }));
    setError('');
  }
  function review(event) {
    event.preventDefault();
    try {
      setDraft(preparePlanInterest(plan, fields));
      setError('');
    } catch (failure) {
      setError(failure.message);
    }
  }
  return { fields, draft, error, update, review, edit: () => setDraft(null) };
}
