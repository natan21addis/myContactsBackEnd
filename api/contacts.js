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

// Main handler function for contact management
module.exports = async function contactHandler(req, res) {
  await connectToDatabase(); // Ensure database connection

  // Apply authentication middleware
  authenticate(req, res, async () => {
    const handleError = (err) => {
      console.error("Error:", err); // Log the error for debugging
      return res.status(500).json({ message: err.message });
    };

    const userId = req.userId; // Extract userId from authentication middleware

    // Add Contact
    if (req.method === "POST") {
      const { name, email, phone } = req.body;

      try {
        const newContact = new Contact({ name, email, phone, userId }); // Include userId
        await newContact.save();
        return res.json({ message: "Contact added successfully", contact: newContact });
      } catch (err) {
        return handleError(err);
      }

    // Fetch Contacts for Logged-in User
    } else if (req.method === "GET") {
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

    // Fetch specific Contact by ID
    } else if (req.method === "GET" && req.params.id) {
      const { id } = req.params;

      try {
        const contact = await Contact.findOne({ _id: id, userId });
        if (!contact) {
          return res.status(404).json({ message: "Contact not found or unauthorized" });
        }
        return res.json(contact);
      } catch (err) {
        return handleError(err);
      }

    // Delete Contact
    } else if (req.method === "DELETE") {
      const { id } = req.params;

      try {
        const deletedContact = await Contact.findOneAndDelete({ _id: id, userId });
        if (!deletedContact) {
          return res.status(404).json({ message: "Contact not found or unauthorized" });
        }
        return res.json({ message: "Contact deleted successfully" });
      } catch (err) {
        return handleError(err);
      }

    // Edit Contact
    } else if (req.method === "PUT") {
      const { id } = req.params; // Get the contact ID from the path parameters
      const { name, email, phone } = req.body;

      // Log the incoming request details for debugging
      console.log('Updating contact ID:', id, 'for user ID:', userId, 'with data:', { name, email, phone });

      try {
        const updatedContact = await Contact.findOneAndUpdate(
          { _id: id, userId }, // Ensure user owns the contact
          { name, email, phone },
          { new: true, runValidators: true } // Return the updated document and validate
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
