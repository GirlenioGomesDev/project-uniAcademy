const base = import.meta.env.VITE_API_URL || '/api';
async function request(path, options = {}) {
  const timeout = AbortSignal.timeout(12000);
  const response = await fetch(`${base}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    signal: options.signal ? AbortSignal.any([options.signal, timeout]) : timeout,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(data.error?.message || 'Não foi possível concluir. Tente novamente.');
  return data;
}
export const getSiteData = (signal) => request('/site-data', { signal });
export const submitTrial = (data) =>
  request('/trial-request', { method: 'POST', body: JSON.stringify(data) });
