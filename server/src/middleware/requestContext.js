import { randomUUID } from 'node:crypto';

function shouldLogRequests() {
  const explicit = process.env.REQUEST_LOGGING?.toLowerCase();

  if (explicit === 'true') return true;
  if (explicit === 'false') return false;

  return (process.env.NODE_ENV ?? 'development') !== 'production';
}

export function requestContext(req, res, next) {
  const requestId = randomUUID();
  const startedAt = Date.now();

  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);

  if (shouldLogRequests()) {
    res.on('finish', () => {
      const durationMs = Date.now() - startedAt;
      console.log(
        `[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${durationMs}ms) [requestId=${requestId}]`,
      );
    });
  }

  next();
}
