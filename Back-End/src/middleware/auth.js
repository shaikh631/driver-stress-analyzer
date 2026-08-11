import jwt from 'jsonwebtoken';
import config from '../config/env.js';

/** Protect team-level routes — expects Authorization: Bearer <jwt> */
export default function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.teamId = decoded.teamId;
    req.teamEmail = decoded.email;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
