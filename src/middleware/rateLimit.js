const rateLimit = require('express-rate-limit');

// For Vercel serverless functions, we need to be more conservative with rate limits
// since each function invocation is isolated
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 50, // Higher limit for development
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: process.env.NODE_ENV === 'development' ? 500 : 30, // Higher limit for development
  message: 'Too many API requests from this IP, please try again after a minute',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

module.exports = {
  authLimiter,
  apiLimiter
}; 