import rateLimit from 'express-rate-limit';

export function createApiRateLimiter({ windowMs, max }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler(req, res, _next, options) {
      return res.status(options.statusCode).json({
        ok: false,
        error: 'Too many requests',
        code: 'RATE_LIMIT_EXCEEDED',
        requestId: req.requestId,
      });
    },
  });
}
