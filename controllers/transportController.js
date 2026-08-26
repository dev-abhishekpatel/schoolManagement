const Bus = require('../models/Bus');
const Route = require('../models/Route');

exports.getBuses = async (req, res) => {
  try {
    const buses = await Bus.find().populate('route').sort({ createdAt: -1 });
    res.json(buses);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch buses from MongoDB', error: err.message });
  }
};

exports.addBus = async (req, res) => {
  try {
    const { number, driver, vehicleNo, route } = req.body;
    const bus = new Bus({
      number: number || 'Bus 01',
      driver: driver || 'Driver Assigned',
      vehicleNo: vehicleNo || 'DL-01-XX-0000',
      route: route || null
    });
    await bus.save();
    const populated = await Bus.findById(bus._id).populate('route');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to save bus to MongoDB', error: err.message });
  }
};

exports.deleteBus = async (req, res) => {
  try {
    await Bus.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Bus vehicle deleted from MongoDB' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete bus from MongoDB', error: err.message });
  }
};

exports.getRoutes = async (req, res) => {
  try {
    const routes = await Route.find().sort({ createdAt: -1 });
    res.json(routes);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch routes from MongoDB', error: err.message });
  }
};

exports.addRoute = async (req, res) => {
  try {
    const route = new Route(req.body);
    await route.save();
    res.status(201).json(route);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to save route to MongoDB', error: err.message });
  }
};
