const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skills: {
    type: [String],
    default: []
  },
  education: [
    {
      school: { type: String, required: true },
      degree: { type: String, required: true },
      fieldOfStudy: { type: String },
      from: { type: Date, required: true },
      to: { type: Date },
      current: { type: Boolean, default: false }
    }
  ],
  resume: {
    type: String
  },
  github: {
    type: String
  },
  linkedin: {
    type: String
  },
  projects: {
    type: String
  },
  certifications: {
    type: String
  },
  profilePhoto: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
