const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the contact schema
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Hash password before saving
contactSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to validate password
contactSchema.methods.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Create the Contact model
const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
