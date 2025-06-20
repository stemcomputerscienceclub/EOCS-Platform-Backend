import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { ErrorResponse } from './error.js';
import { User } from '../models/User.js';

// Middleware to authenticate JWT
export const authenticateJWT = async (req, res, next) => {
  let token;

  // Get token from cookie
  if (req.cookies.token) {
    token = req.cookies.token;
  }
  // Fallback to Authorization header for non-browser clients
  else if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route',
      errorCode: 'AUTHENTICATION_ERROR'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Get user from database to ensure they still exist and are active
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User no longer exists',
        errorCode: 'AUTHENTICATION_ERROR'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'User account is deactivated',
        errorCode: 'AUTHENTICATION_ERROR'
      });
    }

    // Add user info to request
    req.user = {
      id: user._id,
      role: user.role,
      username: user.username
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      // Clear the expired token cookie
      res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
      });

      return res.status(401).json({
        success: false,
        error: 'Authentication token has expired',
        errorCode: 'TOKEN_EXPIRED'
      });
    }
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route',
      errorCode: 'AUTHENTICATION_ERROR'
    });
  }
};

// Middleware to check admin role
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Admin access required for this route',
      errorCode: 'AUTHORIZATION_ERROR'
    });
  }
  next();
};

// Middleware to handle socket authentication
export const authenticateSocket = (socket, next) => {
  let token;

  // Get token from handshake auth
  if (socket.handshake.auth?.token) {
    token = socket.handshake.auth.token;
  }
  // Get token from cookie
  else if (socket.handshake.headers.cookie) {
    const cookies = socket.handshake.headers.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {});
    token = cookies.token;
  }

  if (!token) {
    return next(new Error('Authentication required'));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    socket.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new Error('Authentication token has expired'));
    }
    return next(new Error('Invalid token'));
  }
};

export default authenticateJWT;