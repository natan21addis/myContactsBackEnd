// backend/api/contacts.js
const connectToDatabase = require("../db");
const Contact = require("../models/contact");

module.exports = async function handler(req, res) {
  await connectToDatabase(); // Ensure database connection

  // Helper function to handle errors
  const handleError = (err) => {
    return res.status(500).json({ message: err.message });
  };

  // Add Contact
  if (req.method === "POST") {
    const { name, email, phone } = req.body;

    try {
      const newContact = new Contact({ name, email, phone });
      await newContact.save();
      return res.json({ message: "Contact added successfully" });
    } catch (err) {
      return handleError(err);
    }

  // Get Contacts with pagination, search, and filtering
  } else if (req.method === "GET") {
    const { page = 1, limit = 10, search } = req.query;

    const query = {};
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
      const deletedContact = await Contact.findByIdAndDelete(id);
      if (!deletedContact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      return res.json({ message: "Contact deleted successfully" });
    } catch (err) {
      return handleError(err);
    }

  // Edit Contact
  } else if (req.method === "PUT") {
    const { id } = req.params; // Get the ID from the URL parameters
    const { name, email, phone } = req.body;

    try {
      const updatedContact = await Contact.findByIdAndUpdate(
        id, // Use the id from req.params
        { name, email, phone },
        { new: true } // Return the updated document
      );
      if (!updatedContact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      return res.json({ message: "Contact updated successfully", updatedContact });
    } catch (err) {
      return handleError(err);
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
};
