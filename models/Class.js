const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  roomNumber: String
});

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sections: [SectionSchema],
  academicYear: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Class', ClassSchema);
