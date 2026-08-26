const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  recipientRole: { type: String, enum: ['ALL','TEACHER','STUDENT','PARENT'] , default: 'ALL' },
  recipientUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

module.exports = mongoose.model('Notification', NotificationSchema);
