import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { healthRouter } from './routes/health.js';
import { legacyRouter } from './routes/legacy.js';
import { requestContext } from './middleware/requestContext.js';
import { globalErrorHandler, notFoundHandler } from './middleware/errorHandlers.js';
import { createApiRateLimiter } from './middleware/security.js';
import { config } from './config/env.js';

const app = express();
const { port, clientOrigins, jsonBodyLimit, shutdownTimeoutMs, nodeEnv, rateLimitWindowMs, rateLimitMax } = config;
const apiRateLimiter = createApiRateLimiter({ windowMs: rateLimitWindowMs, max: rateLimitMax });

const corsOptions = {
  origin(origin, callback) {
    if (!origin || clientOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin not allowed: ${origin}`));
  },
  credentials: true,
};

app.disable('x-powered-by');
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: jsonBodyLimit }));
app.use(requestContext);
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

const server = app.listen(port, () => {
  console.log(`LifeOS server running on http://localhost:${port}`);
  console.log(`[Environment] ${nodeEnv}`);
  console.log(`[CORS] allowed origins: ${clientOrigins.join(', ')}`);
  console.log(`[RateLimit] ${rateLimitMax} requests / ${rateLimitWindowMs}ms`);
});

let isShuttingDown = false;

function shutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`[Lifecycle] Received ${signal}. Starting graceful shutdown...`);

  const forceExitTimer = setTimeout(() => {
    console.error('[Lifecycle] Forced shutdown after timeout.');
    process.exit(1);
  }, shutdownTimeoutMs);

  forceExitTimer.unref();

  server.close((err) => {
    clearTimeout(forceExitTimer);

    if (err) {
      console.error('[Lifecycle] Error during shutdown', err);
      process.exit(1);
      return;
    }

    console.log('[Lifecycle] Server closed cleanly.');
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  console.error('[Process] Unhandled promise rejection', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[Process] Uncaught exception', error);
  shutdown('uncaughtException');
});

export { app, server };
