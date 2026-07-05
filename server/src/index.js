import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { healthRouter } from './routes/health.js';
import { legacyRouter } from './routes/legacy.js';
import { requestContext } from './middleware/requestContext.js';
import { globalErrorHandler, notFoundHandler } from './middleware/errorHandlers.js';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 5000;

if (!Number.isFinite(port) || port <= 0) {
  throw new Error(`Invalid PORT value: ${process.env.PORT}`);
}

const allowedOrigins = (process.env.CLIENT_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin not allowed: ${origin}`));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(requestContext);

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
  console.log(`[CORS] allowed origins: ${allowedOrigins.join(', ')}`);
});

let isShuttingDown = false;
const SHUTDOWN_TIMEOUT_MS = 10_000;

function shutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`[Lifecycle] Received ${signal}. Starting graceful shutdown...`);

  const forceExitTimer = setTimeout(() => {
    console.error('[Lifecycle] Forced shutdown after timeout.');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);

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
