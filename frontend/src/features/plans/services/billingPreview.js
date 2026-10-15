// Presentation only. The server/payment provider must establish real charges.
export function getBillingPreview(plan, startDate) {
  const dayUse = Number(plan.duration_months) === 0;
  const amount = Math.round(Number(plan.price) * 100) / 100;
  const [year, month, day] = startDate.split('-').map(Number);
  const nextMonthLastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const next = new Date(Date.UTC(year, month, Math.min(day, nextMonthLastDay)));
  return {
    amount,
    firstDate: startDate,
    nextDate: dayUse ? null : next.toISOString().slice(0, 10),
    label: dayUse ? 'Acesso Day-use' : 'Mensalidade',
    recurring: !dayUse,
  };
}
