const mongoose = require('mongoose');
const User = require('../models/users'); // Adjust the path as necessary



describe('User Model Test', () => {
  it('should create a user successfully', async () => {
    const userData = { name: 'John Doe', email: 'john@example.com' };
    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.email).toBe(userData.email);
  });

  it('should throw an error if email is missing', async () => {
    const userData = { name: 'Jane Doe' };
    const user = new User(userData);
    
    await expect(user.save()).rejects.toThrow();
  });
});
