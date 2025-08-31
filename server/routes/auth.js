const express = require('express');
const router = express.Router();
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { 
  registerValidation, 
  loginValidation, 
  passwordResetValidation,
  passwordChangeValidation,
  profileValidation,
  handleValidationErrors 
} = require('../utils/validation');

// @desc    Register user (Step 1)
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { email, password, fullName, userType, phone, location } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      success: false,
      error: 'User already exists with this email'
    });
  }

  // Create user with basic info and isProfileComplete = false
  const user = await User.create({
    email,
    password,
    fullName,
    userType,
    phone,
    location,
    isProfileComplete: false
  });

  if (user) {
    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        userType: user.userType,
        phone: user.phone,
        location: user.location,
        isProfileComplete: user.isProfileComplete,
        createdAt: user.createdAt
      },
      token
    });
  } else {
    res.status(400).json({
      success: false,
      error: 'Invalid user data'
    });
  }
});

// @desc    Complete user profile (Step 2)
// @route   PUT /api/auth/complete-profile
// @access  Private
const completeProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  // Validate user type specific data
  const validationErrors = User.validateUserData(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      error: validationErrors.join(', ')
    });
  }

  // Update user profile
  user.set({
    ...req.body,
    isProfileComplete: true
  });

  await user.save();

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
      company: user.company,
      companyWebsite: user.companyWebsite,
      companyDescription: user.companyDescription,
      avatar: user.avatar,
      isVerified: user.isVerified,
      isProfileComplete: user.isProfileComplete,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email and include password for comparison
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password'
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      error: 'Account is deactivated. Please contact support.'
    });
  }

  // Check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password'
    });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = generateToken(user._id);

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
      company: user.company,
      avatar: user.avatar,
      isVerified: user.isVerified,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    },
    token
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
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

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found with this email'
    });
  }

  // Generate reset token (in a real app, you'd send this via email)
  const resetToken = generateToken(user._id);

  // For demo purposes, we'll return the token
  // In production, you'd send this via email
  res.json({
    success: true,
    message: 'Password reset email sent',
    resetToken // Remove this in production
  });
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({
      success: false,
      error: 'Token and new password are required'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid token'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  // Check current password
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      error: 'Current password is incorrect'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  // In a real app, you might want to blacklist the token
  // For now, we'll just return a success message
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Apply validation middleware to routes
router.post('/register', registerValidation, handleValidationErrors, register);
router.post('/login', loginValidation, handleValidationErrors, login);
router.put('/complete-profile', protect, profileValidation, handleValidationErrors, completeProfile);
router.get('/me', protect, getMe);
router.post('/forgot-password', passwordResetValidation, handleValidationErrors, forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/change-password', protect, passwordChangeValidation, handleValidationErrors, changePassword);
router.post('/logout', protect, logout);

module.exports = router;
