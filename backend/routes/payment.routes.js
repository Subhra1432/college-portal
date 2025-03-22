const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

// @route   GET api/payments
// @desc    Get payments for a student
// @access  Private
router.get('/', authMiddleware.protect, authMiddleware.authorize('student'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Payments route is working',
    data: []
  });
});

// @route   POST api/payments
// @desc    Make a payment
// @access  Private (Student only)
router.post('/', authMiddleware.protect, authMiddleware.authorize('student'), (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Payment recorded successfully',
    data: {}
  });
});

// @route   GET api/payments/receipt/:id
// @desc    Get payment receipt
// @access  Private
router.get('/receipt/:id', authMiddleware.protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Payment receipt retrieved successfully',
    data: {}
  });
});

module.exports = router; 