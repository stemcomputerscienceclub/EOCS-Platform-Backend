import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config/index.js';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    minlength: [2, 'Username must be at least 2 characters long'],
    maxlength: [100, 'Username cannot be more than 100 characters'],
    match: [/^[a-zA-ZÀ-ÿ\u00C0-\u024F\u0400-\u04FF\u0600-\u06FF\u0750-\u077F\u1E00-\u1EFFa-zA-Z\s'.-]+$/, 'Username can only contain letters, spaces, hyphens, apostrophes and dots']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters long'],
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password with rate limiting
userSchema.methods.matchPassword = async function(enteredPassword) {
  // Check if account is locked
  if (this.lockUntil && this.lockUntil > Date.now()) {
    throw new Error('Account is temporarily locked. Please try again later.');
  }

  try {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    
    if (!isMatch) {
      // Increment login attempts
      this.loginAttempts += 1;
      
      // Lock account if too many attempts
      if (this.loginAttempts >= 5) {
        this.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      }
      
      await this.save({ validateBeforeSave: false });
      throw new Error('Invalid credentials');
    }

    // Reset login attempts on successful login
    if (this.loginAttempts > 0) {
      this.loginAttempts = 0;
      this.lockUntil = undefined;
      await this.save({ validateBeforeSave: false });
    }

    return true;
  } catch (error) {
    throw error;
  }
};

// Generate and hash password reset token
userSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
  return resetToken;
};

// Generate JWT Token
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { 
      id: this._id, 
      role: this.role, 
      username: this.username,
      email: this.email
    },
    config.jwtSecret,
    { 
      expiresIn: config.jwtExpire,
      algorithm: 'HS256'
    }
  );
};

export const User = mongoose.model('User', userSchema); 