const connectToDatabase = require("../db");
const Contact = require("../models/contact");
const jwt = require('jsonwebtoken');

// Middleware to authenticate user
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get the token from the headers

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.userId = decoded.id; // Set userId from token
    next();
  });
};

module.exports = async function handler(req, res) {
  await connectToDatabase(); // Ensure database connection

  // Apply authentication middleware
  authenticate(req, res, async () => {
    // Helper function to handle errors
    const handleError = (err) => {
      return res.status(500).json({ message: err.message });
    };

    // Add Contact
    if (req.method === "POST") {
      const { name, email, phone } = req.body;
      const userId = req.userId; // Extract userId from authentication middleware

      try {
        const newContact = new Contact({ name, email, phone, userId }); // Include userId
        await newContact.save();
        return res.json({ message: "Contact added successfully", contact: newContact });
      } catch (err) {
        return handleError(err);
      }

    // Get Contacts for Logged-in User
    } else if (req.method === "GET") {
      const userId = req.userId; // Extract userId from authentication middleware
      const { page = 1, limit = 10, search } = req.query;

      const query = { userId }; // Ensure only the logged-in user's contacts are fetched
      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') },
          { phone: new RegExp(search, 'i') }
        ];
      }

      try {
        const contacts = await Contact.find(query)
          .limit(limit * 1)
          .skip((page - 1) * limit);
        const total = await Contact.countDocuments(query);

        return res.json({
          totalPages: Math.ceil(total / limit),
          currentPage: page,
          contacts
        });
      } catch (err) {
        return handleError(err);
      }

    // Delete Contact
    } else if (req.method === "DELETE") {
      const { id } = req.query;

      try {
        const deletedContact = await Contact.findOneAndDelete({ _id: id, userId: req.userId });
        if (!deletedContact) {
          return res.status(404).json({ message: "Contact not found or unauthorized" });
        }
        return res.json({ message: "Contact deleted successfully" });
      } catch (err) {
        return handleError(err);
      }

    // Edit Contact
    } else if (req.method === "PUT") {
      const { id } = req.query;
      const { name, email, phone } = req.body;

      try {
        const updatedContact = await Contact.findOneAndUpdate(
          { _id: id, userId: req.userId }, // Ensure user owns the contact
          { name, email, phone },
          { new: true } // Return the updated document
        );
        if (!updatedContact) {
          return res.status(404).json({ message: "Contact not found or unauthorized" });
        }
        return res.json({ message: "Contact updated successfully", updatedContact });
      } catch (err) {
        return handleError(err);
      }
    }

    return res.status(405).json({ message: "Method not allowed" });
  });
};
