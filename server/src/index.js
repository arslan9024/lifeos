import 'dotenv/config';
import { config } from './config/env.js';
import { createApp } from './app.js';

const { port, shutdownTimeoutMs, nodeEnv, clientOrigins, rateLimitWindowMs, rateLimitMax, trustProxy, compressionEnabled } = config;
const app = createApp(config);

const server = app.listen(port, () => {
  console.log(`LifeOS server running on http://localhost:${port}`);
  console.log(`[Environment] ${nodeEnv}`);
  console.log(`[CORS] allowed origins: ${clientOrigins.join(', ')}`);
  console.log(`[RateLimit] ${rateLimitMax} requests / ${rateLimitWindowMs}ms`);
  console.log(`[Proxy] trust proxy: ${trustProxy}`);
  console.log(`[Compression] enabled: ${compressionEnabled}`);
});

let isShuttingDown = false;

function shutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  app.locals.isShuttingDown = true;

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
