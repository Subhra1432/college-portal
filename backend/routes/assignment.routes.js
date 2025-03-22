const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

// @route   GET api/assignments
// @desc    Get assignments
// @access  Private
router.get('/', authMiddleware.protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Assignments route is working',
    data: []
  });
});

// @route   POST api/assignments
// @desc    Create an assignment
// @access  Private (Teachers only)
router.post('/', authMiddleware.protect, authMiddleware.authorize('teacher'), (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Assignment created successfully',
    data: {}
  });
});

// @route   POST api/assignments/:id/submit
// @desc    Submit an assignment
// @access  Private (Students only)
router.post('/:id/submit', authMiddleware.protect, authMiddleware.authorize('student'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Assignment submitted successfully',
    data: {}
  });
});

// @route   GET api/assignments/:id
// @desc    Get a specific assignment
// @access  Private
router.get('/:id', authMiddleware.protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Assignment retrieved successfully',
    data: {}
  });
});

module.exports = router; 