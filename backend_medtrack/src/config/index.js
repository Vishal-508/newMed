require('dotenv').config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);
module.exports = {
  // JWT configuration

  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-strong-secret-key-here',
    expiresIn: '30d' // Token expiration (30 days)
  },
  
  // Updated Database configuration for Mongoose 6+
  db: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/medtrack',
    options: {
      // Only these options are needed for Mongoose 6+
      useNewUrlParser: true,
      useUnifiedTopology: true
      
      // Removed deprecated options:
      // useCreateIndex: true,    // No longer needed in Mongoose 6+
      // useFindAndModify: false // No longer needed in Mongoose 6+
    }
  },
  
  // Google API configuration (for calendar integration)
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:4009/auth/google/callback',
    calendar: {
      scopes: ['https://www.googleapis.com/auth/calendar.events']
    }
  },
  
  // Application settings
  app: {
    port: process.env.PORT || 5000,
    lateDoseThreshold: 4 // Hours after which dose can't be logged
  }
};