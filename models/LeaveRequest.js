const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  role: { type: String, enum: ['TEACHER','STUDENT'] },
  from: Date,
  to: Date,
  reason: String,
  status: { type: String, enum: ['PENDING','APPROVED','REJECTED'], default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LeaveRequest', LeaveSchema);
