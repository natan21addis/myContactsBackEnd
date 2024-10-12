// backend/db.js
require('dotenv').config();

const mongoose = require("mongoose");

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    return mongoose.connect(process.env.DB_URI)
  }
};

module.exports = connectToDatabase;
