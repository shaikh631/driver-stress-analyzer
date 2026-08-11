import { Router } from 'express';
import authMiddleware from '../middleware/auth.js';
import Team from '../models/Team.js';
import { generatePairingToken } from '../utils/token.js';

const router = Router();

/** GET /api/team/me — return team profile */
router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const team = await Team.findById(req.teamId).select('-passwordHash');
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json({
      id: team._id,
      name: team.name,
      email: team.email,
      pairingToken: team.pairingToken,
      pairingTokenExpiresAt: team.pairingTokenExpiresAt,
      createdAt: team.createdAt,
    });
  } catch (err) {
    next(err);
  }
});

/** POST /api/team/pairing-token — generate/regenerate a pairing token */
router.post('/pairing-token', authMiddleware, async (req, res, next) => {
  try {
    // Generate a unique token (retry if collision)
    let token;
    let attempts = 0;
    do {
      token = generatePairingToken();
      const exists = await Team.findOne({ pairingToken: token });
      if (!exists) break;
      attempts++;
    } while (attempts < 10);

    if (attempts >= 10) {
      return res.status(500).json({ error: 'Could not generate unique token' });
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    await Team.findByIdAndUpdate(req.teamId, {
      pairingToken: token,
      pairingTokenExpiresAt: expiresAt,
    });

    res.json({ pairingToken: token, expiresAt });
  } catch (err) {
    next(err);
  }
});

export default router;
