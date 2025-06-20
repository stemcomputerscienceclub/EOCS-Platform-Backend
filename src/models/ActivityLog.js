import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participation'
  },
  type: {
    type: String,
    required: true,
    enum: ['tab_switch', 'fullscreen_exit', 'copy_paste', 'keyboard_shortcut', 'multiple_devices', 'other']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  warningCount: {
    type: Number,
    default: 1
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  }
});

const ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema);

export default ActivityLog; 