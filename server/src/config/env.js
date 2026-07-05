function parsePositiveInt(value, fallback, label) {
  if (value == null || value === '') return fallback;

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid ${label}: ${value}`);
  }

  return parsed;
}

function parseOrigins(value) {
  const origins = (value ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (origins.length === 0) {
    throw new Error('CLIENT_ORIGIN must include at least one origin');
  }

  return origins;
}

export const config = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parsePositiveInt(process.env.PORT, 5000, 'PORT'),
  clientOrigins: parseOrigins(process.env.CLIENT_ORIGIN),
  jsonBodyLimit: process.env.JSON_BODY_LIMIT ?? '1mb',
  shutdownTimeoutMs: parsePositiveInt(process.env.SHUTDOWN_TIMEOUT_MS, 10_000, 'SHUTDOWN_TIMEOUT_MS'),
  rateLimitWindowMs: parsePositiveInt(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000, 'RATE_LIMIT_WINDOW_MS'),
  rateLimitMax: parsePositiveInt(process.env.RATE_LIMIT_MAX, 300, 'RATE_LIMIT_MAX'),
};
