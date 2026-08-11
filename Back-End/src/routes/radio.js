import { Router } from 'express';
import driverAuth from '../middleware/driverAuth.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';
import { upload, getAudioUrl, getFilePath } from '../services/storageService.js';
import { transcribeAudio, classifyMood } from '../services/groqService.js';
import RadioMessage from '../models/RadioMessage.js';
import authMiddleware from '../middleware/auth.js';

const router = Router();

/** POST /api/radio/upload — driver uploads an audio clip */
router.post(
  '/upload',
  driverAuth,
  uploadLimiter,
  upload.single('audio'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No audio file provided' });
      }

      const filePath = getFilePath(req.file.filename);
      const audioUrl = getAudioUrl(req.file.filename);

      // 1. Transcribe audio
      let transcript = '';
      try {
        transcript = await transcribeAudio(filePath);
      } catch {
        console.error('[Radio] Transcription failed – saving with empty transcript');
      }

      // 2. Classify mood (only if transcript is available)
      let mood = 'unknown';
      let confidence = 0;
      let reasoning = '';

      if (transcript) {
        const result = await classifyMood(transcript);
        mood = result.mood;
        confidence = result.confidence;
        reasoning = result.reasoning;
      }

      // 3. Persist
      const message = await RadioMessage.create({
        teamId: req.teamId,
        driverId: req.driverId,
        audioUrl,
        transcript,
        mood,
        confidence,
        reasoning,
      });

      // 4. Emit real-time event via Socket.IO
      const io = req.app.get('io');
      if (io) {
        const populatedMessage = await RadioMessage.findById(message._id).populate('driverId', 'name');
        io.to(`team:${req.teamId}`).emit('radio:new', populatedMessage);
      }

      res.status(201).json({
        id: message._id,
        audioUrl: message.audioUrl,
        transcript: message.transcript,
        mood: message.mood,
        confidence: message.confidence,
        reasoning: message.reasoning,
        createdAt: message.createdAt,
      });
    } catch (err) {
      next(err);
    }
  }
);

/** GET /api/radio/messages — team fetches paginated radio messages */
router.get('/messages', authMiddleware, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      RadioMessage.find({ teamId: req.teamId })
        .populate('driverId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      RadioMessage.countDocuments({ teamId: req.teamId }),
    ]);

    res.json({
      messages,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
