const Contact = require('../models/Contact');

// POST /api/contact
const createContact = async (req, res) => {
  try {
    const { name, email, message, portfolioUserId } = req.body;
    if (!name || !email || !message || !portfolioUserId) {
      return res.status(400).json({ message: 'Name, email, message, and portfolioUserId are required.' });
    }
    const contact = new Contact({ name, email, message, portfolioUserId });
    await contact.save();
    res.status(201).json({ message: 'Message received! They will get back to you soon.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// GET /api/contact (authenticated — user's own messages)
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ portfolioUserId: req.user.id }).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// PUT /api/contact/:id/read (authenticated, mark as read)
const markRead = async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, portfolioUserId: req.user.id },
      { read: true },
      { new: true }
    );
    if (!contact) return res.status(404).json({ message: 'Message not found.' });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

module.exports = { createContact, getContacts, markRead };
