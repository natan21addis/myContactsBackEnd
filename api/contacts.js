// backend/api/contacts.js
const connectToDatabase = require("../db");
const Contact = require("../models/contact");

module.exports = async function handler(req, res) {
  await connectToDatabase(); // Ensure database connection

  if (req.method === "POST") {
    const { name, email, phone } = req.body;

    try {
      const newContact = new Contact({ name, email, phone });
      await newContact.save();
      return res.json({ message: "Contact added successfully" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  } else if (req.method === "GET") {
    try {
      const contacts = await Contact.find();
      return res.json(contacts);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
  
  return res.status(405).json({ message: "Method not allowed" });
};
