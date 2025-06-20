import express from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { authenticateJWT } from '../middleware/auth.js';
import { config } from '../config/index.js';

const router = express.Router();

// Import controllers
import {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateDetails
} from '../controllers/auth.js';

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: 'Too many attempts from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // Don't count successful requests against the limit
});

// More aggressive rate limiting for sensitive routes
const sensitiveAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many attempts from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false
});

// Validation middleware
const registerValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('Password must contain a number')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain a lowercase letter')
    .matches(/[!@#$%^&*]/)
    .withMessage('Password must contain a special character'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required')
];

const loginValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').exists().withMessage('Password is required')
];

const updateDetailsValidation = [
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('email').optional().isEmail().withMessage('Please provide a valid email')
];

const updatePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('Password must contain a number')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain a lowercase letter')
    .matches(/[!@#$%^&*]/)
    .withMessage('Password must contain a special character')
];

// Apply rate limiter to auth routes
router.use(authLimiter);

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/logout', authenticateJWT, logout);
router.get('/me', authenticateJWT, getMe);
router.post('/forgotpassword', sensitiveAuthLimiter, forgotPassword);
router.put('/resetpassword/:resettoken', sensitiveAuthLimiter, resetPassword);
router.put('/updatepassword', sensitiveAuthLimiter, authenticateJWT, updatePasswordValidation, updatePassword);
router.put('/updatedetails', sensitiveAuthLimiter, authenticateJWT, updateDetailsValidation, updateDetails);

export default router; 