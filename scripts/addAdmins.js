const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcrypt');

dotenv.config();

async function createAdmin(email, password, name = 'Super Admin') {
  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log('Already exists:', email);
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    user = new User({ name, email, password: hashed, role: 'ADMIN' });
    await user.save();
    console.log('Created admin:', email);
  } catch (err) {
    console.error('Error creating', email, err.message || err);
  }
}

(async () => {
  try {
    await connectDB();

    const argv = process.argv.slice(2);
    if (argv.length === 0) {
      console.log('Usage: node addAdmins.js <email1> <email2> ... --password <password> [--name <name>]');
      process.exit(1);
    }

    // simple arg parsing
    let password = 'password';
    let name = 'Super Admin';
    const emails = [];
    for (let i = 0; i < argv.length; i++) {
      const a = argv[i];
      if (a === '--password' && argv[i+1]) { password = argv[i+1]; i++; }
      else if (a === '--name' && argv[i+1]) { name = argv[i+1]; i++; }
      else if (a.startsWith('--')) { /* ignore unknown flags */ }
      else emails.push(a);
    }

    if (emails.length === 0) {
      console.log('No emails provided. Nothing to do.');
      process.exit(1);
    }

    for (const email of emails) {
      await createAdmin(email, password, name);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
