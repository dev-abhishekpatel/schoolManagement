const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const BASE = 'http://localhost:5000';

async function waitForServer(timeout = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(BASE + '/api/auth/login', { method: 'OPTIONS' });
      // some servers may not respond to OPTIONS, ignore
    } catch (e) {
      // server not ready
      await new Promise(r => setTimeout(r, 300));
      continue;
    }
    return true;
  }
  throw new Error('Server did not become ready in time');
}

async function run() {
  try {
    console.log('Seeding DB...');
    await fetch(BASE + '/api/auth/seed', { method: 'POST' });

    console.log('Logging in as admin...');
    const loginResp = await fetch(BASE + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@school.com', password: 'password123' })
    });
    const loginJson = await loginResp.json();
    if (!loginJson.token) throw new Error('Login failed: no token');
    const token = loginJson.token;

    const tests = [
      { path: '/api/students', name: 'students' },
      { path: '/api/teachers', name: 'teachers' },
      { path: '/api/library/books', name: 'library_books' },
      { path: '/api/notices', name: 'notices' }
    ];

    for (const t of tests) {
      const r = await fetch(BASE + t.path, { headers: { Authorization: `Bearer ${token}` } });
      if (r.status !== 200) throw new Error(`${t.name} endpoint returned ${r.status}`);
      const j = await r.json();
      if (!Array.isArray(j)) console.warn(`${t.name} did not return an array (type ${typeof j})`);
      console.log(`OK: ${t.name} -> ${Array.isArray(j) ? j.length : typeof j}`);
    }

    console.log('\nIntegration tests passed');
    process.exit(0);
  } catch (err) {
    console.error('Integration tests failed:', err.message || err);
    process.exit(2);
  }
}

run();
