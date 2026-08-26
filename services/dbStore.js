const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const storePath = path.join(__dirname, '../db_store.json');

function loadStore() {
  try {
    if (fs.existsSync(storePath)) {
      const data = fs.readFileSync(storePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading db_store.json:', err);
  }
  return {
    users: [],
    students: [],
    teachers: [],
    classes: [],
    fees: [],
    payments: [],
    notices: [],
    exams: [],
    marks: [],
    assignments: [],
    submissions: [],
    timetables: [],
    books: [],
    buses: [],
    routes: [],
    leaveRequests: [],
    notifications: []
  };
}

function saveStore(store) {
  try {
    fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to db_store.json:', err);
  }
}

const isMongoConnected = () => mongoose.connection.readyState === 1;

module.exports = {
  isMongoConnected,
  loadStore,
  saveStore,
  getCollection: (collName) => {
    const store = loadStore();
    return store[collName] || [];
  },
  addItem: (collName, item) => {
    const store = loadStore();
    if (!store[collName]) store[collName] = [];
    const newId = item._id || item.id || `${collName}_${Date.now()}`;
    const newItem = { _id: newId, id: newId, createdAt: new Date().toISOString(), ...item };
    store[collName].unshift(newItem);
    saveStore(store);
    return newItem;
  },
  updateItem: (collName, id, updates) => {
    const store = loadStore();
    if (!store[collName]) store[collName] = [];
    const idx = store[collName].findIndex(i => (i._id === id || i.id === id));
    if (idx !== -1) {
      store[collName][idx] = { ...store[collName][idx], ...updates, updatedAt: new Date().toISOString() };
      saveStore(store);
      return store[collName][idx];
    }
    return null;
  },
  deleteItem: (collName, id) => {
    const store = loadStore();
    if (!store[collName]) store[collName] = [];
    const initialLen = store[collName].length;
    store[collName] = store[collName].filter(i => (i._id !== id && i.id !== id));
    saveStore(store);
    return store[collName].length < initialLen;
  }
};
