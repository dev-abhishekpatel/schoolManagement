const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/school_db';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB Database Connected Successfully:', uri);

    // Auto-seed MongoDB collections if empty
    const User = require('../models/User');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('⚡ Empty MongoDB Collections Detected! Auto-populating initial dataset...');
      const seedData = require('../scripts/seedData');
      await seedData(true);
      console.log('✅ MongoDB Database Populated with Demo Data!');
    }
  } catch (err) {
    console.error('❌ MongoDB Connection Failure:', err.message);
    console.error('💡 Ensure local MongoDB service is running (e.g. systemctl start mongod) or set MONGO_URI in .env with valid credentials.');
  }
};

module.exports = connectDB;
