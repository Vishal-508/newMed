const { validationResult } = require('express-validator');

/**
 * Middleware to validate request data
 * @param {Array} validations - Array of validation chains
 */
exports.validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));
    
    // Check for errors
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    
    // Format errors
    const formattedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }));
    
    res.status(400).json({ 
      message: 'Validation failed',
      errors: formattedErrors 
    });
  };
};




// const { validationResult } = require('express-validator');

// exports.validate = (validations) => {
//   return async (req, res, next) => {
//     await Promise.all(validations.map(validation => validation.run(req)));
    
//     const errors = validationResult(req);
//     if (errors.isEmpty()) {
//       return next();
//     }
    
//     res.status(400).json({ errors: errors.array() });
//   };
// };