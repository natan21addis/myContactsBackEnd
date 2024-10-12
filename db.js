// backend/db.js
const mongoose = require("mongoose");

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  }
};

module.exports = connectToDatabase;
