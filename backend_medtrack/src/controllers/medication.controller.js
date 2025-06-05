const MedicationService = require('../services/medication.service');
const mongoose = require('mongoose');
/**
 * Handle medication-related requests
 */
exports.getAllMedications = async (req, res, next) => {
  try {
    const medications = await MedicationService.getUserMedications(req.user.id);
    res.json(medications);
  } catch (err) {
    next(err);
  }
};

exports.createMedication = async (req, res, next) => {
  try {
    const _id = new mongoose.Types.ObjectId().toString(); 
    const medication = await MedicationService.createMedication(
      req.user.id,
      req.body,
      _id
    );
    res.status(201).json(medication);
  } catch (err) {
    next(err);
  }
};

exports.getMedication = async (req, res, next) => {
  try {

    console.log("params.id",req.params.id,"userid",req.user.id)
    const medication = await MedicationService.getMedication(
      req.user.id,
      req.params.id
    );
    res.json(medication);
  } catch (err) {
    next(err);
  }
};

exports.updateMedication = async (req, res, next) => {
  try {
    const medication = await MedicationService.updateMedication(
      req.user.id,
      req.params.id,
      req.body
    );
    res.json(medication);
  } catch (err) {
    next(err);
  }
};

exports.deleteMedication = async (req, res, next) => {
  try {
    const result = await MedicationService.deleteMedication(
      req.user.id,
      req.params.id
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};









// const Medication = require('../models/Medication');
// const DoseLog = require('../models/DoseLog');

// exports.getAllMedications = async (req, res, next) => {
//   try {
//     const medications = await Medication.find({ userId: req.user._id });
//     res.json(medications);
//   } catch (err) {
//     next(err);
//   }
// };

// exports.createMedication = async (req, res, next) => {
//   try {
//     const { name, dose, frequency, schedule, startDate, endDate, category, notes } = req.body;
    
//     const medication = new Medication({
//       userId: req.user._id,
//       name,
//       dose,
//       frequency,
//       schedule,
//       startDate,
//       endDate,
//       category,
//       notes
//     });
    
//     await medication.save();
    
//     // TODO: Schedule future dose logs
    
//     res.status(201).json(medication);
//   } catch (err) {
//     next(err);
//   }
// };

// exports.getMedication = async (req, res, next) => {
//   try {
//     const medication = await Medication.findOne({
//       _id: req.params.id,
//       userId: req.user._id
//     });
    
//     if (!medication) {
//       return res.status(404).json({ message: 'Medication not found' });
//     }
    
//     res.json(medication);
//   } catch (err) {
//     next(err);
//   }
// };

// exports.updateMedication = async (req, res, next) => {
//   try {
//     const medication = await Medication.findOneAndUpdate(
//       { _id: req.params.id, userId: req.user._id },
//       req.body,
//       { new: true }
//     );
    
//     if (!medication) {
//       return res.status(404).json({ message: 'Medication not found' });
//     }
    
//     res.json(medication);
//   } catch (err) {
//     next(err);
//   }
// };

// exports.deleteMedication = async (req, res, next) => {
//   try {
//     const medication = await Medication.findOneAndDelete({
//       _id: req.params.id,
//       userId: req.user._id
//     });
    
//     if (!medication) {
//       return res.status(404).json({ message: 'Medication not found' });
//     }
    
//     // Also delete related dose logs
//     await DoseLog.deleteMany({
//       medicationId: req.params.id,
//       userId: req.user._id
//     });
    
//     res.json({ message: 'Medication deleted' });
//   } catch (err) {
//     next(err);
//   }
// };