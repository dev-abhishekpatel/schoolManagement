const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  files: [String],
  submittedAt: { type: Date, default: Date.now },
  marks: Number,
  feedback: String
});

module.exports = mongoose.model('Submission', SubmissionSchema);
