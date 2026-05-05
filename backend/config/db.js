const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGODB_URL;

  if (!uri) {
    throw new Error('MONGODB_URI or MONGODB_URL is not defined in environment variables.');
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
