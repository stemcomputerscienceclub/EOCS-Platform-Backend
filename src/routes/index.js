import express from 'express';
import competitionRoutes from './competitionRoutes.js';
import authRoutes from './authRoutes.js';

const router = express.Router();

router.use('/competition', competitionRoutes);
router.use('/auth', authRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export { router }; 