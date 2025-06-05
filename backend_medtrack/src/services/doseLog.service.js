const DoseLog = require('../models/DoseLog');
const Medication = require('../models/Medication');
const moment = require('moment-timezone');

class DoseLogService {

  static async logDose(userId, medicationId, scheduledTime, notes = '', _id) {
  try {
    // Validate time format
    if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(scheduledTime)) {
      throw new Error('Invalid time format. Use HH:mm');
    }

    // Get medication details
    const medication = await Medication.findOne({ _id: medicationId, userId });
    if (!medication) throw new Error('Medication not found');
    
    // Validate scheduledTime is part of medication's schedule
    if (!medication.scheduledTime.includes(scheduledTime)) {
      throw new Error('Invalid scheduled time for this medication');
    }
    
    // Calculate status based on current time
    const now = new Date();
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    const scheduledDateTime = new Date();
    scheduledDateTime.setHours(hours, minutes, 0, 0);
    
    const timeDiffMinutes = (now - scheduledDateTime) / (1000 * 60);
    let status = 'taken';
    
    if (timeDiffMinutes > 240) { // 4 hours
      status = 'missed';
    } else if (timeDiffMinutes > 15) { // 15 minutes grace period
      status = 'late';
    }
    
    // Create or update the log
    const doseLog = new DoseLog({
      _id: _id || new mongoose.Types.ObjectId().toString(),
      userId,
      medicationId,
      scheduledTime, // Store as string
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
  //   try {
  //     // Validate input
  //     if (!scheduledTime) throw new Error('scheduledTime is required');
      
  //     // Get medication details
  //     const medication = await Medication.findOne({ _id: medicationId, userId });
  //     if (!medication) throw new Error('Medication not found');
      
  //     // Validate scheduledTime is part of medication's schedule
  //     if (!medication.scheduledTime.includes(scheduledTime)) {
  //       throw new Error('Invalid scheduled time for this medication');
  //     }
      
  //     // Calculate status based on current time
  //     const now = new Date();
  //     const scheduledDateTime = new Date(
  //       `${moment().format('YYYY-MM-DD')}T${scheduledTime}:00`
  //     );
      
  //     const timeDiffMinutes = (now - scheduledDateTime) / (1000 * 60);
  //     let status = 'taken';
      
  //     if (timeDiffMinutes > 240) { // 4 hours
  //       status = 'missed';
  //     } else if (timeDiffMinutes > 15) { // 15 minutes grace period
  //       status = 'late';
  //     }
      
  //     // Create or update the log
  //     const doseLog = await DoseLog.findOneAndUpdate(
  //       { userId, medicationId, scheduledTime },
  //       {
  //         takenTime: now,
  //         status,
  //         notes
  //       },
  //       { new: true, upsert: true }
  //     );
      
  //     return doseLog;
  //   } catch (error) {
  //     console.error('Error in logDose:', error);
  //     throw error;
  //   }
  // }

  static async getDoseLogs(userId, from, to) {
    const query = { userId };
    
    if (from && to) {
      query.$and = [
        { takenTime: { $gte: from } },
        { takenTime: { $lte: to } }
      ];
    }
    
    return DoseLog.find(query)
      .populate('medicationId', 'name dose category')
      .sort({ scheduledTime: -1 });
  }

  static async getAdherenceStats(userId) {
    const stats = await DoseLog.aggregate([
      { $match: { userId } },
      { $group: {
        _id: '$status',
        count: { $sum: 1 }
      }},
      { $project: {
        status: '$_id',
        count: 1,
        _id: 0
      }}
    ]);
    
    const totalLogs = stats.reduce((sum, stat) => sum + stat.count, 0);
    const takenCount = stats.find(s => s.status === 'taken')?.count || 0;
    const adherenceRate = totalLogs > 0 ? (takenCount / totalLogs) * 100 : 0;
    
    return {
      stats,
      adherenceRate: Math.round(adherenceRate * 100) / 100
    };
  }

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


  static async getMedicationLogs(userId, medicationId) {
  return DoseLog.find({ userId, medicationId })
    .sort({ takenTime: -1 })
    .populate('medicationId', 'name dose');
}
}



module.exports = DoseLogService;







// const DoseLog = require('../models/DoseLog');
// const Medication = require('../models/Medication');
// const config = require('../config');
// const { v4: uuidv4 } = require('uuid');
// /**
//  * Service for dose logging operations
//  */
// class DoseLogService {


//   static async logDose(userId, medicationId, scheduledTime, notes = '', _id) {
//     try {
//         if (!scheduledTime) {
//             throw new Error('scheduledTime is required');
//         }

//         const parsedScheduledTime = new Date(scheduledTime);
//         if (isNaN(parsedScheduledTime.getTime())) {
//             throw new Error('Invalid scheduledTime format');
//         }

//         const now = new Date();
//         const timeDiff = (now - parsedScheduledTime) / (1000 * 60 * 60); // in hours

//         let status = 'taken';
//         if (timeDiff > 4) {
//             status = 'missed'; // 👈 allow but mark as missed
//         } else if (timeDiff > 0) {
//             status = 'late';
//         }

//         const doseLog = new DoseLog({
//             _id: _id || new mongoose.Types.ObjectId().toString(),
//             userId,
//             medicationId,
//             scheduledTime: parsedScheduledTime,
//             takenTime: now,
//             status,
//             notes
//         });

//         return await doseLog.save();
//     } catch (error) {
//         console.error('Error in logDose:', error);
//         throw error;
//     }
// }


//   static async getDoseLogs(userId, from, to) {
//     const query = { userId };
    
//     if (from && to) {
//       query.scheduledTime = {
//         $gte: new Date(from),
//         $lte: new Date(to)
//       };
//     }
    
//     return DoseLog.find(query)
//       .populate('medicationId', 'name dose category')
//       .sort({ scheduledTime: -1 });
//   }
  

//   static async updateDoseLog(userId, logId, updates) {
//     const doseLog = await DoseLog.findOneAndUpdate(
//       { _id: logId, userId },
//       updates,
//       { new: true }
//     );
    
//     if (!doseLog) {
//       throw new Error('Dose log not found');
//     }
    
//     return doseLog;
//   }
// }

// module.exports = DoseLogService;



  /**
   * Log a medication dose
   * @param {String} userId - User ID
   * @param {String} medicationId - Medication ID
   * @param {Date} scheduledTime - When the dose was scheduled
   * @param {String} notes - Optional notes
   * @returns {Promise<Object>} - Created dose log
   */

  /**
   * Get dose logs for a user within a date range
   * @param {String} userId - User ID
   * @param {Date} from - Start date
   * @param {Date} to - End date
   * @returns {Promise<Array>} - List of dose logs
   */


  /**
   * Update a dose log (primarily for notes)
   * @param {String} userId - User ID
   * @param {String} logId - Dose log ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} - Updated dose log
   */

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

