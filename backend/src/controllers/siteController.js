export function createSiteController(service) {
  return {
    siteData: async (req, res) => res.json(await service.siteData()),
    trial: async (req, res) => res.status(201).json(await service.trial(req.body)),
    health: async (req, res) => res.json(await service.health()),
  };
}
