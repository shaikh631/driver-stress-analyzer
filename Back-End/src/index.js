import express from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import jwt from 'jsonwebtoken';

import config from './config/env.js';
import errorHandler from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/auth.js';
import teamRoutes from './routes/team.js';
import driverRoutes from './routes/driver.js';
import radioRoutes from './routes/radio.js';
import lapsRoutes from './routes/laps.js';
import dashboardRoutes from './routes/dashboard.js';

const app = express();
const httpServer = createServer(app);

// ——— Socket.IO ———
const io = new SocketServer(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

// Authenticate socket connections with team JWT
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Authentication required'));

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    socket.teamId = decoded.teamId;
    next();
  } catch {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  const room = `team:${socket.teamId}`;
  socket.join(room);
  console.log(`[Socket.IO] Team ${socket.teamId} joined room ${room}`);

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Team ${socket.teamId} disconnected`);
  });
});

// Make io accessible in route handlers via req.app.get('io')
app.set('io', io);

// ——— Middleware ———
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded audio files statically
const uploadsPath = path.resolve(config.AUDIO_STORAGE_PATH);
app.use('/uploads', express.static(uploadsPath));

// ——— Routes ———
app.use('/api/auth', authRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/radio', radioRoutes);
app.use('/api/laps', lapsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// ——— Start ———
async function start() {
  try {
    await mongoose.connect(config.DATABASE_URL);
    console.log('✅  Connected to MongoDB');

    httpServer.on('error', (error) => {
      if (error.syscall !== 'listen') throw error;
      if (error.code === 'EADDRINUSE') {
        console.error(`❌  Port ${config.PORT} is already in use. Set PORT in Back-End/.env or stop the process using that port.`);
        process.exit(1);
      }
      throw error;
    });

    httpServer.listen(config.PORT, () => {
      console.log(`🚀  Server running on http://localhost:${config.PORT}`);
      console.log(`📡  Socket.IO ready`);
    });
  } catch (err) {
    console.error('❌  Failed to start:', err.message);
    process.exit(1);
  }
}

start();
