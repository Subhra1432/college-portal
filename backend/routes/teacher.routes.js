const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

// @route   GET api/teachers
// @desc    Get all teachers
// @access  Private (Admin only)
router.get('/', authMiddleware.protect, authMiddleware.authorize('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Teachers route is working',
    data: []
  });
});

// @route   GET api/teachers/profile
// @desc    Get teacher profile
// @access  Private
router.get('/profile', authMiddleware.protect, authMiddleware.authorize('teacher'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Teacher profile route is working',
    data: {}
  });
});

// @route   GET api/teachers/courses
// @desc    Get teacher courses
// @access  Private
router.get('/courses', authMiddleware.protect, authMiddleware.authorize('teacher'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Teacher courses route is working',
    data: []
  });
});

module.exports = router; 