const express = require('express');
const router = express.Router();
const { getContent, createContent, updateContent, deleteContent } = require('../controllers/contentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route to fetch data purely for frontend display
router.get('/:type', getContent);

// Protected routes for Admin manipulation
router.post('/:type', protect, authorize('admin', 'recruiter'), createContent);
router.put('/:type/:id', protect, authorize('admin', 'recruiter'), updateContent);
router.delete('/:type/:id', protect, authorize('admin', 'recruiter'), deleteContent);

module.exports = router;
