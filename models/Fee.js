const mongoose = require('mongoose');

const FeeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  amount: { type: Number, required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  academicYear: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Fee', FeeSchema);
