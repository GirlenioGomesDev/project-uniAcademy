import { AppError } from '../middleware/errors.js';

export function createSiteService(repository, whatsappNumber) {
  return {
    async siteData() {
      return {
        ...(await repository.getSiteData()),
        contact: {
          city: 'Recife, Pernambuco',
          whatsapp_url: whatsappNumber ? `https://wa.me/${whatsappNumber}` : null,
        },
        demo: true,
      };
    },

    async trial(data) {
      const modalidadeExiste = await repository.modalityExists(data.preferred_modality);

      if (!modalidadeExiste) {
        throw new AppError(400, 'INVALID_MODALITY', 'Escolha uma modalidade disponível.');
      }

      // Salva diretamente no MySQL.
      // WhatsApp ou Instagram não são necessários.
      const id = await repository.createTrial(data);

      return {
        id,
        status: 'pending',
        message: 'Solicitação cadastrada com sucesso!',
      };
    },

    async health() {
      await repository.health();

      return {
        status: 'ok',
        database: 'connected',
      };
    },
  };
}
