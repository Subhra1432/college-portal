const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

// @route   GET api/messages
// @desc    Get user messages
// @access  Private
router.get('/', authMiddleware.protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Messages route is working',
    data: []
  });
});

// @route   POST api/messages
// @desc    Send a message
// @access  Private
router.post('/', authMiddleware.protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Message sent successfully',
    data: {}
  });
});

// @route   GET api/messages/:id
// @desc    Get a specific message
// @access  Private
router.get('/:id', authMiddleware.protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Message retrieved successfully',
    data: {}
  });
});

module.exports = router; 