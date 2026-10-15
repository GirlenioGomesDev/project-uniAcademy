import { getRecifeDate, getWeekday } from '../../../config/academy.js';

// Integration boundary: returns a DTO only. Never sends, stores or charges anything.
// The future backend must validate the plan and retrieve its own price/benefits.
export function preparePlanInterest(plan, fields) {
  if (!plan?.id) throw new Error('Selecione um plano disponível.');
  const name = fields.client_name.trim();
  const phone = fields.phone.replace(/\D/g, '');
  const email = fields.email.trim();
  if (name.length < 3) throw new Error('Informe seu nome completo.');
  if (!/^(?:55)?\d{10,11}$/.test(phone)) throw new Error('Informe um telefone válido com DDD.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Informe um e-mail válido.');
  const date = fields.preferred_date;
  const calendarDate = new Date(`${date}T12:00:00Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    Number.isNaN(calendarDate.getTime()) ||
    calendarDate.toISOString().slice(0, 10) !== date ||
    date < getRecifeDate()
  )
    throw new Error('Escolha uma data válida a partir de hoje.');
  if (getWeekday(date) === 7)
    throw new Error('A academia não funciona aos domingos. Escolha outra data.');
  if (!fields.consent) throw new Error('Autorize o uso dos dados para preparar a prévia.');
  return {
    schema_version: '1.1',
    plan_id: plan.id,
    client_name: name,
    phone,
    email,
    preferred_date: date,
    experience_level: fields.experience_level || null,
    consent: true,
    marketing_consent: fields.marketing_consent === true,
  };
}
