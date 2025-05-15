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
    type: Date,
    required: true
  },
  takenTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['taken', 'missed', 'late'],
    default: 'missed'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
DoseLogSchema.index({ userId: 1, scheduledTime: 1 });

module.exports = mongoose.model('DoseLog', DoseLogSchema);