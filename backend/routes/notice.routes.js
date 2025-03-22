const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

// @route   GET api/notices
// @desc    Get all notices
// @access  Public
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Notices route is working',
    data: []
  });
});

// @route   POST api/notices
// @desc    Create a notice
// @access  Private (Admin and Teachers only)
router.post('/', authMiddleware.protect, authMiddleware.authorize('teacher', 'admin'), (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Notice created successfully',
    data: {}
  });
});

// @route   GET api/notices/:id
// @desc    Get a specific notice
// @access  Public
router.get('/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Notice retrieved successfully',
    data: {}
  });
});

module.exports = router; 