const express = require('express');
const router = express.Router();
const CertifiedEnrollment = require('../models/CertifiedEnrollment');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Enroll in Certified Internship
// @route   POST /api/v1/certified/enroll
// @access  Private
router.post('/enroll', protect, async (req, res) => {
  try {
    const { courseName, duration } = req.body;
    
    if (!courseName) {
      return res.status(400).json({ error: 'Course name is required.' });
    }

    // Check if user is already enrolled in *this specific course*
    const existing = await CertifiedEnrollment.findOne({ user: req.user.id, courseName });
    if (existing) {
      return res.status(400).json({ error: 'You have already enrolled in this internship program.' });
    }

    const enrollment = await CertifiedEnrollment.create({
      user: req.user.id,
      courseName,
      duration: duration || '4 Weeks',
    });

    res.status(201).json({ success: true, data: enrollment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @desc    Get all active certified enrollments
// @route   GET /api/v1/certified
// @access  Private/Admin
router.get('/', protect, authorize('admin', 'recruiter'), async (req, res) => {
  try {
    const enrollments = await CertifiedEnrollment.find()
      .populate('user', 'name email role')
      .sort('-enrolledAt');
    res.json({ success: true, data: enrollments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @desc    Update enrollment status
// @route   PUT /api/v1/certified/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, authorize('admin', 'recruiter'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Approved', 'Completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const enrollment = await CertifiedEnrollment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    res.json({ success: true, data: enrollment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @desc    Get current user's enrollments (all of them)
// @route   GET /api/v1/certified/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const enrollments = await CertifiedEnrollment.find({ user: req.user.id });
    res.json({ success: true, data: enrollments });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
