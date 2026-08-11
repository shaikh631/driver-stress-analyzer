import { Router } from 'express';
import Team from '../models/Team.js';
import Driver from '../models/Driver.js';
import driverAuth from '../middleware/driverAuth.js';
import { driverConnectSchema, validate } from '../utils/validation.js';

const router = Router();

/** POST /api/driver/connect — driver submits pairing token to connect */
router.post('/connect', validate(driverConnectSchema), async (req, res, next) => {
  try {
    const { pairingToken, driverName } = req.validated;

    const team = await Team.findOne({ pairingToken });
    if (!team) {
      return res.status(400).json({ error: 'Invalid pairing token' });
    }

    if (!team.pairingTokenExpiresAt || team.pairingTokenExpiresAt < new Date()) {
      return res.status(400).json({ error: 'Pairing token has expired. Ask your team for a new one.' });
    }

    // Create or re-use existing driver with same name on same team
    let driver = await Driver.findOne({ teamId: team._id, name: driverName });
    if (!driver) {
      driver = await Driver.create({ teamId: team._id, name: driverName });
    }

    res.json({
      driverSessionId: driver.sessionToken,
      driverId: driver._id,
      teamName: team.name,
    });
  } catch (err) {
    next(err);
  }
});

/** GET /api/driver/status — driver polls to confirm pairing */
router.get('/status', driverAuth, async (req, res) => {
  res.json({
    paired: true,
    driverId: req.driverId,
    driverName: req.driver.name,
    teamName: req.teamName,
  });
});

export default router;
