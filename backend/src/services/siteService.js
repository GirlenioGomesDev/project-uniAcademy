import { AppError } from '../middleware/errors.js';
import { demoContact } from '../../../shared/siteCatalog.js';

export function createSiteService(repository, whatsappNumber, { demoMode = false } = {}) {
  return {
    async siteData() {
      return {
        ...(await repository.getSiteData()),
        contact: demoMode
          ? { ...demoContact, whatsapp_url: null }
          : { city: 'Recife, Pernambuco', whatsapp_url: whatsappNumber ? `https://wa.me/${whatsappNumber}` : null },
        demo: demoMode,
      };
    },

    async trial(data) {
      const modalidadeExiste = await repository.modalityExists(data.preferred_modality);
      if (!modalidadeExiste) {
        throw new AppError(400, 'INVALID_MODALITY', 'Escolha uma modalidade disponível.');
      }
      if (demoMode) {
        return {
          id: null,
          status: 'demo',
          demo: true,
          stored: false,
          message: 'Solicitação demonstrativa. Nenhum cadastro foi salvo.',
        };
      }
      // O modo real sempre persiste no MySQL, mesmo sem WhatsApp configurado.
      const id = await repository.createTrial(data);
      return { id, status: 'pending', message: 'Solicitação cadastrada com sucesso!' };
    },

    async health() {
      await repository.health();
      return { status: 'ok', database: demoMode ? 'demo' : 'connected' };
    },
  };
}
