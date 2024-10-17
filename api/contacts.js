const express = require("express");
const connectToDatabase = require("../db");
const Contact = require("../models/contact");

const router = express.Router();

// Helper function to handle errors
const handleError = (res, err) => {
  return res.status(500).json({ message: err.message });
};

// Add Contact
router.post("/contacts", async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    const newContact = new Contact({ name, email, phone });
    await newContact.save();
    return res.json({ message: "Contact added successfully" });
  } catch (err) {
    handleError(res, err);
  }
});

// Get Contacts with pagination, search, and filtering
router.get("/contacts", async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;

  const query = {};
  if (search) {
    query.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
      { phone: new RegExp(search, 'i') },
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
      contacts,
    });
  } catch (err) {
    handleError(res, err);
  }
});

// Delete Contact
router.delete("/contacts", async (req, res) => {
  const { id } = req.query;

  try {
    const deletedContact = await Contact.findByIdAndDelete(id);
    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    return res.json({ message: "Contact deleted successfully" });
  } catch (err) {
    handleError(res, err);
  }
});

// Edit Contact
router.put("/contacts/:id", async (req, res) => {
  const { id } = req.params; // Get the ID from the URL parameters
  const { name, email, phone } = req.body;

  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { name, email, phone },
      { new: true } // Return the updated document
    );
    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    return res.json({ message: "Contact updated successfully", updatedContact });
  } catch (err) {
    handleError(res, err);
  }
});

// Middleware to ensure database connection before handling requests
router.use(async (req, res, next) => {
  await connectToDatabase();
  next();
});

// Export the router to be used in your main app
module.exports = router;
