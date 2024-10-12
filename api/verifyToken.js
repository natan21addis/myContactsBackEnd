// backend/api/verifyToken.js
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  // Log the entire authorization header for debugging
  console.log("Authorization Header:", authHeader);

  const token = authHeader ? authHeader.split(" ")[1] : null; // Extract token from Bearer header
  if (!token) {
    console.log("Token is missing.");
    return res.status(401).json({ message: "Access denied. Token is missing." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Invalid token:", err.message);
      return res.status(400).json({ message: "Invalid token." });
    }

    console.log("Decoded Token:", decoded);
    req.userId = decoded.id; // Store the user ID for further use
    next();
  });
}

module.exports = verifyToken;
