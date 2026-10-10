export class AppError extends Error {
  constructor(status, code, message, details) {
    super(message);
    Object.assign(this, { status, code, details });
  }
}
export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  const status = error.status || 500;
  if (status >= 500)
    console.error(JSON.stringify({ requestId: req.id, code: error.code || 'INTERNAL_ERROR' }));
  res.status(status).json({
    error: {
      code: status >= 500 ? 'SERVICE_UNAVAILABLE' : error.code || 'BAD_REQUEST',
      message: status >= 500 ? 'Serviço indisponível. Tente novamente mais tarde.' : error.message,
      ...(error.details ? { details: error.details } : {}),
      requestId: req.id,
    },
  });
}
