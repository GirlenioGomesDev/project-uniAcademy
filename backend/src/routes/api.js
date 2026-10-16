import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';

import { validateTrial, validatePlanInterest } from '../middleware/validate.js';

import { createSiteController } from '../controllers/siteController.js';

export function apiRoutes(service) {
  const router = Router();
  const controller = createSiteController(service);

  // Dados da academia e saúde da API.
  router.get('/site-data', controller.siteData);
  router.get('/health', controller.health);

  // Cadastro de aula experimental.
  router.post(
    '/trial-request',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 10,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      message: {
        error: {
          code: 'RATE_LIMIT',
          message: 'Muitas solicitações. Aguarde alguns minutos.',
        },
      },
    }),
    validateTrial,
    controller.trial,
  );

  // Novo cadastro de interesse nos planos.
  router.post(
    '/plan-interest',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 10,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      message: {
        error: {
          code: 'RATE_LIMIT',
          message: 'Muitas solicitações. Aguarde alguns minutos.',
        },
      },
    }),
    validatePlanInterest,
    controller.planInterest,
  );

  return router;
}
