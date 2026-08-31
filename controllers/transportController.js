const Bus = require('../models/Bus');
const Route = require('../models/Route');
const dbStore = require('../services/dbStore');

exports.getBuses = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const buses = await Bus.find().populate('route').sort({ createdAt: -1 });
      return res.json(buses);
    } else {
      const buses = dbStore.getCollection('buses');
      return res.json(buses);
    }
  } catch (err) {
    const buses = dbStore.getCollection('buses');
    return res.json(buses);
  }
};

exports.addBus = async (req, res) => {
  try {
    const { number, driver, vehicleNo, route, routeName } = req.body;
    if (dbStore.isMongoConnected()) {
      const bus = new Bus({
        number: number || 'Bus 01',
        driver: driver || 'Driver Assigned',
        vehicleNo: vehicleNo || 'DL-01-XX-0000',
        route: route || null
      });
      await bus.save();
      const populated = await Bus.findById(bus._id).populate('route');
      return res.status(201).json(populated);
    } else {
      const newBus = dbStore.addItem('buses', {
        number: number || 'Bus 01',
        driver: driver || 'Driver Assigned',
        vehicleNo: vehicleNo || 'DL-01-XX-0000',
        route: routeName || 'City Express Route'
      });
      return res.status(201).json(newBus);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to save bus to Database', error: err.message });
  }
};

exports.deleteBus = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const bus = await Bus.findByIdAndDelete(req.params.id);
      if (!bus) return res.status(404).json({ msg: 'Bus not found' });
      return res.json({ msg: 'Bus vehicle deleted from Database' });
    } else {
      const deleted = dbStore.deleteItem('buses', req.params.id);
      if (!deleted) return res.status(404).json({ msg: 'Bus not found' });
      return res.json({ msg: 'Bus vehicle deleted from Database' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete bus from Database', error: err.message });
  }
};

exports.getRoutes = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const routes = await Route.find().sort({ createdAt: -1 });
      return res.json(routes);
    } else {
      const routes = dbStore.getCollection('routes');
      return res.json(routes);
    }
  } catch (err) {
    const routes = dbStore.getCollection('routes');
    return res.json(routes);
  }
};

exports.addRoute = async (req, res) => {
  try {
    const { name, stops } = req.body;
    if (dbStore.isMongoConnected()) {
      const route = new Route({ name, stops: stops || [] });
      await route.save();
      return res.status(201).json(route);
    } else {
      const newRoute = dbStore.addItem('routes', {
        name: name || 'Express Bus Route',
        stops: stops || [ { name: 'Main Gate', pickupTime: '07:30 AM' } ]
      });
      return res.status(201).json(newRoute);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to save route to Database', error: err.message });
  }
};

exports.deleteRoute = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const route = await Route.findByIdAndDelete(req.params.id);
      if (!route) return res.status(404).json({ msg: 'Route not found' });
      return res.json({ msg: 'Transport route deleted from Database' });
    } else {
      const deleted = dbStore.deleteItem('routes', req.params.id);
      if (!deleted) return res.status(404).json({ msg: 'Route not found' });
      return res.json({ msg: 'Transport route deleted from Database' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete route from Database', error: err.message });
  }
};
