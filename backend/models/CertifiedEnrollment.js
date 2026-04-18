const mongoose = require('mongoose');

const certifiedEnrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseName: {
    type: String,
    required: true,
    default: 'General'
  },
  duration: {
    type: String,
    enum: ['4 Weeks', '8 Weeks'],
    default: '4 Weeks'
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Completed'],
    default: 'Pending'
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CertifiedEnrollment', certifiedEnrollmentSchema);
