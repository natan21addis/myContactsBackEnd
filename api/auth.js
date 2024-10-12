// backend/api/auth.js
const connectToDatabase = require("../db");
const User = require("../models/users");
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
};

module.exports = async function handler(req, res) {
  await connectToDatabase(); // Ensure database connection

  if (req.method === "POST") {
    const { action } = req.body; // Action can be "sign-up" or "login"

    try {
      if (action === "sign-up") {
        const { name, email, phone, password } = req.body;
        const newUser = new User({ name, email, phone, password });
        await newUser.save();
        return res.json({ message: "User created successfully" });
      } else if (action === "login") {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.isValidPassword(password))) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
        
        const token = generateToken(user._id); // Use the new generateToken function
        return res.json({ token });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
  return res.status(405).json({ message: "Method not allowed" });
};
