const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the users schema
const usersSchema = new mongoose.Schema({
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
  role: {
    type: String,
    enum: ['user', 'admin'], // You can define roles as per your requirements
    default: 'user',
  },
}, {
  timestamps: true,
});

// Hash password before saving
usersSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to validate password
usersSchema.methods.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Create the Users model
const Users = mongoose.model('Users', usersSchema);

module.exports = Users;
