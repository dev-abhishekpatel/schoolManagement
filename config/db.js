const mongoose = require("mongoose");
const { initLocalDb } = require("./localDb");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn("⚠️ MONGO_URI is not set. Falling back to local persistent JSON database.");
    await initLocalDb();
    return false;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log("✅ MongoDB connected successfully");
    return true;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.warn("⚡ Falling back to local persistent JSON database store.");
    await initLocalDb();
    return false;
  }
};

module.exports = connectDB;




