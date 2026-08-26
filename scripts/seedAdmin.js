const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcrypt');

dotenv.config();

(async () => {
  try {
    await connectDB();
    const email = process.env.ADMIN_EMAIL || 'admin@school.test';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    let admin = await User.findOne({ email });
    if (admin) {
      console.log('Admin already exists:', email);
      process.exit(0);
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    admin = new User({ name: 'Super Admin', email, password: hashed, role: 'ADMIN' });
    await admin.save();
    console.log('Admin user created:', email);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
