import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes';
import { config } from './config/index.js';

const app = express();

// Allow all requests
app.use(cors({
  origin: true, // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());
app.use(cookieParser());
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

export default app; 