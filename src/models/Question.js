import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['mcq', 'text', 'code'],
    default: 'mcq'
  },
  options: {
    type: [String],
    default: []
  },
  correctAnswer: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    default: 10,
    min: 1
  },
  language: {
    type: String,
    default: 'javascript'
  },
  starterCode: {
    type: String,
    default: ''
  },
  testCases: {
    type: [{
      input: String,
      expectedOutput: String
    }],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
QuestionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Question = mongoose.model('Question', QuestionSchema);

export default Question; 