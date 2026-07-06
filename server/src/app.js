import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import { healthRouter } from './routes/health.js';
import { legacyRouter } from './routes/legacy.js';
import { requestContext } from './middleware/requestContext.js';
import { globalErrorHandler, notFoundHandler } from './middleware/errorHandlers.js';
import { createApiRateLimiter } from './middleware/security.js';
import { ApiError } from './errors/ApiError.js';

export function createApp(config) {
  const {
    clientOrigins,
    jsonBodyLimit,
    rateLimitWindowMs,
    rateLimitMax,
    trustProxy,
    compressionEnabled,
  } = config;

  const app = express();
  const apiRateLimiter = createApiRateLimiter({ windowMs: rateLimitWindowMs, max: rateLimitMax });

  app.locals.startedAt = Date.now();
  app.locals.isShuttingDown = false;

  const corsOptions = {
    origin(origin, callback) {
      if (!origin || clientOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new ApiError(403, `Origin not allowed: ${origin}`, 'CORS_ORIGIN_DENIED'));
    },
    credentials: true,
  };

  app.disable('x-powered-by');
  app.set('trust proxy', trustProxy);
  app.use(helmet());
  app.use(requestContext);
  app.use(cors(corsOptions));

  if (compressionEnabled) {
    app.use(compression());
  }

  app.use(express.json({ limit: jsonBodyLimit }));

  app.use((req, res, next) => {
    const isHealthRoute = req.path.startsWith('/api/health');

    if (app.locals.isShuttingDown && !isHealthRoute) {
      res.setHeader('Retry-After', '10');
      return res.status(503).json({
        ok: false,
        error: 'Service Unavailable',
        reason: 'Server is shutting down',
        requestId: req.requestId,
      });
    }

    return next();
  });

  app.use('/api', apiRateLimiter);

  app.get('/', (_req, res) => {
    res.json({
      ok: true,
      service: 'lifeos-server',
      message: 'LifeOS backend is running',
    });
  });

  app.use('/api/health', healthRouter);
  app.use('/api/legacy', legacyRouter);

  app.use(notFoundHandler);
  app.use(globalErrorHandler);

  return app;
}
