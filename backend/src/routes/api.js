import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { validateTrial } from '../middleware/validate.js';
import { createSiteController } from '../controllers/siteController.js';
export function apiRoutes(service) {
  const router = Router(),
    controller = createSiteController(service);
  router.get('/site-data', controller.siteData);
  router.get('/health', controller.health);
  router.post(
    '/trial-request',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 10,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      message: {
        error: { code: 'RATE_LIMIT', message: 'Muitas solicitações. Aguarde alguns minutos.' },
      },
    }),
    validateTrial,
    controller.trial,
  );
  return router;
}
