export function createSiteController(service) {
  return {
    siteData: async (req, res) => res.json(await service.siteData()),
    trial: async (req, res) => {
      const result = await service.trial(req.body);
      return res.status(result.demo ? 200 : 201).json(result);
    },
    health: async (req, res) => res.json(await service.health()),
  };
}
