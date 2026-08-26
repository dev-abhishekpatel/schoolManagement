const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
  day: { type: String, required: true },
  start: String,
  end: String,
  subject: String,
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  room: String
});

const TimetableSchema = new mongoose.Schema({
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  academicYear: String,
  slots: [SlotSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Timetable', TimetableSchema);
