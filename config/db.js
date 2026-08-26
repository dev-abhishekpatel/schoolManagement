const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/school_db';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('✅ MongoDB Database Connected Successfully:', uri);

    // Auto-seed database if empty
    const User = require('../models/User');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('⚡ Empty Database Detected! Auto-populating initial school dataset...');
      const seedData = require('../scripts/seedData');
      await seedData(true);
      console.log('✅ Auto-Seeding Complete!');
    }
  } catch (err) {
    console.warn('⚠️  MongoDB Direct Connection Warning:', err.message);
    console.warn('⚠️  Connect to a local MongoDB daemon or set MONGO_URI in .env with valid credentials.');
    mongoose.disconnect().catch(() => {});
  }
};

module.exports = connectDB;
