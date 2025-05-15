const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validate } = require('../middleware/validate');
const { signupSchema, loginSchema } = require('../validations/auth.validation');

// Signup
router.post('/signup',  authController.signup);

// Login
router.post('/login', authController.login);

// Get current user (protected)
router.get('/me', authController.authenticate, authController.getCurrentUser);

module.exports = router;