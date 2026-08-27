const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/school_db';
  mongoose.set('strictQuery', false);

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log('✅ MongoDB database connected successfully:', uri);
    return true;
  } catch (err) {
    console.warn('⚠️ MongoDB at localhost is not available. Trying an in-memory MongoDB instance for local development...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoMemoryServer = await MongoMemoryServer.create();
      const mongoUri = mongoMemoryServer.getUri();
      await mongoose.connect(mongoUri);
      console.log('✅ In-memory MongoDB connected successfully:', mongoUri);
      return true;
    } catch (memoryErr) {
      console.error('❌ MongoDB connection failed:', memoryErr.message);
      throw memoryErr;
    }
  }
};

module.exports = connectDB;


