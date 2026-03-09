const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const messageController = require('../controllers/message.controller');

// @route   GET api/messages
// @desc    Get user messages
// @access  Private
router.get('/', authMiddleware.protect, messageController.getMessages);

// @route   POST api/messages
// @desc    Send a message
// @access  Private
router.post('/', authMiddleware.protect, messageController.sendMessage);

// @route   GET api/messages/:id
// @desc    Get a specific message
// @access  Private
router.get('/:id', authMiddleware.protect, messageController.getMessage);

module.exports = router;