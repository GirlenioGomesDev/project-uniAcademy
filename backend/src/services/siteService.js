import { AppError } from '../middleware/errors.js';

// Verifica se uma chave está sendo reutilizada
// com exatamente os mesmos dados.
function isSameRequest(saved, data) {
  return (
    Number(saved.plan_id) === data.plan_id &&
    saved.client_name === data.client_name &&
    saved.phone === data.phone &&
    saved.email === data.email &&
    saved.preferred_date === data.preferred_date &&
    (saved.experience_level ?? null) === (data.experience_level || null) &&
    Boolean(saved.marketing_consent) === Boolean(data.marketing_consent)
  );
}

export function createSiteService(repository, whatsappNumber) {
  return {
    // Retorna os dados da academia.
    async siteData() {
      return {
        ...(await repository.getSiteData()),
        contact: {
          city: 'Recife, Pernambuco',
          whatsapp_url: whatsappNumber ? `https://wa.me/${whatsappNumber}` : null,
        },
        demo: false,
      };
    },

    // Cadastro de aula experimental.
    async trial(data) {
      const modalidadeExiste = await repository.modalityExists(data.preferred_modality);

      if (!modalidadeExiste) {
        throw new AppError(400, 'INVALID_MODALITY', 'Escolha uma modalidade disponível.');
      }

      const id = await repository.createTrial(data);

      return {
        id,
        status: 'pending',
        message: 'Solicitação cadastrada com sucesso!',
      };
    },

    // Cadastro de interesse nos planos.
    async planInterest(data) {
      // O plano deve existir no MySQL.
      const plan = await repository.findPlanById(data.plan_id);

      if (!plan) {
        throw new AppError(400, 'INVALID_PLAN', 'O plano selecionado não está disponível.');
      }

      // Prepara a confirmação.
      const response = (id, replayed = false) => ({
        id,
        status: 'pending',
        plan: {
          id: plan.id,
          name: plan.name,
        },
        replayed,
        message: replayed
          ? 'Solicitação já registrada anteriormente.'
          : 'Interesse no plano registrado com sucesso!',
      });

      // Confere se a solicitação já existe.
      const existing = await repository.findPlanInterestByKey(data.idempotency_key);

      if (existing) {
        if (!isSameRequest(existing, data)) {
          throw new AppError(
            409,
            'IDEMPOTENCY_CONFLICT',
            'Esta chave já foi utilizada com outros dados.',
          );
        }

        return response(existing.id, true);
      }

      try {
        // Registra a solicitação no MySQL.
        const id = await repository.createPlanInterest(data);

        return response(id);
      } catch (error) {
        // Protege contra dois envios simultâneos.
        if (error.code !== 'ER_DUP_ENTRY') {
          throw error;
        }

        const saved = await repository.findPlanInterestByKey(data.idempotency_key);

        if (!saved) {
          throw error;
        }

        if (!isSameRequest(saved, data)) {
          throw new AppError(
            409,
            'IDEMPOTENCY_CONFLICT',
            'Esta chave já foi utilizada com outros dados.',
          );
        }

        return response(saved.id, true);
      }
    },

    // Verifica o funcionamento do banco.
    async health() {
      await repository.health();

      return {
        status: 'ok',
        database: 'connected',
      };
    },
  };
}
