const express = require('express');
const { getMyProfile, createOrUpdateProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/me').get(protect, getMyProfile);
router.route('/').post(protect, createOrUpdateProfile);

module.exports = router;
