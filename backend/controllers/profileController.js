const StudentProfile = require('../models/StudentProfile');
const RecruiterProfile = require('../models/RecruiterProfile');

// @desc    Get current user profile
// @route   GET /api/v1/profile/me
// @access  Private
const getMyProfile = async (req, res) => {
  try {
    let profile;

    if (req.user.role === 'student') {
      profile = await StudentProfile.findOne({ user: req.user.id }).populate('user', ['name', 'email']);
    } else if (req.user.role === 'recruiter') {
      profile = await RecruiterProfile.findOne({ user: req.user.id }).populate('user', ['name', 'email']);
    }

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'There is no profile for this user'
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Create or update user profile
// @route   POST /api/v1/profile
// @access  Private
const createOrUpdateProfile = async (req, res) => {
  try {
    const { role } = req.user;
    let profile;

    if (role === 'student') {
      const { skills, education, resume, github, linkedin, projects, certifications, profilePhoto } = req.body;
      const profileFields = { user: req.user.id, skills, education, resume, github, linkedin, projects, certifications, profilePhoto };
      
      profile = await StudentProfile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true }
      );
    } else if (role === 'recruiter') {
      const { companyName, companyWebsite, industry, description } = req.body;
      const profileFields = { user: req.user.id, companyName, companyWebsite, industry, description };
      
      profile = await RecruiterProfile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true }
      );
    } else {
      return res.status(400).json({ success: false, error: 'Admin profiles not supported yet' });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getMyProfile,
  createOrUpdateProfile
};
