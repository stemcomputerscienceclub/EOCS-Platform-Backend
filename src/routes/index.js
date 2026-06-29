import express from 'express';
import mongoose from 'mongoose';
import competitionRoutes from './competitionRoutes.js';
import authRoutes from './authRoutes.js';

const router = express.Router();

router.use('/competition', competitionRoutes);
router.use('/auth', authRoutes);

// Health check route
router.get('/health', (req, res) => {
  const mongoState = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.status(200).json({
    status: 'ok',
    mongo: states[mongoState] || 'unknown',
    hasMongoUri: !!process.env.MONGODB_URI,
    hasJwtSecret: !!process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV || 'not set'
  });
});

export { router }; 