const dbStore = require('../services/dbStore');

async function run() {
  console.log('Initializing local store (if Mongo not connected)...');
  try {
    await dbStore.loadStore();
  } catch (e) {
    // ignore if Mongo connected
  }

  console.log('Initial counts:');
  const collections = ['students', 'teachers', 'books', 'timetables', 'leaveRequests', 'notices'];
  collections.forEach(c => console.log(` - ${c}:`, (dbStore.getCollection(c) || []).length));

  console.log('\nAdding sample items (concurrent) to students and books...');

  const ops = [];
  for (let i = 0; i < 5; i++) {
    ops.push(new Promise((res) => {
      const s = dbStore.addItem('students', { name: `Test Student ${i}`, rollNumber: `T-${i}` });
      res(s);
    }));
    ops.push(new Promise((res) => {
      const b = dbStore.addItem('books', { title: `Test Book ${i}`, author: 'Automated' });
      res(b);
    }));
  }

  await Promise.all(ops);

  console.log('After adds:');
  collections.forEach(c => console.log(` - ${c}:`, (dbStore.getCollection(c) || []).length));

  console.log('\nUpdating one student...');
  const students = dbStore.getCollection('students');
  if (students.length) {
    const u = dbStore.updateItem('students', students[0]._id || students[0].id, { attendancePercentage: 99 });
    console.log('Updated:', u && (u._id || u.id));
  }

  console.log('\nDeleting one book...');
  const books = dbStore.getCollection('books');
  if (books.length) {
    const d = dbStore.deleteItem('books', books[0]._id || books[0].id);
    console.log('Deleted:', d && (d._id || d.id));
  }

  console.log('\nFinal counts:');
  collections.forEach(c => console.log(` - ${c}:`, (dbStore.getCollection(c) || []).length));

  console.log('\nDone. Verify db_store.json in backend/ to ensure persistent changes.');
}

run().catch(err => console.error('Test script failed:', err && err.message ? err.message : err));
