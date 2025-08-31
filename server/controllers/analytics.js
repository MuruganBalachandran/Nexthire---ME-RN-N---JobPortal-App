const Analytics = require('../models/Analytics');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get user analytics
// @route   GET /api/analytics/user
exports.getUserAnalytics = asyncHandler(async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    switch (timeframe) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    const analytics = await Analytics.findOne({
      user: req.user._id,
      type: req.user.userType === 'recruiter' ? 'company' : 'application',
      'timeframe.start': { $lte: endDate },
      'timeframe.end': { $gte: startDate }
    });

    if (!analytics) {
      // Generate new analytics
      const newAnalytics = await generateUserAnalytics(req.user, startDate, endDate);
      return res.json({
        success: true,
        data: newAnalytics
      });
    }

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

// @desc    Get job analytics
// @route   GET /api/analytics/jobs
exports.getJobAnalytics = asyncHandler(async (req, res) => {
  try {
    const { jobId } = req.query;
    
    const query = jobId 
      ? { _id: jobId, recruiter: req.user._id }
      : { recruiter: req.user._id };

    const jobStats = await Job.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalJobs: { $sum: 1 },
          activeJobs: { 
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          totalViews: { $sum: '$viewsCount' },
          totalApplications: { $sum: '$applicationsCount' },
          averageApplications: { $avg: '$applicationsCount' }
        }
      }
    ]);

    const applicationStats = await Application.aggregate([
      {
        $match: {
          job: jobId ? mongoose.Types.ObjectId(jobId) : { $exists: true },
          'job.recruiter': req.user._id
        }
      },
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
        jobStats: jobStats[0] || {
          totalJobs: 0,
          activeJobs: 0,
          totalViews: 0,
          totalApplications: 0,
          averageApplications: 0
        },
        applicationStats
      }
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

// @desc    Get application analytics
// @route   GET /api/analytics/applications
exports.getApplicationAnalytics = asyncHandler(async (req, res) => {
  try {
    const stats = await Application.aggregate([
      {
        $match: { applicant: req.user._id }
      },
      {
        $group: {
          _id: null,
          totalApplications: { $sum: 1 },
          pending: { 
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          reviewing: {
            $sum: { $cond: [{ $eq: ['$status', 'reviewing'] }, 1, 0] }
          },
          interviewed: {
            $sum: { $cond: [{ $eq: ['$status', 'interviewed'] }, 1, 0] }
          },
          accepted: {
            $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
          },
          rejected: {
            $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
          }
        }
      }
    ]);

    const timelineStats = await Application.aggregate([
      {
        $match: { applicant: req.user._id }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalApplications: 0,
          pending: 0,
          reviewing: 0,
          interviewed: 0,
          accepted: 0,
          rejected: 0
        },
        timeline: timelineStats
      }
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

// Helper function to generate user analytics
const generateUserAnalytics = async (user, startDate, endDate) => {
  try {
    const metrics = {
      views: 0,
      applications: 0,
      interviews: 0,
      offers: 0,
      rejections: 0,
      saved: 0
    };

    if (user.userType === 'jobseeker') {
      const applications = await Application.find({
        applicant: user._id,
        createdAt: { $gte: startDate, $lte: endDate }
      });

      metrics.applications = applications.length;
      metrics.interviews = applications.filter(app => app.status === 'interviewed').length;
      metrics.offers = applications.filter(app => app.status === 'accepted').length;
      metrics.rejections = applications.filter(app => app.status === 'rejected').length;
    } else {
      const jobs = await Job.find({
        recruiter: user._id,
        createdAt: { $gte: startDate, $lte: endDate }
      });

      metrics.views = jobs.reduce((acc, job) => acc + job.viewsCount, 0);
      metrics.applications = jobs.reduce((acc, job) => acc + job.applicationsCount, 0);
    }

    const analytics = await Analytics.create({
      user: user._id,
      type: user.userType === 'recruiter' ? 'company' : 'application',
      metrics,
      timeframe: { start: startDate, end: endDate }
    });

    return analytics;
  } catch (error) {
    throw new Error(error.message);
  }
};
