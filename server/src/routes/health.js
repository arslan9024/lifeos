import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.json({
    ok: true,
    service: 'lifeos-server',
    environment: process.env.NODE_ENV ?? 'development',
    timestamp: new Date().toISOString(),
  });
});
