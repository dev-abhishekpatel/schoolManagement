const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  subjects: [{ type: String }],
  schedule: [
    {
      subject: String,
      date: Date,
      startTime: String,
      endTime: String,
      maxMarks: Number,
      passingMarks: Number
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exam', ExamSchema);
