import mongoose from 'mongoose';

const CompetitionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startTime: {
    type: Date,
    required: true
  },
  entranceDeadline: {
    type: Date,
    required: false // Make optional for demo
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in seconds
    required: false, // Make optional for demo
    default: parseInt(process.env.COMPETITION_LENGTH || '300', 10) // Use environment variable with default
  },
  entranceDuration: {
    type: Number, // in seconds
    required: false, // Make optional for demo
    default: 1800 // 30 minutes default
  },
  status: {
    type: String,
    enum: ['upcoming', 'in_progress_can_enter', 'in_progress_no_entry', 'ended'],
    default: 'upcoming'
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  maxParticipants: {
    type: Number,
    default: 0 // 0 means unlimited
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Make optional for demo
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

// Update the status based on time
CompetitionSchema.methods.updateStatus = function() {
  const now = new Date();
  
  if (now < this.startTime) {
    this.status = 'upcoming';
  } else if (now >= this.startTime && now < this.entranceDeadline) {
    this.status = 'in_progress_can_enter';
  } else if (now >= this.entranceDeadline && now < this.endTime) {
    this.status = 'in_progress_no_entry';
  } else {
    this.status = 'ended';
  }
  
  return this.status;
};

// Update the updatedAt timestamp before saving
CompetitionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Competition = mongoose.model('Competition', CompetitionSchema);

export default Competition;