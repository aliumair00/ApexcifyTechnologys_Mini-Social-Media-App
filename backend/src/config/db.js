const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
  const dbName = process.env.MONGO_DB_NAME || 'mini_social_app';
  console.log('Connecting MongoDB:', uri, 'dbName:', dbName);
  try {
    await mongoose.connect(uri, { dbName });
    console.log('MongoDB connected:', dbName);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw err;
  }
};

module.exports = connectDB;
