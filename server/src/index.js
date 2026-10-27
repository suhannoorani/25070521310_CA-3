import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { seedData } from './seed.js';

import authRoutes from './routes/authRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import swapRoutes from './routes/swapRoutes.js';
import communityRoutes from './routes/communityRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString().split('T')[1].slice(0, 8)}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/community', communityRoutes);

// Health & System Info Route
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({
    status: 'ok',
    platform: 'SkillSwap API',
    uptime: Math.round(process.uptime()),
    database: {
      status: dbStatus,
      host: mongoose.connection.host || 'localhost',
      port: mongoose.connection.port || 27017,
      name: mongoose.connection.name || 'skillswap',
      compassConnectionString: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillswap',
    },
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err.stack);
  res.status(500).json({
    message: 'Internal server error occurred.',
    error: process.env.NODE_ENV === 'production' ? null : err.message,
  });
});

// Start Server and initialize DB
const startServer = async () => {
  try {
    await connectDB();
    await seedData();

    app.listen(PORT, () => {
      console.log('========================================================');
      console.log(` SkillSwap Backend Server is running!`);
      console.log(`  API URL:           http://localhost:${PORT}`);
      console.log(`  Health Check:      http://localhost:${PORT}/api/health`);
      console.log(`  MongoDB Target:    ${process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillswap'}`);
      console.log(`  MongoDB Compass:   Connect with "mongodb://127.0.0.1:27017/skillswap"`);
      console.log('========================================================');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
