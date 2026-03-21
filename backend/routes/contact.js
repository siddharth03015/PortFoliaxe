const express = require('express');
const router = express.Router();
const { createContact, getContacts, markRead } = require('../controllers/contactController');
const authMiddleware = require('../middleware/auth');

router.post('/', createContact);
router.get('/', authMiddleware, getContacts);
router.put('/:id/read', authMiddleware, markRead);

module.exports = router;
