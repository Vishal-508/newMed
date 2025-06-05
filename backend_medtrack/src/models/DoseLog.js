const mongoose = require('mongoose');

const DoseLogSchema = new mongoose.Schema({
  _id: { type: String },
  userId: {
    type: String,
    ref: 'User',
    required: true
  },
  medicationId: {
    type: String,
    ref: 'Medication',
    required: true
  },
  scheduledTime: {
    type: String, // Changed to string to match medication's time format
    required: true
  },
  takenTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['taken', 'missed', 'late', 'scheduled'],
    default: 'scheduled'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for faster queries
DoseLogSchema.index({ userId: 1, medicationId: 1 });
DoseLogSchema.index({ userId: 1, status: 1 });
DoseLogSchema.index({ userId: 1, scheduledTime: 1 });

module.exports = mongoose.model('DoseLog', DoseLogSchema);



// const mongoose = require('mongoose');

// const DoseLogSchema = new mongoose.Schema({
//      _id: { type: String }, 
//   userId: {
//     type: String,
//     ref: 'User',
//     required: true
//   },
//   medicationId: {
//     type: String,
//     ref: 'Medication',
//     required: true
//   },
//   scheduledTime: {
//     type: [String],
//     required: true
//   },
//   takenTime: {
//     type: Date
//   },
//   status: {
//     type: String,
//     enum: ['taken', 'missed', 'late'],
//     default: 'missed'
//   },
//   notes: {
//     type: String,
//     trim: true
//   }
// }, {
//   timestamps: true
// });

// // Index for faster queries
// DoseLogSchema.index({ userId: 1, scheduledTime: 1 });

// module.exports = mongoose.model('DoseLog', DoseLogSchema);