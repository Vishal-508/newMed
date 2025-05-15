const express = require('express');
const router = express.Router();
const medicationController = require('../controllers/medication.controller');
const authController = require('../controllers/auth.controller');

// Protect all routes
router.use(authController.authenticate);

// Get all medications
router.get('/', medicationController.getAllMedications);

// Create new medication
router.post('/create', medicationController.createMedication);

// Get single medication
router.get('/:id', medicationController.getMedication);

// Update medication
router.patch('/:id', medicationController.updateMedication);

// Delete medication
router.delete('/:id', medicationController.deleteMedication);

module.exports = router;