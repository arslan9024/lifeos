export function notFoundHandler(_req, res) {
  res.status(404).json({
    ok: false,
    error: 'Not Found',
  });
}

export function globalErrorHandler(err, req, res, _next) {
  console.error('[LifeOS API Error]', {
    requestId: req.requestId,
    message: err?.message,
    stack: err?.stack,
  });

  res.status(500).json({
    ok: false,
    error: 'Internal Server Error',
    requestId: req.requestId,
  });
}
