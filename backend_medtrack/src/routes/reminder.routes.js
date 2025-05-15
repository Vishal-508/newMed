const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminder.controller');
const authController = require('../controllers/auth.controller');

// Protect all routes
router.use(authController.authenticate);

// Get reminder settings
router.get('/settings', reminderController.getSettings);

// Update reminder settings
router.patch('/settings', reminderController.updateSettings);

// Setup Google Calendar integration
router.post('/calendar', reminderController.setupCalendar);

module.exports = router;