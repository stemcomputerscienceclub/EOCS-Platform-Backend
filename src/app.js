import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { router as routes } from './routes/index.js';
import { config } from './config/index.js';

const app = express();

// Get allowed origins from environment or use defaults
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:5173,https://eocs-platform-backend.onrender.com,https://eocs-platform-frontend.vercel.app').split(',');

// Configure CORS
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// Handle preflight requests
app.options('*', cors());

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Add a health check route
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.use(express.json());
app.use(cookieParser());
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`${new Date().toISOString()} Error:`, err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

export default app; 