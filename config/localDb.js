const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../db_store.json');

const dbData = {
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

async function initLocalDb() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf8').trim();
      if (content) {
        const parsed = JSON.parse(content);
        if (parsed && typeof parsed === 'object') {
          Object.keys(dbData).forEach((key) => {
            dbData[key] = Array.isArray(parsed[key]) ? parsed[key] : [];
          });
          console.log(`⚡ Loaded Persistent Local Database from db_store.json (${dbData.users.length} users, ${dbData.students.length} students)`);
          return dbData;
        }
      }
    } catch (e) {
      console.warn('⚠️ Local database file is invalid or unreadable. Resetting to empty store...');
    }
  }

  // Initialize empty persistent database; create data through app actions or a dedicated seed endpoint.
  Object.keys(dbData).forEach((key) => {
    dbData[key] = [];
  });

  saveLocalDb();
  console.log('🌱 Initialized empty persistent local database. Add records through the app/database workflows.');
  return dbData;
}

let _writePromise = Promise.resolve();
let _saveTimer = null;
const SAVE_DEBOUNCE_MS = 100;

function saveLocalDb() {
  // Debounce rapid calls and serialize writes to avoid races.
  if (_saveTimer) clearTimeout(_saveTimer);
  _saveTimer = setTimeout(() => {
    const data = JSON.stringify(dbData, null, 2);
    const tmpFile = DB_FILE + '.tmp';

    _writePromise = _writePromise.then(() => new Promise((resolve) => {
      fs.writeFile(tmpFile, data, 'utf8', (err) => {
        if (err) {
          console.error('⚠️ Failed to write temp DB file:', err.message);
          return resolve();
        }
        fs.rename(tmpFile, DB_FILE, (err2) => {
          if (err2) {
            console.error('⚠️ Failed to rename temp DB file:', err2.message);
          }
          resolve();
        });
      });
    })).catch((e) => {
      console.error('⚠️ Failed to save local DB:', e && e.message ? e.message : e);
    });
  }, SAVE_DEBOUNCE_MS);
}

module.exports = {
  initLocalDb,
  saveLocalDb,
  db: dbData
};
