const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', authMiddleware.protect, authController.getCurrentUser);
router.put('/update-profile', authMiddleware.protect, authController.updateProfile);
router.put('/change-password', authMiddleware.protect, authController.changePassword);

module.exports = router;