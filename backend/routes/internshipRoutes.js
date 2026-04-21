const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Get all internships (public)
// @route   GET /api/v1/internships
// @access  Public
router.get('/', async (req, res) => {
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
