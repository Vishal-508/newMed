const ReminderSettings = require('../models/ReminderSettings');
const { google } = require('googleapis');
const config = require('../config');

/**
 * Service for managing medication reminders
 */
class ReminderService {
  /**
   * Get user's reminder settings
   * @param {String} userId - User ID
   * @returns {Promise<Object>} - Reminder settings
   */
  static async getReminderSettings(userId) {
    let settings = await ReminderSettings.findOne({ userId });
    
    if (!settings) {
      // Create default settings if none exist
      settings = new ReminderSettings({ userId });
      await settings.save();
    }
    
    return settings;
  }
  
  /**
   * Update reminder settings
   * @param {String} userId - User ID
   * @param {Object} updates - Settings to update
   * @returns {Promise<Object>} - Updated settings
   */
  static async updateReminderSettings(userId, updates) {
    const settings = await ReminderSettings.findOneAndUpdate(
      { userId },
      updates,
      { new: true, upsert: true }
    );
    
    return settings;
  }
  
  /**
   * Initialize Google Calendar integration
   * @param {String} userId - User ID
   * @param {String} authCode - OAuth2 authorization code
   * @returns {Promise<Object>} - Calendar integration status
   */
  static async setupGoogleCalendar(userId, authCode,_id) {
    const oauth2Client = new google.auth.OAuth2(
      config.google.clientId,
      config.google.clientSecret,
      config.google.redirectUri
    );
    
    try {
      // Exchange auth code for tokens
      const { tokens } = await oauth2Client.getToken(authCode);
      oauth2Client.setCredentials(tokens);
      
      // Save calendar ID to settings
      const settings = await this.updateReminderSettings(userId,_id, {
        enableCalendar: true,
        calendarId: 'primary' // Using primary calendar
      });
      
      return {
        success: true,
        settings
      };
    } catch (err) {
      console.error('Google Calendar setup error:', err);
      throw new Error('Failed to setup Google Calendar integration');
    }
  }
  
  /**
   * Get upcoming doses that need reminders
   * @param {String} userId - User ID
   * @returns {Promise<Array>} - List of doses needing reminders
   */
  static async getUpcomingDosesForReminders(userId) {
    const settings = await this.getReminderSettings(userId);
    if (!settings.enableInApp && !settings.enableCalendar) {
      return [];
    }
    
    const now = new Date();
    const reminderWindow = new Date(now.getTime() + (settings.advanceNotice * 60 * 1000));
    
    // Find doses scheduled within the reminder window that haven't been taken yet
    return DoseLog.find({
      userId,
      scheduledTime: {
        $gte: now,
        $lte: reminderWindow
      },
      status: 'missed' // Only remind about not-yet-taken doses
    }).populate('medicationId', 'name dose');
  }
}

module.exports = ReminderService;