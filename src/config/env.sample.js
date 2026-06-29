// Sample environment configuration
// Create a .env file in the root directory and fill in your values
export default {
  NODE_ENV: 'development',
  PORT: 5000,
  MONGODB_URI: 'mongodb://localhost:27017/competition-platform',
  JWT_SECRET: 'your-jwt-secret',
  CLIENT_URL: 'http://localhost:3000',
  jwtExpire: '24h', 
  sessionSecret: 'your_session_secret_here',
  competitionStartTime: '2024-03-20T10:00:00Z', // ISO format for competition start time

  // Digital Ocean Spaces (for proctoring recording uploads)
  DO_SPACES_ENDPOINT: 'fra1.digitaloceanspaces.com',
  DO_SPACES_REGION: 'fra1',
  DO_SPACES_KEY: 'your-spaces-key',
  DO_SPACES_SECRET: 'your-spaces-secret',
  DO_SPACES_BUCKET: 'your-spaces-bucket-name',
}; 