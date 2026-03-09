const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const noticeController = require('../controllers/notice.controller');

// @route   GET api/notices
// @desc    Get all notices
// @access  Public
router.get('/', noticeController.getNotices);

// @route   POST api/notices
// @desc    Create a notice
// @access  Private (Admin and Teachers only)
router.post('/', authMiddleware.protect, authMiddleware.authorize('teacher', 'admin'), noticeController.createNotice);

// @route   GET api/notices/:id
// @desc    Get a specific notice
// @access  Public
router.get('/:id', noticeController.getNotice);

module.exports = router;