import { ApiError } from '../errors/ApiError.js';

export function notFoundHandler(req, res) {
  res.status(404).json({
    ok: false,
    error: 'Not Found',
    requestId: req.requestId,
  });
}

export function globalErrorHandler(err, req, res, _next) {
  const isInvalidJson = err?.type === 'entity.parse.failed';
  const isApiError = err instanceof ApiError;
  const status = isInvalidJson
    ? 400
    : isApiError
      ? err.status
      : typeof err?.status === 'number'
        ? err.status
        : typeof err?.statusCode === 'number'
          ? err.statusCode
          : 500;

  const message = isInvalidJson
    ? 'Invalid JSON payload'
    : isApiError
      ? err.message
      : status >= 500
        ? 'Internal Server Error'
        : err?.message || 'Request failed';

  const code = isInvalidJson
    ? 'INVALID_JSON'
    : isApiError
      ? err.code
      : status === 413
        ? 'PAYLOAD_TOO_LARGE'
        : status >= 500
          ? 'INTERNAL_ERROR'
          : 'REQUEST_ERROR';

  console.error('[LifeOS API Error]', {
    requestId: req.requestId,
    status,
    code,
    message: err?.message,
    stack: err?.stack,
  });

  res.status(status).json({
    ok: false,
    error: message,
    code,
    requestId: req.requestId,
  });
}
