const Fee = require('../models/Fee');
const Payment = require('../models/Payment');

exports.createFee = async (req, res) => {
  try {
    const fee = new Fee(req.body);
    await fee.save();
    res.status(201).json(fee);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to save fee to MongoDB', error: err.message });
  }
};

exports.getFees = async (req, res) => {
  try {
    const fees = await Fee.find().populate('class').sort({ createdAt: -1 });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch fees from MongoDB', error: err.message });
  }
};

exports.deleteFee = async (req, res) => {
  try {
    await Fee.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Fee schedule deleted from MongoDB' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete fee from MongoDB', error: err.message });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const { student, fee, amount, method, reference } = req.body;
    const payment = new Payment({
      student,
      fee,
      amount,
      method: method || 'Online',
      reference: reference || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Paid',
      paidAt: new Date()
    });
    await payment.save();
    const populated = await Payment.findById(payment._id).populate('student fee');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to record payment in MongoDB', error: err.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const query = {};
    if (req.query.studentId) query.student = req.query.studentId;
    const payments = await Payment.find(query).populate('student fee').sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch payments from MongoDB', error: err.message });
  }
};
