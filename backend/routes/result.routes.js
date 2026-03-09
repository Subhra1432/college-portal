const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const resultController = require('../controllers/result.controller');

// @route   GET api/results
// @desc    Get results for a student
// @access  Private
router.get('/', authMiddleware.protect, authMiddleware.authorize('student'), resultController.getResults);

// @route   POST api/results
// @desc    Upload results
// @access  Private (Teachers only)
router.post('/', authMiddleware.protect, authMiddleware.authorize('teacher'), resultController.uploadResults);

// @route   GET api/results/semester/:semester
// @desc    Get results for a specific semester
// @access  Private
router.get('/semester/:semester', authMiddleware.protect, resultController.getSemesterResults);

module.exports = router;