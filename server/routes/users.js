const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorizeBoth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { profileValidation, handleValidationErrors } = require('../utils/validation');
const { uploadAvatar, uploadResume, handleUploadError, getFileInfo, deleteFile } = require('../middleware/upload');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json({
    success: true,
    data: {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      userType: user.userType,
      phone: user.phone,
      location: user.location,
      bio: user.bio,
      skills: user.skills,
      experience: user.experience,
      education: user.education,
      resume: user.resume,
      company: user.company,
      companyWebsite: user.companyWebsite,
      companyDescription: user.companyDescription,
      position: user.position,
      avatar: user.avatar,
      isVerified: user.isVerified,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const updateData = { ...req.body };

  // Remove fields that shouldn't be updated directly
  delete updateData.email;
  delete updateData.password;
  delete updateData.userType;
  delete updateData.isVerified;
  delete updateData.isActive;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updateData,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    data: {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      userType: user.userType,
      phone: user.phone,
      location: user.location,
      bio: user.bio,
      skills: user.skills,
      experience: user.experience,
      education: user.education,
      resume: user.resume,
      company: user.company,
      companyWebsite: user.companyWebsite,
      companyDescription: user.companyDescription,
      position: user.position,
      avatar: user.avatar,
      isVerified: user.isVerified,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  });
});

// @desc    Upload avatar
// @route   POST /api/users/avatar
// @access  Private
const uploadAvatarHandler = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'Please upload an image file'
    });
  }

  const user = await User.findById(req.user._id);

  // Delete old avatar if exists
  if (user.avatar) {
    deleteFile(user.avatar);
  }

  // Update user with new avatar
  user.avatar = req.file.path;
  await user.save();

  res.json({
    success: true,
    data: {
      avatar: user.avatar
    },
    message: 'Avatar uploaded successfully'
  });
});

// @desc    Upload resume
// @route   POST /api/users/resume
// @access  Private
const uploadResumeHandler = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'Please upload a resume file'
    });
  }

  const user = await User.findById(req.user._id);

  // Delete old resume if exists
  if (user.resume && user.resume.path) {
    deleteFile(user.resume.path);
  }

  // Update user with new resume
  user.resume = getFileInfo(req.file);
  await user.save();

  res.json({
    success: true,
    data: {
      resume: user.resume
    },
    message: 'Resume uploaded successfully'
  });
});

// @desc    Delete resume
// @route   DELETE /api/users/resume
// @access  Private
const deleteResume = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user.resume) {
    return res.status(404).json({
      success: false,
      error: 'No resume found'
    });
  }

  // Delete file from storage
  if (user.resume.path) {
    deleteFile(user.resume.path);
  }

  // Remove resume from user
  user.resume = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Resume deleted successfully'
  });
});

// @desc    Get user by ID (for recruiters to view jobseeker profiles)
// @route   GET /api/users/:id
// @access  Private
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  // If requesting user is a recruiter, they can view jobseeker profiles
  // If requesting user is a jobseeker, they can only view their own profile
  if (req.user.userType === 'jobseeker' && req.user._id.toString() !== req.params.id) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to view this profile'
    });
  }

  res.json({
    success: true,
    data: {
      _id: user._id,
      fullName: user.fullName,
      userType: user.userType,
      phone: user.phone,
      location: user.location,
      bio: user.bio,
      skills: user.skills,
      experience: user.experience,
      education: user.education,
      company: user.company,
      companyWebsite: user.companyWebsite,
      companyDescription: user.companyDescription,
      position: user.position,
      avatar: user.avatar,
      isVerified: user.isVerified,
      createdAt: user.createdAt
    }
  });
});

// @desc    Search users (for recruiters)
// @route   GET /api/users/search
// @access  Private (Recruiters only)
const searchUsers = asyncHandler(async (req, res) => {
  const { search, skills, location, experience } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build query
  const query = { userType: 'jobseeker', isActive: true };

  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { skills: { $regex: search, $options: 'i' } },
      { bio: { $regex: search, $options: 'i' } }
    ];
  }

  if (skills) {
    query.skills = { $regex: skills, $options: 'i' };
  }

  if (location) {
    query.location = { $regex: location, $options: 'i' };
  }

  if (experience) {
    query.experience = experience;
  }

  const users = await User.find(query)
    .select('fullName skills experience location bio avatar isVerified createdAt')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(query);

  res.json({
    success: true,
    data: users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Deactivate account
// @route   PUT /api/users/deactivate
// @access  Private
const deactivateAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  user.isActive = false;
  await user.save();

  res.json({
    success: true,
    message: 'Account deactivated successfully'
  });
});

// Apply routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, profileValidation, handleValidationErrors, updateProfile);
router.post('/avatar', protect, uploadAvatar, handleUploadError, uploadAvatarHandler);
router.post('/resume', protect, uploadResume, handleUploadError, uploadResumeHandler);
router.delete('/resume', protect, deleteResume);
router.get('/search', protect, authorizeBoth, searchUsers);
router.get('/:id', protect, authorizeBoth, getUserById);
router.put('/deactivate', protect, deactivateAccount);

module.exports = router;
