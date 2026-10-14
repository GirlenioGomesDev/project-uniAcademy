const base = import.meta.env.VITE_API_URL || '/api';
async function request(path, options = {}) {
  const timeout = AbortSignal.timeout(12000);
  const response = await fetch(`${base}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    signal: options.signal ? AbortSignal.any([options.signal, timeout]) : timeout,
  });
  const data = await response.json().catch(() => {
    throw new Error('Resposta inválida do serviço.');
  });
  if (!response.ok)
    throw new Error(data.error?.message || 'Não foi possível concluir. Tente novamente.');
  return data;
}
export const getSiteData = async (signal) => {
  const data = await request('/site-data', { signal });
  if (
    !Array.isArray(data.plans) ||
    !Array.isArray(data.modalities) ||
    !Array.isArray(data.schedules)
  )
    throw new Error('Catálogo inválido.');
  return data;
};
export const submitTrial = (data) =>
  request('/trial-request', { method: 'POST', body: JSON.stringify(data) });
