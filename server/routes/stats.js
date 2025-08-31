const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');
const { protect, authorizeBoth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get recruiter statistics by recruiterId
// @route   GET /api/stats/recruiter?recruiterId=xxx
// @access  Private
const getRecruiterStatsById = asyncHandler(async (req, res) => {
  const recruiterId = req.query.recruiterId;
  if (!recruiterId) {
    return res.status(400).json({ success: false, message: 'Missing recruiterId' });
  }
  const user = await User.findById(recruiterId);
  if (!user || user.userType !== 'recruiter') {
    return res.status(404).json({ success: false, message: 'Recruiter not found' });
  }
  const [
    totalJobs,
    activeJobs,
    totalApplications,
    pendingApplications,
    shortlistedApplications,
    interviewedApplications,
    acceptedApplications,
    rejectedApplications
  ] = await Promise.all([
    Job.countDocuments({ recruiter: recruiterId }),
    Job.countDocuments({ recruiter: recruiterId, status: 'active' }),
    Application.countDocuments({ job: { $in: await Job.find({ recruiter: recruiterId }).select('_id') } }),
    Application.countDocuments({ job: { $in: await Job.find({ recruiter: recruiterId }).select('_id') }, status: 'pending' }),
    Application.countDocuments({ job: { $in: await Job.find({ recruiter: recruiterId }).select('_id') }, status: 'shortlisted' }),
    Application.countDocuments({ job: { $in: await Job.find({ recruiter: recruiterId }).select('_id') }, status: 'interviewed' }),
    Application.countDocuments({ job: { $in: await Job.find({ recruiter: recruiterId }).select('_id') }, status: 'accepted' }),
    Application.countDocuments({ job: { $in: await Job.find({ recruiter: recruiterId }).select('_id') }, status: 'rejected' })
  ]);

  // Get recent jobs with proper error handling for salary formatting
  const recentJobs = await Job.find({ recruiter: recruiterId })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean() // Convert to plain JS object
    .exec();  // Ensure proper execution of query

  const recruiterJobs = await Job.find({ recruiter: recruiterId }).select('_id');
  const recentApplications = await Application.find({ job: { $in: recruiterJobs.map(job => job._id) } })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('job', 'title company')
    .populate('applicant', 'fullName email');

  const successRate = totalApplications > 0 
    ? parseFloat(((acceptedApplications / totalApplications) * 100).toFixed(1))
    : 0;

  res.json({
    success: true,
    data: {
      overview: {
        totalJobs,
        activeJobs,
        totalApplications,
        pendingApplications,
        shortlistedApplications,
        interviewedApplications,
        acceptedApplications,
        rejectedApplications,
        successRate: parseFloat(successRate)
      },
      recentJobs,
      recentApplications
    }
  });
});

// @desc    Get overall platform statistics
// @route   GET /api/stats/platform
// @access  Public
const getPlatformStats = asyncHandler(async (req, res) => {
  const [
    totalJobs,
    activeJobs,
    totalUsers,
    totalApplications,
    jobseekers,
    recruiters
  ] = await Promise.all([
    Job.countDocuments(),
    Job.countDocuments({ status: 'active' }),
    User.countDocuments(),
    Application.countDocuments(),
    User.countDocuments({ userType: 'jobseeker' }),
    User.countDocuments({ userType: 'recruiter' })
  ]);

  // Get recent activity
  const recentJobs = await Job.find({ status: 'active' })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('recruiter', 'fullName company');

  const recentApplications = await Application.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('job', 'title company')
    .populate('applicant', 'fullName');

  res.json({
    success: true,
    data: {
      overview: {
        totalJobs,
        activeJobs,
        totalUsers,
        totalApplications,
        jobseekers,
        recruiters
      },
      recentActivity: {
        recentJobs,
        recentApplications
      }
    }
  });
});

// @desc    Get user dashboard statistics
// @route   GET /api/stats/dashboard
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const user = req.user;

  if (user.userType === 'jobseeker') {
    // Jobseeker statistics
    const [
      totalApplications,
      pendingApplications,
      shortlistedApplications,
      interviewedApplications,
      acceptedApplications,
      rejectedApplications
    ] = await Promise.all([
      Application.countDocuments({ applicant: user._id }),
      Application.countDocuments({ applicant: user._id, status: 'pending' }),
      Application.countDocuments({ applicant: user._id, status: 'shortlisted' }),
      Application.countDocuments({ applicant: user._id, status: 'interviewed' }),
      Application.countDocuments({ applicant: user._id, status: 'accepted' }),
      Application.countDocuments({ applicant: user._id, status: 'rejected' })
    ]);

    // Recent applications
    const recentApplications = await Application.find({ applicant: user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('job', 'title company location type salary');

    // Application success rate
    const successRate = totalApplications > 0 
      ? ((acceptedApplications / totalApplications) * 100).toFixed(1)
      : 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalApplications,
          pendingApplications,
          shortlistedApplications,
          interviewedApplications,
          acceptedApplications,
          rejectedApplications,
          successRate: parseFloat(successRate)
        },
        recentApplications
      }
    });
  } else {
    // Recruiter statistics
    const [
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
      shortlistedApplications,
      interviewedApplications,
      acceptedApplications,
      rejectedApplications
    ] = await Promise.all([
      Job.countDocuments({ recruiter: user._id }),
      Job.countDocuments({ recruiter: user._id, status: 'active' }),
      Application.countDocuments({ 
        job: { $in: await Job.find({ recruiter: user._id }).select('_id') }
      }),
      Application.countDocuments({ 
        job: { $in: await Job.find({ recruiter: user._id }).select('_id') },
        status: 'pending'
      }),
      Application.countDocuments({ 
        job: { $in: await Job.find({ recruiter: user._id }).select('_id') },
        status: 'shortlisted'
      }),
      Application.countDocuments({ 
        job: { $in: await Job.find({ recruiter: user._id }).select('_id') },
        status: 'interviewed'
      }),
      Application.countDocuments({ 
        job: { $in: await Job.find({ recruiter: user._id }).select('_id') },
        status: 'accepted'
      }),
      Application.countDocuments({ 
        job: { $in: await Job.find({ recruiter: user._id }).select('_id') },
        status: 'rejected'
      })
    ]);

    // Recent applications
    const recruiterJobs = await Job.find({ recruiter: user._id }).select('_id');
    const recentApplications = await Application.find({ 
      job: { $in: recruiterJobs.map(job => job._id) }
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('job', 'title company')
      .populate('applicant', 'fullName email');

    // Recent jobs
    const recentJobs = await Job.find({ recruiter: user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    // Application success rate
    const successRate = totalApplications > 0 
      ? ((acceptedApplications / totalApplications) * 100).toFixed(1)
      : 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalJobs,
          activeJobs,
          totalApplications,
          pendingApplications,
          shortlistedApplications,
          interviewedApplications,
          acceptedApplications,
          rejectedApplications,
          successRate: parseFloat(successRate)
        },
        recentApplications,
        recentJobs
      }
    });
  }
});

