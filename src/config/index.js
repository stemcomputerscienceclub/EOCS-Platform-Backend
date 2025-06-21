import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const requiredEnvVars = [
  'JWT_SECRET',
  'MONGODB_URI'
];

// Validate required environment variables
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

// Configuration object with validation
export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '24h',
  jwtCookieExpire: parseInt(process.env.JWT_COOKIE_EXPIRE, 10) || 24,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  competition: {
    startTime: process.env.COMPETITION_START_TIME ? new Date(process.env.COMPETITION_START_TIME) : new Date(),
    entranceTime: parseInt(process.env.COMPETITION_ENTRANCE_TIME || '1800', 10),
    length: parseInt(process.env.COMPETITION_LENGTH || '300', 10),
    get entranceDeadline() {
      return new Date(this.startTime.getTime() + this.entranceTime * 1000);
    },
    get endTime() {
      return new Date(this.startTime.getTime() + this.length * 1000);
    }
  }
};

// Validate dates and durations
if (isNaN(config.competition.startTime.getTime())) {
  throw new Error('Invalid COMPETITION_START_TIME format. Use ISO 8601 format.');
}

if (isNaN(config.competition.entranceTime) || config.competition.entranceTime <= 0) {
  throw new Error('Invalid COMPETITION_ENTRANCE_TIME. Must be a positive number.');
}

if (isNaN(config.competition.length) || config.competition.length <= 0) {
  throw new Error('Invalid COMPETITION_LENGTH. Must be a positive number.');
}

export default config; 