const Fee = require('../models/Fee');
const Payment = require('../models/Payment');

exports.createFee = async (req, res) => {
  try {
    const fee = new Fee(req.body);
    await fee.save();
    res.status(201).json(fee);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getFees = async (req, res) => {
  try {
    const fees = await Fee.find();
    res.json(fees);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.createPayment = async (req, res) => {
  try {
    const payment = new Payment(req.body);
    payment.status = 'Paid';
    payment.paidAt = new Date();
    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('student fee');
    res.json(payments);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
