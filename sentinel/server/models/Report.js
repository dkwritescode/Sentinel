import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  target: {
    type: String,
    enum: ['cybercrime', 'police', 'hr'],
    required: true
  },
  threatType: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    required: true
  },
  details: {
    type: String,
    required: true
  },
  evidence: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['REPORTED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    default: 'REPORTED'
  },
  caseId: {
    type: String,
    required: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  departmentResponse: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Report', reportSchema);
