import mongoose from 'mongoose';

const missionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['phishing', 'password', 'network', 'general'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  requirements: [{
    type: String
  }],
  rewards: {
    points: Number,
    badge: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Mission', missionSchema);
