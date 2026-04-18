const mongoose = require('mongoose');

const SuccessStorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  package: {
    type: String,
    required: true
  },
  img: {
    type: String,
    default: '🎓'
  }
}, { timestamps: true });

module.exports = mongoose.model('SuccessStory', SuccessStorySchema);
