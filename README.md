##LIVE URL ##
https://schoolmanagement-cybn.onrender.com/

This backend can run with either a MongoDB (recommended) or a file-backed JSON store for quick local development.

How it works
- If MongoDB is connected, Mongoose models are used.
- If MongoDB is not available, the app falls back to a local JSON store (`backend/db_store.json`) managed by `backend/config/localDb.js`.
- `backend/services/dbStore.js` exposes helper methods (`getCollection`, `addItem`, `updateItem`, `deleteItem`) used by controllers when running in file mode.

Quick test (file-backed mode)
1. Ensure MongoDB is not running on localhost (or unset `MONGO_URI`).
2. From the `backend` folder run:
```bash
node scripts/testLocalDbOps.js
```
3. Inspect `backend/db_store.json` to see persisted changes.

Notes
- The file-backed writer uses atomic temp-file + rename and debounces rapid saves to avoid corruption.
- For production or multi-user scenarios, use a proper DB like MongoDB or Postgres.

Optional: use `lowdb` for a safer file-backed store
- Install the optional dependency from the `backend` folder:
```bash
npm install
```
- If `lowdb` is installed, the app will automatically use it for the JSON file store (faster writes and safer operations).
