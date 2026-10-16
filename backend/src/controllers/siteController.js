export function createSiteController(service) {
  return {
    // Consulta dados da academia.
    siteData: async (req, res) => {
      res.json(await service.siteData());
    },

    // Cadastro de aula experimental.
    trial: async (req, res) => {
      const result = await service.trial(req.body);
      res.status(201).json(result);
    },

    // Cadastro de interesse em planos.
    planInterest: async (req, res) => {
      const result = await service.planInterest(req.body);

      // 200 se já existia, 201 se acabou de criar.
      const statusCode = result.replayed ? 200 : 201;

      res.status(statusCode).json(result);
    },

    // Verifica a API e conexão com MySQL.
    health: async (req, res) => {
      res.json(await service.health());
    },
  };
}
