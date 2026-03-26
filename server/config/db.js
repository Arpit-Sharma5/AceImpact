const mongoose = require('mongoose');

/**
 * Connect to MongoDB using Mongoose.
 * Reads the connection string from the MONGODB_URI environment variable.
 * Exits the process if the connection fails (fail-fast approach).
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
