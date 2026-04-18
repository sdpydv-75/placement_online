const mongoose = require('mongoose');

const PlacementDriveSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  roles: {
    type: String,
    required: true
  },
  ctc: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Open', 'Closed'],
    default: 'Upcoming'
  }
}, { timestamps: true });

module.exports = mongoose.model('PlacementDrive', PlacementDriveSchema);
