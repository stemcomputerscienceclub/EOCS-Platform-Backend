import mongoose from 'mongoose';
import app from '../src/app.js';
import { config } from '../src/config/index.js';

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(config.mongoUri).then((m) => {
      console.log('MongoDB connected');
      return m;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (e) {
    console.error('DB connection failed:', e.message);
    res.status(500).json({ error: 'Database connection failed', message: e.message });
    return;
  }
  return app(req, res);
}
