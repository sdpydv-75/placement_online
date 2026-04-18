const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get system wide statistics
// @route   GET /api/v1/admin/stats
// @access  Private (Admin)
const getSystemStats = async (req, res) => {
  try {
    // Run counts concurrently for speed
    const [userCount, jobCount, applicationCount] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: userCount,
        jobs: jobCount,
        applications: applicationCount
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getSystemStats
};
