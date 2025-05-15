const jwt = require('jsonwebtoken');
const config = require('../config');
const AuthService = require('../services/auth.service');
const mongoose = require('mongoose');
/**
 * Handle user authentication requests
 */
exports.signup = async (req, res, next) => {
  try {
     const _id = new mongoose.Types.ObjectId().toString(); 
    // const { email, password, name } = req.body;
    const result = await AuthService.signup({ ...req.body, _id });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for:", email);
    const result = await AuthService.login(email, password);
    res.json(result);
  } catch (err) {
    console.error("Login error:", err);
    next(err);
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await AuthService.getUserById(req.user.id);
    console.log("Fetched user:", user);
    res.json({ user });
  } catch (err) {
    console.error("Get user error:", err);
    res.status(401).json({ message: 'User not found' });
  }
};

// Middleware to authenticate requests
exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log("Received token:", token);
    
    if (!token) {
      console.warn("No token provided");
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, config.jwt.secret);
    console.log("Decoded token:", decoded);
    
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(401).json({ 
      message: 'Invalid token',
      error: err.message // For debugging
    });
  }
};









// const User = require('../models/User');
// const jwt = require('jsonwebtoken');
// const config = require('../config');

// exports.signup = async (req, res, next) => {
//   try {
//     const { email, password, name } = req.body;
    
//     // Check if user exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Email already in use' });
//     }
    
//     // Create user
//     const user = new User({ email, password, name });
//     await user.save();
    
//     // Generate token
//     const token = jwt.sign({ id: user._id }, config.jwtSecret, {
//       expiresIn: '30d'
//     });
    
//     res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name } });
//   } catch (err) {
//     next(err);
//   }
// };

// exports.login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
    
//     // Find user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
    
//     // Check password
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
    
//     // Generate token
//     const token = jwt.sign({ id: user._id }, config.jwtSecret, {
//       expiresIn: '30d'
//     });
    
//     res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
//   } catch (err) {
//     next(err);
//   }
// };

// exports.authenticate = async (req, res, next) => {
//   try {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
//     if (!token) {
//       return res.status(401).json({ message: 'No token, authorization denied' });
//     }
    
//     const decoded = jwt.verify(token, config.jwtSecret);
//     const user = await User.findById(decoded.id);
    
//     if (!user) {
//       return res.status(401).json({ message: 'User not found' });
//     }
    
//     req.user = user;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// };

// exports.getCurrentUser = async (req, res) => {
//   res.json({
//     user: {
//       id: req.user._id,
//       email: req.user.email,
//       name: req.user.name
//     }
//   });
// };