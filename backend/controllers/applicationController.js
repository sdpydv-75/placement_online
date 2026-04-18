const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @desc    Apply to a job
// @route   POST /api/v1/applications/jobs/:jobId
// @access  Private (Student)
const applyToJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const studentId = req.user.id;
    const { cgpa, branch, passingYear, phone } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    // Since we added unique index, we can just try to create
    const application = await Application.create({
      student: studentId,
      job: jobId,
      cgpa,
      branch,
      passingYear,
      phone
    });

    res.status(201).json({
      success: true,
      data: application
    });

    // 2. [EMAIL MODULE] Send Application Submitted Confirmation
    try {
      const student = await User.findById(studentId);
      if (student && student.email) {
        await sendEmail({
          email: student.email,
          subject: `✅ Application Submitted: ${job.title} at ${job.company}`,
          message: `Your application for ${job.title} at ${job.company} has been submitted successfully.\n\nKeep an eye on your dashboard for status updates.`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
              <h2 style="color: #10b981;">Application Successful! 🎉</h2>
              <p>You have successfully applied for the position of <strong>${job.title}</strong> at <strong>${job.company}</strong>.</p>
              <p>We will notify you if you get shortlisted for the interview rounds. Best of luck!</p>
            </div>
          `
        });
      }
    } catch(err) {
      console.error('Error sending application confirmation email:', err);
    }

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, error: 'You have already applied to this job' });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get applied jobs for student
// @route   GET /api/v1/applications/me
// @access  Private (Student)
const getAppliedJobs = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate({
        path: 'job',
        populate: { path: 'recruiter', select: 'name email' }
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get applicants for a specific job
// @route   GET /api/v1/applications/jobs/:jobId
// @access  Private (Recruiter)
const getJobApplicants = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    // Verify job exists and recruiter owns it
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to view these applications' });
    }

    const applications = await Application.find({ job: jobId })
      .populate('student', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update application status
// @route   PUT /api/v1/applications/:id/status
// @access  Private (Recruiter)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    let application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    // Check if recruiter owns the job related to this application
    if (application.job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      success: true,
      data: application
    });

    // 3 & 4. [EMAIL MODULE] Send Shortlisted / Selected Status Updates
    try {
      if (status === 'Shortlisted' || status === 'Selected' || status === 'Rejected') {
        const student = await User.findById(application.student);
        if (student && student.email) {
          
          let sub = '';
          let htmlContent = '';

          if (status === 'Shortlisted') {
            sub = `🌟 Interview Shortlisted: ${application.job.title}`;
            htmlContent = `
              <h2 style="color: #3b82f6;">Congratulations! You're Shortlisted!</h2>
              <p>Dear ${student.name},</p>
              <p>You have been shortlisted for the <strong>${application.job.title}</strong> role at <strong>${application.job.company}</strong>.</p>
              <p>Please check your dashboard or await further instructions regarding your interview schedule.</p>
            `;
          } else if (status === 'Selected') {
            sub = `🎉 Job Offer: Selected for ${application.job.title}`;
            htmlContent = `
              <h2 style="color: #10b981;">Amazing News! You've been Selected!</h2>
              <p>Dear ${student.name},</p>
              <p>Congratulations! You have successfully cleared the process and are selected for <strong>${application.job.title}</strong> at <strong>${application.job.company}</strong>.</p>
              <p>HR will be reaching out soon with the formal offer letter and joining details.</p>
            `;
          } else if (status === 'Rejected') {
            sub = `Status Update: ${application.job.title}`;
            htmlContent = `
              <h2>Application Update</h2>
              <p>Dear ${student.name},</p>
              <p>Thank you for applying to <strong>${application.job.title}</strong> at <strong>${application.job.company}</strong>.</p>
              <p>Unfortunately, your application was not selected to move forward at this time. Keep applying and best of luck!</p>
            `;
          }

          await sendEmail({
            email: student.email,
            subject: sub,
            html: `<div style="font-family: Arial, sans-serif; padding: 20px;">${htmlContent}</div>`
          });
        }
      }
    } catch(err) {
      console.error('Error sending application status email:', err);
    }

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  applyToJob,
  getAppliedJobs,
  getJobApplicants,
  updateApplicationStatus
};
