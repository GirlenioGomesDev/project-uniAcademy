const base = (import.meta.env.VITE_API_URL?.trim() || '/api').replace(/\/+$/, '');

// Função responsável pelas requisições HTTP.
async function request(path, options = {}) {
  const timeout = AbortSignal.timeout(12000);

  const response = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    signal: options.signal ? AbortSignal.any([options.signal, timeout]) : timeout,
  });

  const data = await response.json().catch(() => {
    throw new Error('Resposta inválida do serviço.');
  });

  if (!response.ok) {
    throw new Error(data.error?.message || 'Não foi possível concluir. Tente novamente.');
  }

  return data;
}

// Busca planos, modalidades e horários.
export const getSiteData = async (signal) => {
  const data = await request('/site-data', { signal });

  if (
    !Array.isArray(data.plans) ||
    !Array.isArray(data.modalities) ||
    !Array.isArray(data.schedules)
  ) {
    throw new Error('Catálogo inválido.');
  }

  return data;
};

// Cadastra uma solicitação de aula experimental.
export const submitTrial = async (data) => {
  const result = await request('/trial-request', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!result || result.status !== 'pending' || !/^[1-9]\d*$/.test(String(result.id))) {
    throw new Error(
      'O serviço não confirmou o cadastro. Confira a solicitação antes de tentar novamente.',
    );
  }

  return result;
};

// NOVA FUNÇÃO: Envia o interesse em um plano.
// A chave deve ser criada pelo formulário e reutilizada
// caso o usuário precise repetir o mesmo envio.
export const submitPlanInterest = async (data) => {
  if (!data?.idempotency_key) {
    throw new Error('Identificador da solicitação não informado.');
  }

  const result = await request('/plan-interest', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  // Somente confirma o cadastro quando a API retornar
  // um ID verdadeiro e o status esperado.
  if (!result || result.status !== 'pending' || !/^[1-9]\d*$/.test(String(result.id))) {
    throw new Error(
      'O servidor não confirmou o interesse no plano. Confira a solicitação antes de tentar novamente.',
    );
  }

  return result;
};
