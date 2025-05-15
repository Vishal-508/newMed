/**
 * Central error handling middleware
 */
exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  // Mongoose duplicate key error
  if (err.name === 'MongoError' && err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({ 
      message: `Duplicate ${field}`, 
      field 
    });
  }
  
  // Custom application error
  if (err.message) {
    return res.status(400).json({ 
      message: err.message 
    });
  }
  
  // Default to 500 server error
  res.status(500).json({ message: 'Internal Server Error' });
};




// exports.errorHandler = (err, req, res, next) => {
//   console.error(err.stack);
  
//   if (err.name === 'ValidationError') {
//     return res.status(400).json({ 
//       message: 'Validation Error',
//       errors: err.errors 
//     });
//   }
  
//   if (err.name === 'MongoError' && err.code === 11000) {
//     return res.status(400).json({ 
//       message: 'Duplicate key error',
//       field: Object.keys(err.keyPattern)[0]
//     });
//   }
  
//   res.status(500).json({ message: 'Internal Server Error' });
// };