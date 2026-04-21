const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');
const { protect, authorize, checkApproved } = require('../middleware/authMiddleware');

// @desc    Get all internships (public)
// @route   GET /api/v1/internships
// @access  Public (Guest) / Private (Approved Students)
router.get('/', async (req, res) => {
  // If user is authenticated as student, check approval
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      const jwt = require('jsonwebtoken');
      const User = require('../models/User');
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user && user.role === 'student' && !user.isApproved) {
        return res.status(403).json({ success: false, error: 'Your account is pending admin approval.' });
      }
    } catch (err) {
      // Ignore token errors for public view, but we've checked the important part
    }
  }
  try {
    const internships = await Internship.find().sort('-createdAt');
    res.json({ success: true, data: internships });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @desc    Add new internship
// @route   POST /api/v1/internships
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, level, icon, color, isNew, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Internship name is required' });
    }
    const internship = await Internship.create({ name, level, icon, color, isNew, description });
    res.status(201).json({ success: true, data: internship });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @desc    Delete an internship
// @route   DELETE /api/v1/internships/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const internship = await Internship.findByIdAndDelete(req.params.id);
    if (!internship) {
      return res.status(404).json({ error: 'Internship not found' });
    }
    res.json({ success: true, message: 'Internship deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @desc    Update an internship
// @route   PUT /api/v1/internships/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const internship = await Internship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!internship) {
      return res.status(404).json({ error: 'Internship not found' });
    }
    res.json({ success: true, data: internship });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
