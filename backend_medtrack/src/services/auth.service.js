const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

/**
 * Service for handling authentication operations
 */
class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User data (email, password, name)
   * @returns {Promise<Object>} - Created user and auth token
   */
  static async signup(userData) {
    try {
      const { email, password, name ,_id} = userData;
      
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('Email already in use');
      }
      
      // Hash password
      const salt = 10;
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create user
      const user = new User({
         _id,
        email,
        password: hashedPassword,
        name
      });
      
      await user.save();
      
      // Generate JWT token
    //   const token = this.generateToken(user._id);
      
      return {
        user: this.getSafeUser(user)
        // token
      };
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error('Registration failed. Please try again.');
    }
  }
  
  /**
   * Authenticate user
   * @param {String} email - User email
   * @param {String} password - User password
   * @returns {Promise<Object>} - User data and auth token
   */
static async login(email, password) {
  try {
    console.log('Attempting login for:', email);
    
    const user = await User.findOne({ email });

    console.log("user",user)
    if (!user) {
      console.log('User not found');
      throw new Error('Invalid credentials');
    }

    // Critical debug logs
    console.log('Raw input password:', `"${password}"`);
    console.log('Password length:', password.length);
    console.log('Stored hash:', user.password);
    
    // Compare with timing safe comparison
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Bcrypt compare result:', isMatch);
    
    if (!isMatch) {
      // Additional verification step
      const newHash = await bcrypt.hash(password, 10);
      console.log('New hash with same password:', newHash);
      console.log('Compare new hash with stored:', newHash === user.password);
      
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user._id);
    return {
      user: this.getSafeUser(user),
      token
    };
  } catch (error) {
    console.error('Login error details:', {
      message: error.message,
      stack: error.stack
    });
    throw new Error('Authentication failed. Please try again.');
  }
}
  /**
   * Get user by ID (without sensitive data)
   * @param {String} userId - User ID
   * @returns {Promise<Object>} - User data
   */
  static async getUserById(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      return this.getSafeUser(user);
    } catch (error) {
      console.error('Get user error:', error);
      throw new Error('Failed to fetch user information');
    }
  }
  
  /**
   * Generate JWT token
   * @param {String} userId - User ID
   * @returns {String} - JWT token
   */
  static generateToken(userId) {
    try {
      return jwt.sign(
        { id: userId },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );
    } catch (error) {
      console.error('Token generation error:', error);
      throw new Error('Failed to generate authentication token');
    }
  }
  
  /**
   * Remove sensitive data from user object
   * @param {Object} user - Mongoose user document
   * @returns {Object} - Safe user object
   */
  static getSafeUser(user) {
    try {
      return {
        id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      };
    } catch (error) {
      console.error('User data sanitization error:', error);
      throw new Error('Failed to process user data');
    }
  }
}

module.exports = AuthService;




// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const config = require('../config');

// /**
//  * Service for handling authentication operations
//  */
// class AuthService {
//   /**
//    * Register a new user
//    * @param {Object} userData - User data (email, password, name)
//    * @returns {Promise<Object>} - Created user and auth token
//    */
//   static async signup(userData) {
//     const { email, password, name } = userData;
    
//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       throw new Error('Email already in use');
//     }
    
//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
    
//     // Create user
//     const user = new User({
//       email,
//       password: hashedPassword,
//       name
//     });
    
//     await user.save();
    
//     // Generate JWT token
//     const token = this.generateToken(user._id);
    
//     return {
//       user: this.getSafeUser(user),
//       token
//     };
//   }
  
//   /**
//    * Authenticate user
//    * @param {String} email - User email
//    * @param {String} password - User password
//    * @returns {Promise<Object>} - User data and auth token
//    */
//   static async login(email, password) {
//     // Find user by email
//     const user = await User.findOne({ email });

//     console.log("user", user)
//     if (!user) {
//       throw new Error('Invalid credentials');
//     }
    
//   // Debug: Print stored hash and input password
//   console.log('Stored hash:', user.password);
//   console.log('Input password:', password);
  

//     // Check password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       throw new Error('Invalid credentials');
//     }
    
//     // Generate JWT token
//     const token = this.generateToken(user._id);
    
//     return {
//       user: this.getSafeUser(user),
//       token
//     };
//   }
  
//   /**
//    * Get user by ID (without sensitive data)
//    * @param {String} userId - User ID
//    * @returns {Promise<Object>} - User data
//    */
//   static async getUserById(userId) {
//     const user = await User.findById(userId);
//     if (!user) {
//       throw new Error('User not found');
//     }
    
//     return this.getSafeUser(user);
//   }
  
//   /**
//    * Generate JWT token
//    * @param {String} userId - User ID
//    * @returns {String} - JWT token
//    */
//   static generateToken(userId) {
//     return jwt.sign(
//       { id: userId },
//       config.jwt.secret,
//       { expiresIn: config.jwt.expiresIn }
//     );
//   }
  
//   /**
//    * Remove sensitive data from user object
//    * @param {Object} user - Mongoose user document
//    * @returns {Object} - Safe user object
//    */
//   static getSafeUser(user) {
//     return {
//       id: user._id,
//       email: user.email,
//       name: user.name,
//       createdAt: user.createdAt
//     };
//   }
// }

// module.exports = AuthService;