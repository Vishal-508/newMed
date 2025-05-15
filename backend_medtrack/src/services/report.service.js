const DoseLog = require('../models/DoseLog');
const Medication = require('../models/Medication');
const { generatePDFReport } = require('../utils/pdfGenerator');

/**
 * Service for generating reports and analytics
 */
class ReportService {
  /**
   * Get medication adherence statistics
   * @param {String} userId - User ID
   * @param {Number} days - Number of days to analyze
   * @returns {Promise<Object>} - Adherence statistics
   */
  static async getAdherenceStats(userId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Get all logs in date range
    const logs = await DoseLog.find({
      userId,
      scheduledTime: { $gte: startDate }
    }).populate('medicationId', 'name');
    
    // Calculate basic stats
    const totalDoses = logs.length;
    const takenDoses = logs.filter(log => log.status === 'taken').length;
    const lateDoses = logs.filter(log => log.status === 'late').length;
    const missedDoses = logs.filter(log => log.status === 'missed').length;
    
    const adherenceRate = totalDoses > 0 
      ? ((takenDoses + lateDoses) / totalDoses) * 100 
      : 0;
    
    // Get most commonly missed medications
    const missedMedications = await DoseLog.aggregate([
      { 
        $match: { 
          userId: mongoose.Types.ObjectId(userId),
          status: 'missed',
          scheduledTime: { $gte: startDate }
        } 
      },
      { $group: { _id: '$medicationId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    // Get medication details for the top missed
    const meds = await Medication.find({
      _id: { $in: missedMedications.map(m => m._id) }
    });
    
    const mostMissed = missedMedications.map(m => {
      const med = meds.find(med => med._id.equals(m._id));
      return {
        medicationId: m._id,
        name: med ? med.name : 'Unknown',
        count: m.count
      };
    });
    
    // Calculate weekly adherence
    const weeklyStats = await this.calculateWeeklyAdherence(userId, startDate);
    
    return {
      adherenceRate: parseFloat(adherenceRate.toFixed(1)),
      totalDoses,
      takenDoses,
      lateDoses,
      missedDoses,
      mostMissed,
      weeklyStats
    };
  }
  
  /**
   * Calculate weekly adherence rates
   * @param {String} userId - User ID
   * @param {Date} startDate - Start date for analysis
   * @returns {Promise<Array>} - Weekly adherence data
   */
  static async calculateWeeklyAdherence(userId, startDate) {
    const weeklyStats = [];
    const now = new Date();
    
    // Group by week
    let currentWeekStart = new Date(startDate);
    
    while (currentWeekStart < now) {
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      
      const weekLogs = await DoseLog.find({
        userId,
        scheduledTime: {
          $gte: currentWeekStart,
          $lt: weekEnd
        }
      });
      
      const weekTotal = weekLogs.length;
      const weekTaken = weekLogs.filter(log => ['taken', 'late'].includes(log.status)).length;
      const weekRate = weekTotal > 0 ? (weekTaken / weekTotal) * 100 : 0;
      
      weeklyStats.push({
        weekStart: currentWeekStart.toISOString().split('T')[0],
        adherenceRate: parseFloat(weekRate.toFixed(1)),
        totalDoses: weekTotal,
        takenDoses: weekTaken
      });
      
      currentWeekStart = weekEnd;
    }
    
    return weeklyStats;
  }
  
  /**
   * Export dose logs in specified format
   * @param {String} userId - User ID
   * @param {String} format - Export format (csv/pdf)
   * @param {Date} from - Start date
   * @param {Date} to - End date
   * @returns {Promise<Buffer|String>} - Exported data
   */
  static async exportLogs(userId, format, from, to) {
    const query = { userId };
    
    if (from && to) {
      query.scheduledTime = {
        $gte: new Date(from),
        $lte: new Date(to)
      };
    }
    
    const logs = await DoseLog.find(query)
      .populate('medicationId', 'name dose')
      .sort({ scheduledTime: 1 });
    
    if (format === 'pdf') {
      return generatePDFReport(logs, from, to);
    } else {
      // Default to CSV
      let csv = 'Date,Time,Medication,Dose,Status,Notes\n';
      
      logs.forEach(log => {
        const date = log.scheduledTime.toISOString().split('T')[0];
        const time = log.scheduledTime.toTimeString().split(' ')[0];
        
        csv += `"${date}","${time}","${log.medicationId.name}","${log.medicationId.dose}","${log.status}","${log.notes || ''}"\n`;
      });
      
      return csv;
    }
  }
}

module.exports = ReportService;