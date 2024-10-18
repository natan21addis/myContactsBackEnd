const mongoose = require('mongoose');

// Define the contact schema
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
  },
  phone: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users', // Reference to the User model
    required: true,
  },
}, {
  timestamps: true,
});

// Create the Contact model
const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
