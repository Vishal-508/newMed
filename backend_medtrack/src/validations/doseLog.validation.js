// validations/doseLog.validation.js
const { body } = require('express-validator');

exports.logDoseSchema = [
    body('medicationId')
        .notEmpty()
        .withMessage('Medication ID is required')
        .isString()
        .withMessage('Medication ID must be a string'),
        
    body('scheduledTime')
        .notEmpty()
        .withMessage('Scheduled time is required')
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Invalid time format. Use HH:mm (24-hour format)'),
        
    body('notes')
        .optional()
        .isString()
        .withMessage('Notes must be a string')
];