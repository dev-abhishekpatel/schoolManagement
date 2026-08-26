const Bus = require('../models/Bus');
const Route = require('../models/Route');

exports.addRoute = async (req, res) => {
  try {
    const route = new Route(req.body);
    await route.save();
    res.status(201).json(route);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.addBus = async (req, res) => {
  try {
    const bus = new Bus(req.body);
    await bus.save();
    res.status(201).json(bus);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
