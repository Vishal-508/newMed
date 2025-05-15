const ReminderService = require('../services/reminder.service');
const mongoose = require('mongoose');
/**
 * Handle reminder-related requests
 */
exports.getSettings = async (req, res, next) => {
  try {
    const settings = await ReminderService.getReminderSettings(req.user.id);
    res.json(settings);
  } catch (err) {
    next(err);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    const settings = await ReminderService.updateReminderSettings(
      req.user.id,
      req.body
    );
    res.json(settings);
  } catch (err) {
    next(err);
  }
};

exports.setupCalendar = async (req, res, next) => {
  try {
    const { code } = req.body;
       const _id = new mongoose.Types.ObjectId().toString(); 
    const result = await ReminderService.setupGoogleCalendar(
      req.user.id,
      code,
      _id
    );
    
    res.json(result);
  } catch (err) {
    next(err);
  }
};









// const ReminderSettings = require('../models/ReminderSettings');
// const { google } = require('googleapis');

// exports.getSettings = async (req, res, next) => {
//   try {
//     let settings = await ReminderSettings.findOne({ userId: req.user._id });
    
//     if (!settings) {
//       // Create default settings if none exist
//       settings = new ReminderSettings({ userId: req.user._id });
//       await settings.save();
//     }
    
//     res.json(settings);
//   } catch (err) {
//     next(err);
//   }
// };

// exports.updateSettings = async (req, res, next) => {
//   try {
//     const settings = await ReminderSettings.findOneAndUpdate(
//       { userId: req.user._id },
//       req.body,
//       { new: true, upsert: true }
//     );
    
//     res.json(settings);
//   } catch (err) {
//     next(err);
//   }
// };

// exports.setupCalendar = async (req, res, next) => {
//   try {
//     // TODO: Implement Google Calendar OAuth flow
//     // This is a placeholder for the actual implementation
    
//     const { code } = req.body;
    
//     // Exchange code for tokens
//     // Create calendar events for upcoming doses
//     // Save calendar ID to settings
    
//     res.json({ message: 'Calendar integration setup successfully' });
//   } catch (err) {
//     next(err);
//   }
// };