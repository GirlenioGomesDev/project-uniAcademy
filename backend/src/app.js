import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { randomUUID } from 'node:crypto';
import swaggerUi from 'swagger-ui-express';
import { openapi } from './config/swagger.js';
import { env } from './config/env.js';
import { siteRepository } from './repositories/siteRepository.js';
import { createSiteService } from './services/siteService.js';
import { apiRoutes } from './routes/api.js';
import { AppError, errorHandler } from './middleware/errors.js';
export function createApp(service = createSiteService(siteRepository, env.WHATSAPP_NUMBER)) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use((req, res, next) => {
    req.id = randomUUID();
    res.setHeader('X-Request-Id', req.id);
    next();
  });
  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || env.CORS_ORIGINS.split(',').includes(origin)) return callback(null, true);
        callback(new AppError(403, 'ORIGIN_DENIED', 'Origem não permitida.'));
      },
    }),
  );
  app.use(express.json({ limit: '16kb' }));
  app.get('/api/openapi.json', (req, res) => res.json(openapi));
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapi));
  app.use('/api', apiRoutes(service));
  app.use((req, res, next) => next(new AppError(404, 'NOT_FOUND', 'Rota não encontrada.')));
  app.use(errorHandler);
  return app;
}