// @desc    Get job statistics by type
// @route   GET /api/stats/jobs/by-type
// @access  Public
const getJobStatsByType = asyncHandler(async (req, res) => {
  const stats = await Job.aggregate([
    { $match: { status: 'active' } },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        avgSalary: { $avg: { $avg: ['$salary.min', '$salary.max'] } }
      }
    },
    { $sort: { count: -1 } }
  ]);

  res.json({
    success: true,
    data: stats
  });
});

// @desc    Get job statistics by location
// @route   GET /api/stats/jobs/by-location
// @access  Public
const getJobStatsByLocation = asyncHandler(async (req, res) => {
  const stats = await Job.aggregate([
    { $match: { status: 'active' } },
    {
      $group: {
        _id: '$location',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  res.json({
    success: true,
    data: stats
  });
});

// @desc    Get job statistics by experience level
// @route   GET /api/stats/jobs/by-experience
// @access  Public
const getJobStatsByExperience = asyncHandler(async (req, res) => {
  const stats = await Job.aggregate([
    { $match: { status: 'active' } },
    {
      $group: {
        _id: '$experience',
        count: { $sum: 1 },
        avgSalary: { $avg: { $avg: ['$salary.min', '$salary.max'] } }
      }
    },
    { $sort: { count: -1 } }
  ]);

  res.json({
    success: true,
    data: stats
  });
});

// @desc    Get salary range statistics
// @route   GET /api/stats/jobs/salary-ranges
// @access  Public
const getSalaryRangeStats = asyncHandler(async (req, res) => {
  const stats = await Job.aggregate([
    { $match: { status: 'active' } },
    {
      $addFields: {
        avgSalary: { $avg: ['$salary.min', '$salary.max'] }
      }
    },
    {
      $bucket: {
        groupBy: '$avgSalary',
        boundaries: [0, 30000, 50000, 75000, 100000, 150000, 200000, 300000],
        default: '300000+',
        output: {
          count: { $sum: 1 },
          jobs: { $push: { title: '$title', company: '$company', avgSalary: '$avgSalary' } }
        }
      }
    }
  ]);

  res.json({
    success: true,
    data: stats
  });
});

// @desc    Get trending skills
// @route   GET /api/stats/jobs/trending-skills
// @access  Public
const getTrendingSkills = asyncHandler(async (req, res) => {
  const stats = await Job.aggregate([
    { $match: { status: 'active' } },
    { $unwind: '$skills' },
    {
      $group: {
        _id: '$skills',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 20 }
  ]);

  res.json({
    success: true,
    data: stats
  });
});

// @desc    Get monthly job posting trends
// @route   GET /api/stats/jobs/monthly-trends
// @access  Public
const getMonthlyJobTrends = asyncHandler(async (req, res) => {
  const stats = await Job.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 }
  ]);

  res.json({
    success: true,
    data: stats
  });
});

// Apply routes
router.get('/platform', getPlatformStats);
router.get('/dashboard', protect, getDashboardStats);
router.get('/recruiter', getRecruiterStatsById);
router.get('/jobs/by-type', getJobStatsByType);
router.get('/jobs/by-location', getJobStatsByLocation);
router.get('/jobs/by-experience', getJobStatsByExperience);
router.get('/jobs/salary-ranges', getSalaryRangeStats);
router.get('/jobs/trending-skills', getTrendingSkills);
router.get('/jobs/monthly-trends', getMonthlyJobTrends);

module.exports = router;
