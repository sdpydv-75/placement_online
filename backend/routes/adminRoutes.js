const express = require('express');
const { getSystemStats } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getSystemStats);

module.exports = router;
