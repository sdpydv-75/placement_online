const PlacementDrive = require('../models/PlacementDrive');
const CompanyReview = require('../models/CompanyReview');
const SuccessStory = require('../models/SuccessStory');

// Universal helper logic to simplify CRUD controllers
const getModel = (type) => {
  if (type === 'placements') return PlacementDrive;
  if (type === 'reviews') return CompanyReview;
  if (type === 'stories') return SuccessStory;
  return null;
};

// @desc    Get content based on type (placements, reviews, stories)
// @route   GET /api/v1/content/:type
// @access  Public
exports.getContent = async (req, res) => {
  const Model = getModel(req.params.type);
  if (!Model) return res.status(400).json({ success: false, error: 'Invalid content type' });
  
  try {
    const data = await Model.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create new content based on type
// @route   POST /api/v1/content/:type
// @access  Private (Admin)
exports.createContent = async (req, res) => {
  const Model = getModel(req.params.type);
  if (!Model) return res.status(400).json({ success: false, error: 'Invalid content type' });

  try {
    const newDoc = await Model.create(req.body);
    res.status(201).json({ success: true, data: newDoc });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update content by ID
// @route   PUT /api/v1/content/:type/:id
// @access  Private (Admin)
exports.updateContent = async (req, res) => {
  const Model = getModel(req.params.type);
  if (!Model) return res.status(400).json({ success: false, error: 'Invalid content type' });

  try {
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedDoc) return res.status(404).json({ success: false, error: 'Document not found' });
    
    res.status(200).json({ success: true, data: updatedDoc });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete content by ID
// @route   DELETE /api/v1/content/:type/:id
// @access  Private (Admin)
exports.deleteContent = async (req, res) => {
  const Model = getModel(req.params.type);
  if (!Model) return res.status(400).json({ success: false, error: 'Invalid content type' });

  try {
    const deletedDoc = await Model.findByIdAndDelete(req.params.id);
    if (!deletedDoc) return res.status(404).json({ success: false, error: 'Document not found' });
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
