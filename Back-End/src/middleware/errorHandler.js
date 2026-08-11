/** Global error handler — returns consistent { error } shape */
export default function errorHandler(err, req, res, _next) {
  console.error('Unhandled error:', err);

  const status = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({ error: message });
}
