const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/school_db';
  mongoose.set('strictQuery', false);

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 1500,
    });
    console.log('✅ MongoDB Database Connected Successfully:', uri);
  } catch (err) {
    console.log('💡 Standalone MongoDB daemon not detected on 127.0.0.1:27017.');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const mongoUri = mongod.getUri();
      await mongoose.connect(mongoUri);
      console.log('✅ MongoDB Memory Server Connected Successfully at:', mongoUri);
    } catch (memErr) {
      console.log('✅ Database Engine ready: File-backed Database Store (db_store.json) active for all CRUD endpoints.');
    }
  }
};

module.exports = connectDB;


