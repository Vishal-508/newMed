const ReportService = require('../services/report.service');
const mongoose = require('mongoose');
/**
 * Handle report generation requests
 */
exports.getAdherenceStats = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    
    const stats = await ReportService.getAdherenceStats(
      req.user.id,
      parseInt(days)
    );
    
    res.json(stats);
  } catch (err) {
    next(err);
  }
};

exports.exportLogs = async (req, res, next) => {
  try {
    const { format = 'csv', from, to } = req.query;
    
    const result = await ReportService.exportLogs(
      req.user.id,
      format,
      from,
      to
    );
    
    if (format === 'csv') {
      res.header('Content-Type', 'text/csv');
      res.attachment('medication_logs.csv');
      res.send(result);
    } else if (format === 'pdf') {
      res.contentType('application/pdf');
      res.attachment('medication_report.pdf');
      res.send(result);
    } else {
      res.json(result);
    }
  } catch (err) {
    next(err);
  }
};








// const DoseLog = require('../models/DoseLog');
// const Medication = require('../models/Medication');

// exports.getAdherenceStats = async (req, res, next) => {
//   try {
//     const { days = 30 } = req.query;
    
//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - parseInt(days));
    
//     // Get all logs in date range
//     const logs = await DoseLog.find({
//       userId: req.user._id,
//       scheduledTime: { $gte: startDate }
//     });
    
//     // Calculate adherence stats
//     const totalDoses = logs.length;
//     const takenDoses = logs.filter(log => log.status === 'taken').length;
//     const lateDoses = logs.filter(log => log.status === 'late').length;
//     const missedDoses = logs.filter(log => log.status === 'missed').length;
    
//     const adherenceRate = totalDoses > 0 ? (takenDoses + lateDoses) / totalDoses * 100 : 0;
    
//     // Get most commonly missed medications
//     const missedMedications = await DoseLog.aggregate([
//       { 
//         $match: { 
//           userId: req.user._id, 
//           status: 'missed',
//           scheduledTime: { $gte: startDate }
//         } 
//       },
//       { $group: { _id: '$medicationId', count: { $sum: 1 } } },
//       { $sort: { count: -1 } },
//       { $limit: 5 }
//     ]);
    
//     // Populate medication names
//     const meds = await Medication.find({
//       _id: { $in: missedMedications.map(m => m._id) }
//     });
    
//     const missedMedsWithNames = missedMedications.map(m => {
//       const med = meds.find(med => med._id.equals(m._id));
//       return {
//         medicationId: m._id,
//         name: med ? med.name : 'Unknown',
//         count: m.count
//       };
//     });
    
//     res.json({
//       adherenceRate: parseFloat(adherenceRate.toFixed(1)),
//       totalDoses,
//       takenDoses,
//       lateDoses,
//       missedDoses,
//       mostMissed: missedMedsWithNames
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// exports.exportLogs = async (req, res, next) => {
//   try {
//     const { format = 'csv', from, to } = req.query;
    
//     const query = { userId: req.user._id };
    
//     if (from && to) {
//       query.scheduledTime = {
//         $gte: new Date(from),
//         $lte: new Date(to)
//       };
//     }
    
//     const logs = await DoseLog.find(query)
//       .populate('medicationId', 'name dose')
//       .sort({ scheduledTime: 1 });
    
//     if (format === 'csv') {
//       // Generate CSV
//       let csv = 'Date,Time,Medication,Dose,Status,Notes\n';
      
//       logs.forEach(log => {
//         const date = log.scheduledTime.toISOString().split('T')[0];
//         const time = log.scheduledTime.toTimeString().split(' ')[0];
        
//         csv += `"${date}","${time}","${log.medicationId.name}","${log.medicationId.dose}","${log.status}","${log.notes || ''}"\n`;
//       });
      
//       res.header('Content-Type', 'text/csv');
//       res.attachment('medication_logs.csv');
//       return res.send(csv);
//     } else {
//       // Default to JSON
//       res.json(logs);
//     }
//   } catch (err) {
//     next(err);
//   }
// };