const mongoose = require('mongoose');
const localDb = require('../config/localDb');
const fileDb = require('./fileDb');

const isMongoConnected = () => mongoose.connection.readyState === 1;

// Ensure local DB is initialized when using file mode
let _localReady = false;
async function _ensureLocal() {
  if (_localReady) return;
  try {
    await localDb.initLocalDb();
    await fileDb.init();
  } catch (e) {
    // initLocalDb handles its own errors; continue with defaults
  }
  _localReady = true;
}

function _makeId(prefix = '') {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

module.exports = {
  isMongoConnected,
  loadStore: async () => {
    if (isMongoConnected()) throw new Error('MongoDB connected; use Mongoose models directly');
    await _ensureLocal();
    return localDb.db;
  },
  saveStore: async () => {
    if (isMongoConnected()) throw new Error('MongoDB connected; use Mongoose models directly');
    await _ensureLocal();
    localDb.saveLocalDb();
  },
  getCollection: (name) => {
    if (isMongoConnected()) throw new Error('MongoDB connected; use Mongoose models directly');
    if (!localDb.db[name]) localDb.db[name] = [];
    return fileDb.getCollection(name);
  },
  addItem: (collection, item) => {
    if (isMongoConnected()) throw new Error('MongoDB connected; use Mongoose models directly');
    return fileDb.addItem(collection, item);
  },
  updateItem: (collection, id, updates) => {
    if (isMongoConnected()) throw new Error('MongoDB connected; use Mongoose models directly');
    return fileDb.updateItem(collection, id, updates);
  },
  deleteItem: (collection, id) => {
    if (isMongoConnected()) throw new Error('MongoDB connected; use Mongoose models directly');
    return fileDb.deleteItem(collection, id);
  }
};
