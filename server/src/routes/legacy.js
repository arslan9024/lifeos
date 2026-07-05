import { Router } from 'express';

export const legacyRouter = Router();

legacyRouter.get('/', (_req, res) => {
  res.json({
    ok: true,
    message: 'Legacy sandbox endpoint reserved for old property work',
  });
});
