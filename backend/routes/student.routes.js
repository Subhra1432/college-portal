const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

// @route   GET api/students
// @desc    Get all students
// @access  Private (Admin and Teachers only)
router.get('/', authMiddleware.protect, authMiddleware.authorize('teacher', 'admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Students route is working',
    data: []
  });
});

// @route   GET api/students/profile
// @desc    Get student profile
// @access  Private
router.get('/profile', authMiddleware.protect, authMiddleware.authorize('student'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Student profile route is working',
    data: {}
  });
});

// @route   GET api/students/courses
// @desc    Get student courses
// @access  Private
router.get('/courses', authMiddleware.protect, authMiddleware.authorize('student'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Student courses route is working',
    data: []
  });
});

module.exports = router; 