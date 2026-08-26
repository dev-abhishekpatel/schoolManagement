const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  qualification: { type: String },
  experience: { type: Number },
  subjects: [{ type: String }],
  assignedClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
  joiningDate: Date,
  photo: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Teacher', TeacherSchema);
