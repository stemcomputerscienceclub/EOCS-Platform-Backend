import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question.js';
import { sampleQuestions } from '../data/sampleQuestions.js';

// Load environment variables
dotenv.config();

const initQuestions = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/competition-platform';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing questions
    await Question.deleteMany({});
    console.log('Cleared existing questions');

    // Insert sample questions
    await Question.insertMany(sampleQuestions);
    console.log(`Inserted ${sampleQuestions.length} sample questions`);

    console.log('Database initialization complete');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initQuestions(); 