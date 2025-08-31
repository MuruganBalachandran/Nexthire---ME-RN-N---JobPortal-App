const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect, authorizeJobseeker, authorizeRecruiter } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { applicationValidation, handleValidationErrors } = require('../utils/validation');

const { uploadResume, uploadDocuments, handleUploadError, getFileInfo } = require('../middleware/upload');
const Notification = require('../models/Notification');

// @desc    Submit job application
// @route   POST /api/applications
// @access  Private (Jobseekers only)
const submitApplication = asyncHandler(async (req, res) => {
  const { jobId, coverLetter, expectedSalary, experience } = req.body;

  // Check if job exists and is active
  const job = await Job.findById(jobId);
  if (!job) {
    return res.status(404).json({
      success: false,
      error: 'Job not found'
    });
  }

  if (job.status !== 'active') {
    return res.status(400).json({
      success: false,
      error: 'This job is not accepting applications'
    });
  }

  // Check if user has already applied
  const existingApplication = await Application.findOne({
    job: jobId,
    applicant: req.user._id
  });

  if (existingApplication) {
    return res.status(400).json({
      success: false,
      error: 'You have already applied for this job'
    });
  }

  // Create application data
  const applicationData = {
    job: jobId,
    applicant: req.user._id,
    coverLetter,
    expectedSalary,
    experience
  };

  // Add resume if uploaded
  if (req.file) {
    applicationData.resume = getFileInfo(req.file);
  }

  // Add additional documents if uploaded
  if (req.files && req.files.length > 0) {
    applicationData.additionalDocuments = req.files.map(file => ({
      ...getFileInfo(file),
      type: 'additional'
    }));
  }

  const application = await Application.create(applicationData);

  // Notify recruiter about new application
  if (job && job.recruiter) {
    await Notification.create({
      recipient: job.recruiter,
      type: 'application',
      title: 'New Job Application',
      message: `${req.user.fullName || 'A jobseeker'} applied for your job: ${job.title}`,
      relatedId: application._id,
      onModel: 'Application',
      metadata: { jobId: job._id }
    });
  }

  const populatedApplication = await Application.findById(application._id)
    .populate('job', 'title company location type salary')
    .populate('applicant', 'fullName email phone location skills experience');

  res.status(201).json({
    success: true,
    data: populatedApplication
  });
});

// @desc    Get user's applications
// @route   GET /api/applications/my-applications
// @access  Private (Jobseekers only)
const getMyApplications = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const query = { applicant: req.user._id };
  
  if (status) {
    query.status = status;
  }

  const applications = await Application.find(query)
    .populate('job', 'title company location type salary recruiter')
    .populate('applicant', 'fullName email phone location skills experience')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Application.countDocuments(query);

  res.json({
    success: true,
    data: applications,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

// @desc    Get applications for a job (recruiter view)
// @route   GET /api/applications/job/:jobId
// @access  Private (Job owner only)
const getJobApplications = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Check if job exists and user owns it
  const job = await Job.findById(req.params.jobId);
  if (!job) {
    return res.status(404).json({
      success: false,
      error: 'Job not found'
    });
  }

  if (job.recruiter.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to view applications for this job'
    });
  }

  const query = { job: req.params.jobId };
  
  if (status) {
    query.status = status;
  }

  const applications = await Application.find(query)
    .populate('job', 'title company location type salary')
    .populate('applicant', 'fullName email phone location skills experience avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Application.countDocuments(query);

  res.json({
    success: true,
    data: applications,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

// @desc    Get all applications for recruiter
// @route   GET /api/applications/recruiter/all
// @access  Private (Recruiters only)
const getAllRecruiterApplications = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Get all jobs posted by the recruiter
  const recruiterJobs = await Job.find({ recruiter: req.user._id }).select('_id');
  const jobIds = recruiterJobs.map(job => job._id);

  const query = { job: { $in: jobIds } };
  
  if (status) {
    query.status = status;
  }

  const applications = await Application.find(query)
    .populate('job', 'title company location type salary')
    .populate('applicant', 'fullName email phone location skills experience avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Application.countDocuments(query);

  res.json({
    success: true,
    data: applications,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private (Application owner or job owner)
const getApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate('job', 'title company location type salary recruiter')
    .populate('applicant', 'fullName email phone location skills experience avatar bio');

  if (!application) {
    return res.status(404).json({
      success: false,
      error: 'Application not found'
    });
  }

  // Check if user is authorized to view this application
  const isApplicant = application.applicant._id.toString() === req.user._id.toString();
  const isJobOwner = application.job.recruiter.toString() === req.user._id.toString();

  if (!isApplicant && !isJobOwner) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to view this application'
    });
  }

  res.json({
    success: true,
    data: application
  });
});

// @desc    Update application status (recruiter only)
// @route   PATCH /api/applications/:id/status
// @access  Private (Job owner only)
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;

  if (!['pending', 'reviewing', 'shortlisted', 'interviewed', 'accepted', 'rejected'].includes(status)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid status'
    });
  }

  const application = await Application.findById(req.params.id)
    .populate('job', 'recruiter');

  if (!application) {
    return res.status(404).json({
      success: false,
      error: 'Application not found'
    });
  }

  // Check if user owns the job
  if (application.job.recruiter.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to update this application'
    });
  }

  // Update status with notes
  application.status = status;
  if (notes) {
    application.recruiterNotes = notes;
  }

  await application.save();

  // Notify jobseeker about status update
  if (application.applicant) {
    await Notification.create({
      recipient: application.applicant,
      type: 'application',
      title: 'Application Status Updated',
      message: `Your application for ${application.job.title || 'a job'} is now '${status}'.`,
      relatedId: application._id,
      onModel: 'Application',
      metadata: { jobId: application.job._id, status }
    });
  }

  const updatedApplication = await Application.findById(application._id)
    .populate('job', 'title company location type salary')
    .populate('applicant', 'fullName email phone location skills experience');

  res.json({
    success: true,
    data: updatedApplication
  });
});

