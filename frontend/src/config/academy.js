export const WEEK_DAYS = [
  { value: 1, label: 'Segunda-feira', short: 'SEG', opens: '06:00', closes: '23:00' },
  { value: 2, label: 'Terça-feira', short: 'TER', opens: '06:00', closes: '23:00' },
  { value: 3, label: 'Quarta-feira', short: 'QUA', opens: '06:00', closes: '23:00' },
  { value: 4, label: 'Quinta-feira', short: 'QUI', opens: '06:00', closes: '23:00' },
  { value: 5, label: 'Sexta-feira', short: 'SEX', opens: '06:00', closes: '23:00' },
  { value: 6, label: 'Sábado', short: 'SÁB', opens: '08:00', closes: '14:00' },
  { value: 7, label: 'Domingo', short: 'DOM', opens: null, closes: null },
];

export const OPENING_PERIODS = [
  { label: 'Segunda a sexta', hours: '06h às 23h' },
  { label: 'Sábado', hours: '08h às 14h' },
  { label: 'Domingos e feriados', hours: 'Fechado' },
];
export const OPENING_SUMMARY = 'Seg–sex 06h–23h • Sáb 08h–14h';

export function getRecifeDate() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Recife',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const value = (type) => parts.find((part) => part.type === type).value;
  return `${value('year')}-${value('month')}-${value('day')}`;
}

export function getWeekday(date = getRecifeDate()) {
  const day = new Date(`${date}T12:00:00Z`).getUTCDay();
  return day === 0 ? 7 : day;
}

export const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value));
