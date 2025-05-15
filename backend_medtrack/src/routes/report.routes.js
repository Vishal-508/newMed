const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const authController = require('../controllers/auth.controller');

// Protect all routes
router.use(authController.authenticate);

// Get adherence stats
router.get('/adherence', reportController.getAdherenceStats);

// Export logs
router.get('/export', reportController.exportLogs);

module.exports = router;