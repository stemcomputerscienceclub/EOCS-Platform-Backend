import mongoose from 'mongoose';

const userAnswerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participation',
    required: true
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    default: null
  },
  points: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  }
}, {
  timestamps: true
});

// Ensure a user can only have one answer per question per participation
userAnswerSchema.index({ user: 1, participation: 1, question: 1 }, { unique: true });

const UserAnswer = mongoose.model('UserAnswer', userAnswerSchema);

export default UserAnswer; 