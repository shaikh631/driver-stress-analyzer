import rateLimit from 'express-rate-limit';

/** Rate limiter for /api/radio/upload — 10 requests per minute per driver */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  keyGenerator: (req) => req.headers['x-driver-session'] || req.ip,
  message: { error: 'Too many uploads. Please wait before sending another clip.' },
  standardHeaders: true,
  legacyHeaders: false,
});
