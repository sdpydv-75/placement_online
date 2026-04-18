const mongoose = require('mongoose');

const CompanyReviewSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true
  },
  rating: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  review: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('CompanyReview', CompanyReviewSchema);
