const mongoose = require('mongoose');

const isMongoConnected = () => mongoose.connection.readyState === 1;

const failMongoRequired = () => {
  const error = new Error('MongoDB connection is required. File-based JSON storage is disabled.');
  error.name = 'MongoDBRequiredError';
  return error;
};

module.exports = {
  isMongoConnected,
  loadStore: () => {
    throw failMongoRequired();
  },
  saveStore: () => {
    throw failMongoRequired();
  },
  getCollection: () => {
    throw failMongoRequired();
  },
  addItem: () => {
    throw failMongoRequired();
  },
  updateItem: () => {
    throw failMongoRequired();
  },
  deleteItem: () => {
    throw failMongoRequired();
  }
};
