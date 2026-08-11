import multer from 'multer';
import path from 'path';
import fs from 'fs';
import config from '../config/env.js';

// Ensure uploads directory exists
const uploadsDir = path.resolve(config.AUDIO_STORAGE_PATH);
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const ext = path.extname(file.originalname) || '.webm';
    cb(null, `${unique}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = [
    'audio/webm', 'audio/wav', 'audio/mpeg', 'audio/mp3',
    'audio/ogg', 'audio/flac', 'audio/mp4', 'audio/x-m4a',
    'video/webm', // browsers sometimes label webm audio as video/webm
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported audio format: ${file.mimetype}`), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max
});

/**
 * Get the relative URL for a stored file.
 * @param {string} filename
 * @returns {string} URL path for the audio file
 */
export function getAudioUrl(filename) {
  return `/uploads/${filename}`;
}

/**
 * Get the absolute file path for an uploaded file.
 * @param {string} filename
 * @returns {string}
 */
export function getFilePath(filename) {
  return path.join(uploadsDir, filename);
}
