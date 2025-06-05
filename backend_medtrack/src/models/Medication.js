const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
     _id: { type: String }, 
  userId: {
    type:String,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  dose: {
    type: String,
    required: true,
    trim: true
  },
  frequency: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  scheduledTime: {
    type: [String], // Array of times like ["08:00", "14:00", "20:00"]
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  category: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Medication', MedicationSchema);