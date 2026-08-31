const path = require('path');
const fs = require('fs');
const localDb = require('../config/localDb');

const DB_FILE = path.join(__dirname, '..', 'db_store.json');

let useLowdb = false;
let lowdb = null;
let _db = null;

try {
  // lowdb v1 commonjs API
  const low = require('lowdb');
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync(DB_FILE);
  lowdb = low(adapter);
  useLowdb = true;
  _db = lowdb;
} catch (e) {
  useLowdb = false;
}

async function init() {
  // ensure base local DB is initialized
  await localDb.initLocalDb();
  if (useLowdb) {
    // ensure defaults
    const defaults = Object.assign({}, localDb.db);
    _db.defaults(defaults).write();
  }
}

function getCollection(name) {
  if (useLowdb) {
    return _db.get(name).value() || [];
  }
  if (!localDb.db[name]) localDb.db[name] = [];
  return localDb.db[name];
}

function addItem(collection, item) {
  if (useLowdb) {
    const clone = Object.assign({}, item);
    if (!clone._id && !clone.id) clone._id = (collection + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2,8));
    if (!clone.id && clone._id) clone.id = clone._id;
    _db.get(collection).push(clone).write();
    return clone;
  }
  return localDb.db[collection] ? localDb.db[collection].push(item) && item : localDb.addItem(collection, item);
}

function updateItem(collection, id, updates) {
  if (useLowdb) {
    const key = '_id';
    const found = _db.get(collection).find(x => String(x._id || x.id) === String(id)).value();
    if (!found) return null;
    const merged = Object.assign({}, found, updates);
    _db.get(collection).find(x => String(x._id || x.id) === String(id)).assign(merged).write();
    return merged;
  }
  return localDb.updateItem(collection, id, updates);
}

function deleteItem(collection, id) {
  if (useLowdb) {
    const found = _db.get(collection).find(x => String(x._id || x.id) === String(id)).value();
    if (!found) return null;
    _db.get(collection).remove(x => String(x._id || x.id) === String(id)).write();
    return found;
  }
  return localDb.deleteItem(collection, id);
}

module.exports = {
  init,
  getCollection,
  addItem,
  updateItem,
  deleteItem,
  using: () => (useLowdb ? 'lowdb' : 'json')
};
