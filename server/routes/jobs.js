const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect, authorizeRecruiter, optionalAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { jobValidation, handleValidationErrors } = require('../utils/validation');

// @desc    Get all jobs with filters
// @route   GET /api/jobs
// @access  Public
const getJobs = asyncHandler(async (req, res) => {
  const {
    search,
    location,
    type,
    remote,
    experience,
    minSalary,
    maxSalary,
    tags,
    recruiter,
    page = 1,
    limit = 10,
    sort = 'createdAt',
    order = 'desc'
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build filters
  const filters = {};
  if (search) {
    filters.$text = { $search: search };
  }
  if (location) {
    filters.location = { $regex: location, $options: 'i' };
  }
  if (type) {
    filters.type = type;
  }
  if (remote !== undefined) {
    filters.remote = remote === 'true';
  }
  if (experience) {
    filters.experience = experience;
  }
  if (minSalary) {
    filters['salary.max'] = { $gte: parseInt(minSalary) };
  }
  if (maxSalary) {
    filters['salary.min'] = { $lte: parseInt(maxSalary) };
  }
  if (tags) {
    const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
    filters.tags = { $in: tagArray };
  }
  if (recruiter) {
    filters.recruiter = recruiter;
  }
  // Only show active jobs
  filters.status = 'active';

  // Build sort object
  const sortObj = {};
  sortObj[sort] = order === 'desc' ? -1 : 1;

  const jobs = await Job.find(filters)
    .populate('recruiter', 'fullName company avatar')
    .sort(sortObj)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Job.countDocuments(filters);

  if (req.user) {
    const jobIds = jobs.map(job => job._id);
    await Job.updateMany(
      { _id: { $in: jobIds } },
      { $inc: { viewsCount: 1 } }
    );
  }

  res.json({
    success: true,
    data: jobs,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate('recruiter', 'fullName company companyWebsite avatar');

  if (!job) {
    return res.status(404).json({
      success: false,
      error: 'Job not found'
    });
  }

  // Increment view count if user is authenticated
  if (req.user) {
    job.viewsCount += 1;
    await job.save();
  }

  res.json({
    success: true,
    data: job
  });
});

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Recruiters only)
const createJob = asyncHandler(async (req, res) => {
  // Add recruiter to job data
  req.body.recruiter = req.user._id;

  const job = await Job.create(req.body);

  const populatedJob = await Job.findById(job._id)
    .populate('recruiter', 'fullName company avatar');

  res.status(201).json({
    success: true,
    data: populatedJob
  });
});

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Job owner only)
const updateJob = asyncHandler(async (req, res) => {
  let job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({
      success: false,
      error: 'Job not found'
    });
  }

  // Check if user owns the job
  if (job.recruiter.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to update this job'
    });
  }

  job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('recruiter', 'fullName company avatar');

  res.json({
    success: true,
    data: job
  });
});

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Job owner only)
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({
      success: false,
      error: 'Job not found'
    });
  }

  // Check if user owns the job
  if (job.recruiter.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to delete this job'
    });
  }

  await Job.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Job deleted successfully'
  });
});

// @desc    Get jobs by recruiter
// @route   GET /api/jobs/recruiter/my-jobs
// @access  Private (Recruiters only)
const getMyJobs = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const query = { recruiter: req.user._id };
  
  if (status) {
    query.status = status;
  }

  const jobs = await Job.find(query)
    .populate('recruiter', 'fullName company avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Job.countDocuments(query);

  res.json({
    success: true,
    data: jobs,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

// @desc    Update job status
// @route   PATCH /api/jobs/:id/status
// @access  Private (Job owner only)
const updateJobStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['active', 'paused', 'closed', 'draft'].includes(status)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid status'
    });
  }

  const job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({
      success: false,
      error: 'Job not found'
    });
  }

  // Check if user owns the job
  if (job.recruiter.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to update this job'
    });
  }

  job.status = status;
  await job.save();

  const updatedJob = await Job.findById(job._id)
    .populate('recruiter', 'fullName company avatar');

  res.json({
    success: true,
    data: updatedJob
  });
});

// @desc    Get featured jobs
// @route   GET /api/jobs/featured
// @access  Public
const getFeaturedJobs = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;

  const jobs = await Job.find({ 
    status: 'active', 
    isFeatured: true 
  })
    .populate('recruiter', 'fullName company avatar')
    .sort({ createdAt: -1 })
    .limit(limit);

  res.json({
    success: true,
    data: jobs
  });
});

// @desc    Get urgent jobs
// @route   GET /api/jobs/urgent
// @access  Public
const getUrgentJobs = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;

  const jobs = await Job.find({ 
    status: 'active', 
    isUrgent: true 
  })
    .populate('recruiter', 'fullName company avatar')
    .sort({ createdAt: -1 })
    .limit(limit);

  res.json({
    success: true,
    data: jobs
  });
});

// @desc    Get job statistics
// @route   GET /api/jobs/stats
// @access  Private (Recruiters only)
const getJobStats = asyncHandler(async (req, res) => {
  const stats = await Job.aggregate([
    { $match: { recruiter: req.user._id } },
    {
      $group: {
        _id: null,
        totalJobs: { $sum: 1 },
        activeJobs: { 
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } 
        },
        pausedJobs: { 
          $sum: { $cond: [{ $eq: ['$status', 'paused'] }, 1, 0] } 
        },
        closedJobs: { 
          $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } 
        },
        totalViews: { $sum: '$viewsCount' },
        totalApplications: { $sum: '$applicationsCount' }
      }
    }
  ]);

  const jobTypeStats = await Job.aggregate([
    { $match: { recruiter: req.user._id } },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 }
      }
    }
  ]);

  const experienceStats = await Job.aggregate([
    { $match: { recruiter: req.user._id } },
    {
      $group: {
        _id: '$experience',
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      overview: stats[0] || {
        totalJobs: 0,
        activeJobs: 0,
        pausedJobs: 0,
        closedJobs: 0,
        totalViews: 0,
        totalApplications: 0
      },
      byType: jobTypeStats,
      byExperience: experienceStats
    }
  });
});

// Apply routes
router.get('/', optionalAuth, getJobs);
router.get('/featured', getFeaturedJobs);
router.get('/urgent', getUrgentJobs);
router.get('/stats', protect, authorizeRecruiter, getJobStats);
router.get('/recruiter/my-jobs', protect, authorizeRecruiter, getMyJobs);
router.get('/:id', optionalAuth, getJob);

router.post('/', protect, authorizeRecruiter, jobValidation, handleValidationErrors, createJob);
router.put('/:id', protect, authorizeRecruiter, jobValidation, handleValidationErrors, updateJob);
router.patch('/:id/status', protect, authorizeRecruiter, updateJobStatus);
router.delete('/:id', protect, authorizeRecruiter, deleteJob);

module.exports = router;
