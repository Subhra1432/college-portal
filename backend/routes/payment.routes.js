const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const paymentController = require('../controllers/payment.controller');

// @route   GET api/payments
// @desc    Get payments for a student
// @access  Private
router.get('/', authMiddleware.protect, authMiddleware.authorize('student'), paymentController.getPayments);

// @route   POST api/payments
// @desc    Make a payment
// @access  Private (Student only)
router.post('/', authMiddleware.protect, authMiddleware.authorize('student'), paymentController.makePayment);

// @route   GET api/payments/receipt/:id
// @desc    Get payment receipt
// @access  Private
router.get('/receipt/:id', authMiddleware.protect, paymentController.getReceipt);

module.exports = router;