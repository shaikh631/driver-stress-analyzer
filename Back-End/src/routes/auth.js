import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import Team from '../models/Team.js';
import { signupSchema, loginSchema, validate } from '../utils/validation.js';

const router = Router();

/** POST /api/auth/signup */
router.post('/signup', validate(signupSchema), async (req, res, next) => {
  try {
    const { name, email, password } = req.validated;

    const existing = await Team.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'A team with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const team = await Team.create({ name, email, passwordHash });

    const token = jwt.sign(
      { teamId: team._id, email: team.email },
      config.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      team: { id: team._id, name: team.name, email: team.email },
    });
  } catch (err) {
    next(err);
  }
});

/** POST /api/auth/login */
router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.validated;

    const team = await Team.findOne({ email });
    if (!team) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, team.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { teamId: team._id, email: team.email },
      config.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      team: { id: team._id, name: team.name, email: team.email },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
