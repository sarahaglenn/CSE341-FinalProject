const mongoose = require('mongoose');
require('dotenv').config();

const mConnectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MongoDB URI is not defined');
    }
    await mongoose.connect(uri);
    console.log('Connected to MongoDB via Mongoose');
  } catch (err) {
    console.error('Mongoose connection failed:', err);
    throw err;
  }
};

module.exports = mConnectDB;
