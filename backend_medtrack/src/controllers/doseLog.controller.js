const DoseLogService = require('../services/doseLog.service');
const mongoose = require('mongoose');
/**
 * Handle dose logging requests
 */
exports.logDose = async (req, res, next) => {
    try {
        const { medicationId, scheduledTime, notes } = req.body;
        const _id = new mongoose.Types.ObjectId().toString();
        
        console.log("Request data:", {
            userId: req.user.id,
            medicationId,
            scheduledTime,
            notes
        });

        const doseLog = await DoseLogService.logDose(
            req.user.id,
            medicationId, 
            scheduledTime, 
            notes || '',
            _id
        );
        
        res.status(201).json({
            success: true,
            data: doseLog
        });
    } catch (err) {
        console.error('Controller error:', err);
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

exports.getLogs = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    
    const logs = await DoseLogService.getDoseLogs(
      req.user.id,
      from,
      to
    );
    
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

exports.updateLog = async (req, res, next) => {
  try {
    const { notes } = req.body;
    
    const log = await DoseLogService.updateDoseLog(
      req.user.id,
      req.params.id,
      { notes }
    );
    
    res.json(log);
  } catch (err) {
    next(err);
  }
};












// const DoseLog = require('../models/DoseLog');
// const Medication = require('../models/Medication');

// exports.logDose = async (req, res, next) => {
//   try {
//     const { medicationId, scheduledTime, notes } = req.body;
    
//     // Verify medication belongs to user
//     const medication = await Medication.findOne({
//       _id: medicationId,
//       userId: req.user._id
//     });
    
//     if (!medication) {
//       return res.status(404).json({ message: 'Medication not found' });
//     }
    
//     const now = new Date();
//     const scheduledDate = new Date(scheduledTime);
//     const hoursLate = (now - scheduledDate) / (1000 * 60 * 60);
    
//     let status = 'taken';
//     if (hoursLate > 4) {
//       return res.status(400).json({ message: 'Cannot log dose more than 4 hours late' });
//     } else if (hoursLate > 0) {
//       status = 'late';
//     }
    
//     const doseLog = new DoseLog({
//       userId: req.user._id,
//       medicationId,
//       scheduledTime: scheduledDate,
//       takenTime: now,
//       status,
//       notes
//     });
    
//     await doseLog.save();
    
//     res.status(201).json(doseLog);
//   } catch (err) {
//     next(err);
//   }
// };

// exports.getLogs = async (req, res, next) => {
//   try {
//     const { from, to } = req.query;
    
//     const query = { userId: req.user._id };
    
//     if (from && to) {
//       query.scheduledTime = {
//         $gte: new Date(from),
//         $lte: new Date(to)
//       };
//     }
    
//     const logs = await DoseLog.find(query)
//       .populate('medicationId', 'name dose');
    
//     res.json(logs);
//   } catch (err) {
//     next(err);
//   }
// };

// exports.updateLog = async (req, res, next) => {
//   try {
//     const { notes } = req.body;
    
//     const log = await DoseLog.findOneAndUpdate(
//       { _id: req.params.id, userId: req.user._id },
//       { notes },
//       { new: true }
//     );
    
//     if (!log) {
//       return res.status(404).json({ message: 'Log not found' });
//     }
    
//     res.json(log);
//   } catch (err) {
//     next(err);
//   }
// };