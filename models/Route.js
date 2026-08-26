const mongoose = require('mongoose');

const StopSchema = new mongoose.Schema({ name: String, pickupTime: String });

const RouteSchema = new mongoose.Schema({
  name: String,
  stops: [StopSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Route', RouteSchema);
