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
      if (!(await repository.modalityExists(data.preferred_modality)))
        throw new AppError(400, 'INVALID_MODALITY', 'Escolha uma modalidade disponível.');
      if (!whatsappNumber)
        throw new AppError(503, 'CONTACT_NOT_CONFIGURED', 'Contato indisponível.');
      const id = await repository.createTrial(data);
      const message = `Olá, UniAcademy! Sou ${data.client_name} e gostaria de uma aula experimental de ${data.preferred_modality}. Solicitação #${id}. Aguardo confirmação da disponibilidade.`;
      return {
        id,
        status: 'pending',
        whatsapp_url: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      };
    },
    async health() {
      await repository.health();
      return { status: 'ok', database: 'connected' };
    },
  };
}
