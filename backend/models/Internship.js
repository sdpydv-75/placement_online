const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Internship name is required'],
    trim: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  icon: {
    type: String,
    default: '💼'
  },
  color: {
    type: String,
    default: '#3b82f6'
  },
  isNew: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { suppressReservedKeysWarning: true });

module.exports = mongoose.model('Internship', internshipSchema);
