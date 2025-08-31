const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Save a job
// @route   POST /api/saved-jobs
exports.saveJob = asyncHandler(async (req, res) => {
  const { jobId, notes } = req.body;
  
  try {
    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    // Check if already saved
    const existingSave = await SavedJob.findOne({
      user: req.user._id,
      job: jobId
    });

    if (existingSave) {
      return res.status(400).json({
        success: false,
        error: 'Job already saved'
      });
    }

    // Create saved job
    const savedJob = await SavedJob.create({
      user: req.user._id,
      job: jobId,
      notes
    });

    // Populate job details
    const populatedSavedJob = await SavedJob.findById(savedJob._id)
      .populate('job', 'title company location type salary');

    res.status(201).json({
      success: true,
      data: populatedSavedJob
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

// @desc    Unsave a job
// @route   DELETE /api/saved-jobs/:jobId
exports.unsaveJob = asyncHandler(async (req, res) => {
  try {
    const savedJob = await SavedJob.findOne({
      user: req.user._id,
      job: req.params.jobId
    });

    if (!savedJob) {
      return res.status(404).json({
        success: false,
        error: 'Saved job not found'
      });
    }

    await savedJob.remove();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

// @desc    Get user's saved jobs
// @route   GET /api/saved-jobs
exports.getSavedJobs = asyncHandler(async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ user: req.user._id })
      .populate('job', 'title company location type salary status')
      .sort('-savedAt');

    res.json({
      success: true,
      count: savedJobs.length,
      data: savedJobs
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

// @desc    Check if job is saved
// @route   GET /api/saved-jobs/:jobId/check
exports.checkSavedStatus = asyncHandler(async (req, res) => {
  try {
    const savedJob = await SavedJob.findOne({
      user: req.user._id,
      job: req.params.jobId
    });

    res.json({
      success: true,
      isSaved: !!savedJob
    });
  } catch (error) {
    throw new Error(error.message);
  }
});
