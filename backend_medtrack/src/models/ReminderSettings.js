const mongoose = require('mongoose');

const ReminderSettingsSchema = new mongoose.Schema({
   _id: { type: String }, 
  userId: {
    type: String,
    ref: 'User',
    required: true,
    unique: true
  },
  enableInApp: {
    type: Boolean,
    default: true
  },
  enableCalendar: {
    type: Boolean,
    default: false
  },
  calendarId: {
    type: String
  },
  advanceNotice: {
    type: Number, // minutes before dose
    default: 15
  }
});

module.exports = mongoose.model('ReminderSettings', ReminderSettingsSchema);