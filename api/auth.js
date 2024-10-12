const connectToDatabase = require("../db");
const User = require("../models/contact"); // Ensure this points to the correct model

module.exports = async function handler(req, res) {
    await connectToDatabase();

    if (req.method === "POST") {
        const { action } = req.body;

        try {
            if (action === "sign-up") {
                const { name, email, phone, password } = req.body;

                // Check for existing user
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    return res.status(400).json({ message: "Email already in use" });
                }

                const newUser = new User({ name, email, phone, password });
                await newUser.save();
                return res.status(201).json({ message: "User created successfully" });
            } else if (action === "login") {
                const { email, password } = req.body;
                const user = await User.findOne({ email });
                if (!user || !(await user.isValidPassword(password))) {
                    return res.status(401).json({ message: "Invalid credentials" });
                }

                return res.status(200).json({
                    message: "Login successful",
                    user: { id: user._id, email: user.email },
                });
            }
        } catch (err) {
            return res.status(500).json({ message: "Server error: " + err.message });
        }
    }
    return res.status(405).json({ message: "Method not allowed" });
};
