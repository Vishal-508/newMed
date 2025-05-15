const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');

// Initialize Express
const app = express();

// Database connection
mongoose.connect(config.db.uri, config.db.options)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Route imports - VERIFY THESE PATHS ARE CORRECT
const authRoutes = require('./routes/auth.routes');
const medicationRoutes = require('./routes/medication.routes');
const doseLogRoutes = require('./routes/doseLog.routes');
const reportRoutes = require('./routes/report.routes');
const reminderRoutes = require('./routes/reminder.routes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/logs', doseLogRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/reminders', reminderRoutes);

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;







// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const config = require('./config');
// const errorHandler = require('./middleware/error');

// // Import routes
// const authRoutes = require('./routes/auth.routes');
// const medicationRoutes = require('./routes/medication.routes');
// const doseLogRoutes = require('./routes/doseLog.routes');
// const reportRoutes = require('./routes/report.routes');
// const reminderRoutes = require('./routes/reminder.routes');

// const app = express();

// // Connect to MongoDB
// mongoose.connect(config.mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
//   useFindAndModify: false
// })
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error('MongoDB connection error:', err));

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/medications', medicationRoutes);
// app.use('/api/logs', doseLogRoutes);
// app.use('/api/reports', reportRoutes);
// app.use('/api/reminders', reminderRoutes);

// // Error handler
// app.use(errorHandler);

// module.exports = app;