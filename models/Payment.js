const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  fee: { type: mongoose.Schema.Types.ObjectId, ref: 'Fee' },
  amount: Number,
  method: String,
  reference: String,
  status: { type: String, enum: ['Pending','Paid','Failed'], default: 'Pending' },
  paidAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', PaymentSchema);
