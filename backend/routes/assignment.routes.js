const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const assignmentController = require('../controllers/assignment.controller');

// @route   GET api/assignments
// @desc    Get assignments
// @access  Private
router.get('/', authMiddleware.protect, assignmentController.getAssignments);

// @route   POST api/assignments
// @desc    Create an assignment
// @access  Private (Teachers only)
router.post('/', authMiddleware.protect, authMiddleware.authorize('teacher'), assignmentController.createAssignment);

// @route   POST api/assignments/:id/submit
// @desc    Submit an assignment
// @access  Private (Students only)
router.post('/:id/submit', authMiddleware.protect, authMiddleware.authorize('student'), assignmentController.submitAssignment);

// @route   GET api/assignments/:id
// @desc    Get a specific assignment
// @access  Private
router.get('/:id', authMiddleware.protect, assignmentController.getAssignment);

module.exports = router;