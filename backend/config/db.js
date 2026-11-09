const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`[MongoDB] Connected successfully to ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error] ${error.message}`);
    console.error(`-> Please verify that your local MongoDB Community Server is started (e.g. run 'net start MongoDB' or 'mongod').`);
    process.exit(1);
  }
};

module.exports = connectDB;
