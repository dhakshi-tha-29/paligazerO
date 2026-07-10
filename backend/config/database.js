const mongoose = require('mongoose');

let isMemoryServer = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && uri !== 'mongodb://localhost:27017/paligazer') {
    try {
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error('MongoDB connection error:', error.message);
      process.exit(1);
    }
  }

  // Try local MongoDB first
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/paligazer');
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.log('Local MongoDB not available, starting in-memory MongoDB...');
  }

  // Fallback to in-memory MongoDB
  const { MongoMemoryServer } = require('mongodb-memory-server-core');
  const mongod = await MongoMemoryServer.create();
  const memoryUri = mongod.getUri();

  const conn = await mongoose.connect(memoryUri);
  isMemoryServer = true;
  console.log(`In-memory MongoDB connected: ${conn.connection.host}`);
  return conn;
};

const isUsingMemoryServer = () => isMemoryServer;

module.exports = connectDB;
module.exports.isUsingMemoryServer = isUsingMemoryServer;