// @desc    Schedule interview
// @route   POST /api/applications/:id/interview
// @access  Private (Job owner only)
const scheduleInterview = asyncHandler(async (req, res) => {
  const { scheduledAt, duration, type, location, notes } = req.body;

  const application = await Application.findById(req.params.id)
    .populate('job', 'recruiter');

  if (!application) {
    return res.status(404).json({
      success: false,
      error: 'Application not found'
    });
  }

  // Check if user owns the job
  if (application.job.recruiter.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to schedule interview for this application'
    });
  }

  // Update application with interview details
  application.interviewSchedule = {
    scheduledAt: new Date(scheduledAt),
    duration: parseInt(duration),
    type,
    location,
    notes
  };

  // Update status to interviewed
  application.status = 'interviewed';

  await application.save();

  const updatedApplication = await Application.findById(application._id)
    .populate('job', 'title company location type salary')
    .populate('applicant', 'fullName email phone location skills experience');

  res.json({
    success: true,
    data: updatedApplication
  });
});

// @desc    Withdraw application
// @route   DELETE /api/applications/:id
// @access  Private (Application owner only)
const withdrawApplication = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const application = await Application.findById(req.params.id);

  if (!application) {
    return res.status(404).json({
      success: false,
      error: 'Application not found'
    });
  }

  // Check if user is the applicant
  if (application.applicant.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to withdraw this application'
    });
  }

  // Check if application can be withdrawn
  if (application.status === 'accepted' || application.status === 'rejected') {
    return res.status(400).json({
      success: false,
      error: 'Cannot withdraw application that has been accepted or rejected'
    });
  }

  await application.withdraw(reason);

  res.json({
    success: true,
    message: 'Application withdrawn successfully'
  });
});

// @desc    Get application statistics
// @route   GET /api/applications/stats
// @access  Private (Recruiters only)
const getApplicationStats = asyncHandler(async (req, res) => {
  // Get all jobs posted by the recruiter
  const recruiterJobs = await Job.find({ recruiter: req.user._id }).select('_id');
  const jobIds = recruiterJobs.map(job => job._id);

  const stats = await Application.aggregate([
    { $match: { job: { $in: jobIds } } },
    {
      $group: {
        _id: null,
        totalApplications: { $sum: 1 },
        pendingApplications: { 
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } 
        },
        reviewingApplications: { 
          $sum: { $cond: [{ $eq: ['$status', 'reviewing'] }, 1, 0] } 
        },
        shortlistedApplications: { 
          $sum: { $cond: [{ $eq: ['$status', 'shortlisted'] }, 1, 0] } 
        },
        interviewedApplications: { 
          $sum: { $cond: [{ $eq: ['$status', 'interviewed'] }, 1, 0] } 
        },
        acceptedApplications: { 
          $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] } 
        },
        rejectedApplications: { 
          $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } 
        }
      }
    }
  ]);

  const statusStats = await Application.aggregate([
    { $match: { job: { $in: jobIds } } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      overview: stats[0] || {
        totalApplications: 0,
        pendingApplications: 0,
        reviewingApplications: 0,
        shortlistedApplications: 0,
        interviewedApplications: 0,
        acceptedApplications: 0,
        rejectedApplications: 0
      },
      byStatus: statusStats
    }
  });
});

// Apply routes
router.post('/', protect, authorizeJobseeker, uploadResume, uploadDocuments, handleUploadError, applicationValidation, handleValidationErrors, submitApplication);
router.get('/my-applications', protect, authorizeJobseeker, getMyApplications);
router.get('/job/:jobId', protect, authorizeRecruiter, getJobApplications);
router.get('/recruiter/all', protect, authorizeRecruiter, getAllRecruiterApplications);
router.get('/stats', protect, authorizeRecruiter, getApplicationStats);
router.get('/:id', protect, getApplication);
router.patch('/:id/status', protect, authorizeRecruiter, updateApplicationStatus);
router.post('/:id/interview', protect, authorizeRecruiter, scheduleInterview);
router.delete('/:id', protect, authorizeJobseeker, withdrawApplication);

module.exports = router;
