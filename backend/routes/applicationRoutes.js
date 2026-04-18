const express = require('express');
const {
  applyToJob,
  getAppliedJobs,
  getJobApplicants,
  updateApplicationStatus
} = require('../controllers/applicationController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Student routes
router.post('/jobs/:jobId', protect, authorize('student'), applyToJob);
router.get('/me', protect, authorize('student'), getAppliedJobs);

// Recruiter routes
router.get('/jobs/:jobId', protect, authorize('recruiter', 'admin'), getJobApplicants);
router.put('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);

module.exports = router;
