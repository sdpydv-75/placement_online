const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  status: {
    type: String,
    enum: ['Reviewing', 'Shortlisted', 'Selected', 'Rejected'],
    default: 'Reviewing'
  },
  cgpa: {
    type: Number,
    required: [true, 'Please enter your current CGPA for placement filtering']
  },
  branch: {
    type: String,
    required: [true, 'Please declare your Course or Branch (e.g., B.Tech CSE)']
  },
  passingYear: {
    type: Number,
    required: [true, 'Please provide graduation year']
  },
  phone: {
    type: String,
    required: [true, 'Please enter contact number']
  }
}, {
  timestamps: true
});

// Prevent student from applying to the same job multiple times
applicationSchema.index({ student: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
