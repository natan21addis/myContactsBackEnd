// backend/api/protected.js
const verifyToken = require("./verifyToken");
const connectToDatabase = require("../db");

module.exports = async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    verifyToken(req, res, () => {
      res.json({ message: "Access granted. You are authenticated." });
    });
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
};
