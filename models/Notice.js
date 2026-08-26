const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: String,
  target: { type: String, enum: ['ALL','TEACHERS','STUDENTS','PARENTS','CLASS'] , default: 'ALL'},
  targetClass: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  attachments: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notice', NoticeSchema);
