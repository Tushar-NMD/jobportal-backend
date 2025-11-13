const Application = require('../models/Application');
const Job = require('../models/Job');
const sendEmail = require('../utils/sendEmail');
// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (User)
const applyForJob = async (req, res) => {
  try {
    const { coverLetter } = req.body;
    const jobId = req.params.jobId;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload your resume'
      });
    }

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (!job.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This job is no longer accepting applications'
      });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      user: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      user: req.user.id,
      resume: req.file.path,
      resumeOriginalName: req.file.originalname,
      coverLetter: coverLetter || ''
    });

    // Populate user and job details
    await application.populate('user', 'name email');
    await application.populate('job', 'jobTitle companyName');

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user's applications
// @route   GET /api/applications/my-applications
// @access  Private (User)
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id })
      .populate('job', 'jobTitle companyName location salary jobType')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get applications for a specific job (Admin only)
// @route   GET /api/admin/jobs/:jobId/applications
// @access  Private (Admin)
const getJobApplications = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    // Check if job belongs to this admin
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.postedBy.toString() !== req.admin.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these applications'
      });
    }

    const applications = await Application.find({ job: jobId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update application status (Admin only)
// @route   PUT /api/admin/applications/:applicationId/status
// @access  Private (Admin)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, message } = req.body;
    const applicationId = req.params.applicationId;

    // Validate status
    const validStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Valid statuses: pending, reviewed, shortlisted, rejected, accepted'
      });
    }

    // Find application and populate user and job details
    const application = await Application.findById(applicationId)
      .populate('user', 'name email')
      .populate('job', 'jobTitle companyName postedBy');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if admin owns this job
    if (application.job.postedBy.toString() !== req.admin.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }

    // Update status
    application.status = status;
    await application.save();

    // Send email notification to user
    try {
      const statusMessages = {
        pending: 'Your application is under review.',
        reviewed: 'Your application has been reviewed.',
        shortlisted: 'Congratulations! You have been shortlisted.',
        rejected: 'Unfortunately, your application was not selected.',
        accepted: 'Congratulations! Your application has been accepted.'
      };

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Application Status Update</h2>
          <p>Dear ${application.user.name},</p>
          <p>Your application for <strong>${application.job.jobTitle}</strong> at <strong>${application.job.companyName}</strong> has been updated.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">Status: ${status.toUpperCase()}</h3>
            <p style="margin-bottom: 0;">${statusMessages[status]}</p>
            ${message ? `<p style="margin-top: 15px;"><strong>Additional Message:</strong><br>${message}</p>` : ''}
          </div>
          
          <p>Thank you for your interest in our company.</p>
          <p>Best regards,<br>Job Portal Team</p>
        </div>
      `;

      await sendEmail({
        email: application.user.email,
        subject: `Application Status Update - ${application.job.jobTitle}`,
        html: emailHtml
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      success: true,
      message: 'Application status updated successfully',
      data: {
        _id: application._id,
        status: application.status,
        user: application.user,
        job: {
          jobTitle: application.job.jobTitle,
          companyName: application.job.companyName
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
// @desc    Get all applications for admin's jobs
// @route   GET /api/admin/applications
// @access  Private (Admin)
const getAllApplicationsForAdmin = async (req, res) => {
  try {
    // Find all jobs posted by this admin
    const adminJobs = await Job.find({ postedBy: req.admin.id }).select('_id');
    const jobIds = adminJobs.map(job => job._id);

    // Find all applications for these jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('user', 'name email')
      .populate('job', 'jobTitle companyName location salary jobType')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update application status (Admin only) - No Email
// @route   PUT /api/admin/applications/:applicationId/status
// @access  Private (Admin)
const updateApplicationStatusNoEmail = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.applicationId;

    // Validate status
    const validStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Valid statuses: pending, reviewed, shortlisted, rejected, accepted'
      });
    }

    // Find application and populate user and job details
    const application = await Application.findById(applicationId)
      .populate('user', 'name email')
      .populate('job', 'jobTitle companyName postedBy');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if admin owns this job
    if (application.job.postedBy.toString() !== req.admin.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }

    // Update status
    application.status = status;
    await application.save();

    res.json({
      success: true,
      message: 'Application status updated successfully',
      data: {
        _id: application._id,
        status: application.status,
        user: application.user,
        job: {
          jobTitle: application.job.jobTitle,
          companyName: application.job.companyName
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  getAllApplicationsForAdmin,
  updateApplicationStatusNoEmail
};


