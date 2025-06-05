const express = require('express');
const router = express.Router();
const doseLogController = require('../controllers/doseLog.controller');
const authController = require('../controllers/auth.controller');
const { logDoseSchema } = require('../validations/doseLog.validation');
const { validate } = require('../middleware/validate');
// Protect all routes
router.use(authController.authenticate);

// Log a dose
// router.post('/', doseLogController.logDose);
router.post('/', 
    validate(logDoseSchema), 
    doseLogController.logDose
);

// Get logs for a date range
router.get('/getLogs', doseLogController.getLogs);

// Update log (for adding notes, etc.)
router.patch('/:id', doseLogController.updateLog);
// Add these new routes after existing ones
router.get('/stats', doseLogController.getAdherenceStats);
router.get('/recent', doseLogController.getRecentLogs);
router.get('/medication/:medicationId', doseLogController.getMedicationLogs);

module.exports = router;