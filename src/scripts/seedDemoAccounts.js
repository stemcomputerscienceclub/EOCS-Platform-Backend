import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { config } from '../config/index.js';

const RANGES = [
  { start: 1, end: 20 },
  { start: 51, end: 100 },
];

const seedDemoAccounts = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    for (const range of RANGES) {
      for (let i = range.start; i <= range.end; i++) {
        const email = `demo${i}@eocs.com`;
        const existing = await User.findOne({ email });
        if (existing) {
          console.log(`${email} already exists, skipping`);
          continue;
        }

        await User.create({
          username: `demo${i}`,
          email,
          password: 'Demo@1234',
          role: 'user',
        });

        console.log(`Created ${email}`);
      }
    }

    console.log('Done seeding demo accounts');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding demo accounts:', error);
    process.exit(1);
  }
};

seedDemoAccounts();
