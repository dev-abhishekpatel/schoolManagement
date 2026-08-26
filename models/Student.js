const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  studentId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  dob: { type: Date },
  gender: { type: String, enum: ['Male','Female','Other'] },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  section: { type: String },
  rollNumber: { type: String },
  admissionNumber: { type: String, unique: true, sparse: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  contact: {
    phone: String,
    email: String
  },
  address: String,
  photo: String,
  admissionYear: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', StudentSchema);
