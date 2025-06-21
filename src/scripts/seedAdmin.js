import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { config } from '../config/index.js';

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'kero' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const user = await User.create({
      username: 'kero',
      password: 'UserYaseen@1234',
      role: 'user',
      email: "kero@example.com"
    });

    console.log('User user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin(); 