const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
  number: String,
  driver: String,
  vehicleNo: String,
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bus', BusSchema);
