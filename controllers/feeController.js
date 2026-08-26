const Fee = require('../models/Fee');
const Payment = require('../models/Payment');
const dbStore = require('../services/dbStore');

exports.createFee = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const fee = new Fee(req.body);
      await fee.save();
      return res.status(201).json(fee);
    } else {
      const newFee = dbStore.addItem('fees', req.body);
      return res.status(201).json(newFee);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to save fee to Database', error: err.message });
  }
};

exports.getFees = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const fees = await Fee.find().populate('class').sort({ createdAt: -1 });
      return res.json(fees);
    } else {
      const fees = dbStore.getCollection('fees');
      return res.json(fees);
    }
  } catch (err) {
    const fees = dbStore.getCollection('fees');
    return res.json(fees);
  }
};

exports.deleteFee = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      await Fee.findByIdAndDelete(req.params.id);
      return res.json({ msg: 'Fee schedule deleted from Database' });
    } else {
      dbStore.deleteItem('fees', req.params.id);
      return res.json({ msg: 'Fee schedule deleted from Database' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete fee from Database', error: err.message });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const { student, fee, amount, method, reference } = req.body;
    if (dbStore.isMongoConnected()) {
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
      return res.status(201).json(populated);
    } else {
      const payment = dbStore.addItem('payments', {
        student: student || 'usr_student1',
        fee: fee || 'fee_1',
        amount: amount || 15000,
        method: method || 'Online',
        reference: reference || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'Paid',
        paidAt: new Date().toISOString()
      });
      return res.status(201).json(payment);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to record payment in Database', error: err.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const query = {};
      if (req.query.studentId) query.student = req.query.studentId;
      const payments = await Payment.find(query).populate('student fee').sort({ createdAt: -1 });
      return res.json(payments);
    } else {
      const payments = dbStore.getCollection('payments');
      return res.json(payments);
    }
  } catch (err) {
    const payments = dbStore.getCollection('payments');
    return res.json(payments);
  }
};

