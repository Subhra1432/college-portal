const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const teacherController = require('../controllers/teacher.controller');

// @route   GET api/teachers
// @desc    Get all teachers
// @access  Private (Admin only)
router.get('/', authMiddleware.protect, authMiddleware.authorize('admin'), teacherController.getAllTeachers);

// @route   GET api/teachers/profile
// @desc    Get teacher profile
// @access  Private
router.get('/profile', authMiddleware.protect, authMiddleware.authorize('teacher'), teacherController.getProfile);

// @route   GET api/teachers/courses
// @desc    Get teacher courses
// @access  Private
router.get('/courses', authMiddleware.protect, authMiddleware.authorize('teacher'), teacherController.getCourses);

module.exports = router;