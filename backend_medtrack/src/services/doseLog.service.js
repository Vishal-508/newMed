const DoseLog = require('../models/DoseLog');
const Medication = require('../models/Medication');
const config = require('../config');
const { v4: uuidv4 } = require('uuid');
/**
 * Service for dose logging operations
 */
class DoseLogService {
  /**
   * Log a medication dose
   * @param {String} userId - User ID
   * @param {String} medicationId - Medication ID
   * @param {Date} scheduledTime - When the dose was scheduled
   * @param {String} notes - Optional notes
   * @returns {Promise<Object>} - Created dose log
   */

  static async logDose(userId, medicationId, scheduledTime, notes = '', _id) {
    try {
        if (!scheduledTime) {
            throw new Error('scheduledTime is required');
        }

        const parsedScheduledTime = new Date(scheduledTime);
        if (isNaN(parsedScheduledTime.getTime())) {
            throw new Error('Invalid scheduledTime format');
        }

        const now = new Date();
        const timeDiff = (now - parsedScheduledTime) / (1000 * 60 * 60); // in hours

        let status = 'taken';
        if (timeDiff > 4) {
            status = 'missed'; // 👈 allow but mark as missed
        } else if (timeDiff > 0) {
            status = 'late';
        }

        const doseLog = new DoseLog({
            _id: _id || new mongoose.Types.ObjectId().toString(),
            userId,
            medicationId,
            scheduledTime: parsedScheduledTime,
            takenTime: now,
            status,
            notes
        });

        return await doseLog.save();
    } catch (error) {
        console.error('Error in logDose:', error);
        throw error;
    }
}
// static async logDose(userId, medicationId, scheduledTime, notes = '', _id) {
//     try {
//         // Validate required fields
//         if (!scheduledTime) {
//             throw new Error('scheduledTime is required');
//         }

//         // Parse and validate date
//         const parsedScheduledTime = new Date(scheduledTime);
//         if (isNaN(parsedScheduledTime.getTime())) {
//             throw new Error('Invalid scheduledTime format');
//         }

//         // Check time difference
//         const now = new Date();
//         const timeDiff = (now - parsedScheduledTime) / (1000 * 60 * 60); // in hours
//         if (timeDiff > 4) {
//             throw new Error('Cannot log dose more than 4 hours late');
//         }

//         // Create and save dose log
//         const doseLog = new DoseLog({
//             _id: _id || new mongoose.Types.ObjectId().toString(),
//             userId,
//             medicationId,
//             scheduledTime: parsedScheduledTime,
//             takenTime: now,
//             status: timeDiff > 0 ? 'late' : 'taken',
//             notes
//         });

//         return await doseLog.save();
//     } catch (error) {
//         console.error('Error in logDose:', error);
//         throw error;
//     }
// }


  /**
   * Get dose logs for a user within a date range
   * @param {String} userId - User ID
   * @param {Date} from - Start date
   * @param {Date} to - End date
   * @returns {Promise<Array>} - List of dose logs
   */
  static async getDoseLogs(userId, from, to) {
    const query = { userId };
    
    if (from && to) {
      query.scheduledTime = {
        $gte: new Date(from),
        $lte: new Date(to)
      };
    }
    
    return DoseLog.find(query)
      .populate('medicationId', 'name dose category')
      .sort({ scheduledTime: -1 });
  }
  
  /**
   * Update a dose log (primarily for notes)
   * @param {String} userId - User ID
   * @param {String} logId - Dose log ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} - Updated dose log
   */
  static async updateDoseLog(userId, logId, updates) {
    const doseLog = await DoseLog.findOneAndUpdate(
      { _id: logId, userId },
      updates,
      { new: true }
    );
    
    if (!doseLog) {
      throw new Error('Dose log not found');
    }
    
    return doseLog;
  }
}

module.exports = DoseLogService;