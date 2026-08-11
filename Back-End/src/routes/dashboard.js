import { Router } from 'express';
import authMiddleware from '../middleware/auth.js';
import RadioMessage from '../models/RadioMessage.js';
import LapTime from '../models/LapTime.js';
import Driver from '../models/Driver.js';

const router = Router();

/**
 * GET /api/dashboard/summary
 * Returns radio messages + lap times merged/aligned by timestamp for the team.
 */
router.get('/summary', authMiddleware, async (req, res, next) => {
  try {
    const [messages, laps, drivers] = await Promise.all([
      RadioMessage.find({ teamId: req.teamId })
        .populate('driverId', 'name')
        .sort({ createdAt: -1 })
        .limit(50),
      LapTime.find({ teamId: req.teamId })
        .populate('driverId', 'name')
        .sort({ lapNumber: 1 }),
      Driver.find({ teamId: req.teamId }).select('name'),
    ]);

    // Merge into a timeline — interleave messages and laps by timestamp
    const timeline = [];

    for (const msg of messages) {
      timeline.push({
        type: 'radio',
        timestamp: msg.createdAt,
        data: {
          id: msg._id,
          driverName: msg.driverId?.name || 'Unknown',
          transcript: msg.transcript,
          mood: msg.mood,
          confidence: msg.confidence,
          reasoning: msg.reasoning,
          audioUrl: msg.audioUrl,
        },
      });
    }

    for (const lap of laps) {
      timeline.push({
        type: 'lap',
        timestamp: lap.timestamp,
        data: {
          id: lap._id,
          driverName: lap.driverId?.name || 'Unknown',
          lapNumber: lap.lapNumber,
          lapTimeMs: lap.lapTimeMs,
        },
      });
    }

    // Sort by timestamp descending
    timeline.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({ timeline, drivers, totalMessages: messages.length, totalLaps: laps.length });
  } catch (err) {
    next(err);
  }
});

export default router;
