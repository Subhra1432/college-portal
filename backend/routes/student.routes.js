const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const studentController = require('../controllers/student.controller');

// @route   GET api/students
// @desc    Get all students
// @access  Private (Admin and Teachers only)
router.get('/', authMiddleware.protect, authMiddleware.authorize('teacher', 'admin'), studentController.getAllStudents);

// @route   GET api/students/profile
// @desc    Get student profile
// @access  Private
router.get('/profile', authMiddleware.protect, authMiddleware.authorize('student'), studentController.getProfile);

// @route   GET api/students/courses
// @desc    Get student courses
// @access  Private
router.get('/courses', authMiddleware.protect, authMiddleware.authorize('student'), studentController.getCourses);

module.exports = router;