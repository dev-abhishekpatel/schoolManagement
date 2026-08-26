const mongoose = require('mongoose');

const MarkSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  subject: { type: String, required: true },
  theory: Number,
  practical: Number,
  internal: Number,
  total: Number,
  grade: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mark', MarkSchema);
