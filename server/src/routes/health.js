import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (req, res) => {
  const startedAt = Number(req.app.locals.startedAt ?? Date.now());

  res.json({
    ok: true,
    service: 'lifeos-server',
    environment: process.env.NODE_ENV ?? 'development',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
    shuttingDown: Boolean(req.app.locals.isShuttingDown),
  });
});

healthRouter.get('/live', (_req, res) => {
  res.status(200).json({
    ok: true,
    status: 'live',
    timestamp: new Date().toISOString(),
  });
});

healthRouter.get('/ready', (req, res) => {
  const isShuttingDown = Boolean(req.app.locals.isShuttingDown);

  if (isShuttingDown) {
    return res.status(503).json({
      ok: false,
      status: 'not-ready',
      reason: 'Server is shutting down',
      timestamp: new Date().toISOString(),
    });
  }

  return res.status(200).json({
    ok: true,
    status: 'ready',
    timestamp: new Date().toISOString(),
  });
});
