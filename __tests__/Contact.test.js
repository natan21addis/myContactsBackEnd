// __tests__/Contact.test.js
const mongoose = require('mongoose');
const Contact = require('../models/contact'); // Adjust the path as necessary



describe('Contact Model Test', () => {
  it('should create a contact successfully', async () => {
    const contactData = {
      userId: new mongoose.Types.ObjectId(),
      name: 'John Doe',
      phone: '123-456-7890',
      email: 'john@example.com',
      password: 'securepassword',
      image: 'http://example.com/image.jpg',
    };

    const contact = new Contact(contactData);
    const savedContact = await contact.save();

    expect(savedContact._id).toBeDefined();
    expect(savedContact.name).toBe(contactData.name);
    expect(savedContact.phone).toBe(contactData.phone);
    expect(savedContact.email).toBe(contactData.email);
    expect(savedContact.password).toBe(contactData.password);
    expect(savedContact.image).toBe(contactData.image);
  });

  it('should throw an error if name is missing', async () => {
    const contactData = {
      userId: new mongoose.Types.ObjectId(),
      phone: '123-456-7890',
      email: 'john@example.com',
      password: 'securepassword',
    };

    const contact = new Contact(contactData);
    
    await expect(contact.save()).rejects.toThrow();
  });

  it('should throw an error if password is missing', async () => {
    const contactData = {
      userId: new mongoose.Types.ObjectId(),
      name: 'Jane Doe',
      phone: '987-654-3210',
      email: 'jane@example.com',
      image: 'http://example.com/image.jpg',
    };

    const contact = new Contact(contactData);
    
    await expect(contact.save()).rejects.toThrow();
  });
});
