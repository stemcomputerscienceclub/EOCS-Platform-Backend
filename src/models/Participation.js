import mongoose from 'mongoose';

const ParticipationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  competition: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Competition',
    required: false
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'disqualified'],
    default: 'active'
  },
  answers: [{
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      default: ''
    },
    submittedAt: {
      type: Date
    }
  }],
  score: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  },
  timeRemaining: {
    type: Number // in seconds
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

// Update the updatedAt timestamp before saving
ParticipationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Participation = mongoose.model('Participation', ParticipationSchema);

export default Participation; 