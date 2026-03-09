const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const attendanceController = require('../controllers/attendance.controller');

// @route   GET api/attendance
// @desc    Get attendance for a student
// @access  Private
router.get('/', authMiddleware.protect, attendanceController.getAttendance);

// @route   POST api/attendance
// @desc    Upload attendance
// @access  Private (Teachers only)
router.post('/', authMiddleware.protect, authMiddleware.authorize('teacher'), attendanceController.uploadAttendance);

// @route   GET api/attendance/course/:id
// @desc    Get attendance for a specific course
// @access  Private
router.get('/course/:id', authMiddleware.protect, attendanceController.getCourseAttendance);

module.exports = router;