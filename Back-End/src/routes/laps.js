import { Router } from 'express';
import authMiddleware from '../middleware/auth.js';
import driverAuth from '../middleware/driverAuth.js';
import LapTime from '../models/LapTime.js';
import { lapTimeSchema, validate } from '../utils/validation.js';

const router = Router();

/** POST /api/laps — record a lap time (driver auth) */
router.post('/', driverAuth, validate(lapTimeSchema), async (req, res, next) => {
  try {
    const { driverId, lapNumber, lapTimeMs, timestamp } = req.validated;

    const lap = await LapTime.create({
      teamId: req.teamId,
      driverId: driverId || req.driverId,
      lapNumber,
      lapTimeMs,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    });

    // Emit real-time event
    const io = req.app.get('io');
    if (io) {
      io.to(`team:${req.teamId}`).emit('lap:new', lap);
    }

    res.status(201).json(lap);
  } catch (err) {
    next(err);
  }
});

/** GET /api/laps — get lap times for team's drivers (team auth) */
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const laps = await LapTime.find({ teamId: req.teamId })
      .populate('driverId', 'name')
      .sort({ lapNumber: 1, timestamp: 1 });

    res.json({ laps });
  } catch (err) {
    next(err);
  }
});

export default router;
