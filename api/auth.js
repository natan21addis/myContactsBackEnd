const connectToDatabase = require("../db");
const User = require("../models/users");

module.exports = async function handler(req, res) {
  await connectToDatabase(); // Ensure database connection

  if (req.method === "POST") {
    const { action } = req.body; // Action can be "sign-up" or "login"

    try {
      if (action === "sign-up") {
        const { name, email, phone, password } = req.body;
        const newUser = new User({ name, email, phone, password });
        await newUser.save();
        return res.status(201).json({ message: "User created successfully" });
      } else if (action === "login") {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.isValidPassword(password))) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        // Instead of a token, you can return user information or a success message
        return res.status(200).json({ message: "Login successful", user: { id: user._id, email: user.email } });
      }
    } catch (err) {
      return res.status(500).json({ message: "Server error: " + err.message });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
};
