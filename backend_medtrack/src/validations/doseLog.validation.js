// validations/doseLog.validation.js
const { body } = require('express-validator');

exports.logDoseSchema = [
    body('medicationId').notEmpty().withMessage('Medication ID is required'),
    body('scheduledTime').isISO8601().withMessage('Invalid date format'),
    body('notes').optional().isString()
];