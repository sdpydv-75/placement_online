const Job = require('../models/Job');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @desc    Get all jobs
// @route   GET /api/v1/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const { keyword, location, type, skills } = req.query;

    let query = {};

    // Filter by keyword (title or description)
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    // Filter by skills matching any of the required skills
    if (skills) {
      const skillArray = skills.split(',').map(skill => new RegExp(skill.trim(), 'i'));
      query.skills = { $in: skillArray };
    }

    const jobs = await Job.find(query).populate('recruiter', ['name', 'email']);

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get single job
// @route   GET /api/v1/jobs/:id
// @access  Public
const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiter', ['name', 'email']);

    if (!job) {
      return res.status(404).json({ success: false, error: `Job not found with id of ${req.params.id}` });
    }

    res.status(200).json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Create new job
// @route   POST /api/v1/jobs
// @access  Private (Recruiter)
const createJob = async (req, res) => {
  try {
    // Add user to req.body as recruiter
    req.body.recruiter = req.user.id;

    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      data: job
    });

    // 1. [EMAIL MODULE] Send mass notification to all students
    try {
      const students = await User.find({ role: 'student' }).select('email');
      const studentEmails = students.map(s => s.email).join(',');

      if (studentEmails) {
        await sendEmail({
          email: process.env.SMTP_EMAIL || 'no-reply@placement.local', // Primary To
          bcc: studentEmails, // Hidden mass recipients
          subject: `✨ New Job Posted: ${job.title} at ${job.company}`,
          message: `A new job opportunity has been posted!\n\nTitle: ${job.title}\nCompany: ${job.company}\nType: ${job.type}\nLocation: ${job.location}\n\nLog in to your dashboard to view more details and apply.`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f7f6; border-radius: 8px;">
              <h2 style="color: #2563eb;">New Job Opportunity Alert! 🚀</h2>
              <p style="font-size: 16px; color: #4b5563;">A new job has been posted that might interest you.</p>
              <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="margin-bottom: 8px;"><strong>Role:</strong> ${job.title}</li>
                  <li style="margin-bottom: 8px;"><strong>Company:</strong> ${job.company}</li>
                  <li style="margin-bottom: 8px;"><strong>Type:</strong> ${job.type}</li>
                  <li style="margin-bottom: 8px;"><strong>Location:</strong> ${job.location}</li>
                </ul>
              </div>
              <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">Log in to your placement portal to read the description and apply.</p>
            </div>
          `
        });
      }
    } catch(err) {
      console.error('Error sending mass job email:', err);
    }

  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update job
// @route   PUT /api/v1/jobs/:id
// @access  Private (Recruiter)
const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, error: `Job not found with id of ${req.params.id}` });
    }

    // Make sure user is job owner or admin
    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: `User is not authorized to update this job` });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/v1/jobs/:id
// @access  Private (Recruiter)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, error: `Job not found with id of ${req.params.id}` });
    }

    // Make sure user is job owner or admin
    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: `User is not authorized to delete this job` });
    }

    // Properly remove job document (deleteOne instead of remove() for newer mongoose)
    await job.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob
};
