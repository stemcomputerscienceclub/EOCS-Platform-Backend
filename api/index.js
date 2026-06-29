import mongoose from 'mongoose';
import app from '../src/app.js';
import { config } from '../src/config/index.js';

mongoose.connect(config.mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch(e => console.error('MongoDB connection error:', e));

export default app;
