const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  userType: {
    type: String,
    required: [true, 'User type is required'],
    enum: ['jobseeker', 'recruiter'],
    default: 'jobseeker'
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  
  // Jobseeker specific fields
  skills: [{
    type: String,
    trim: true
  }],
  experience: {
    type: String,
    trim: true,
    maxlength: [50, 'Experience cannot exceed 50 characters']
  },
  education: {
    type: String,
    trim: true,
    maxlength: [200, 'Education cannot exceed 200 characters']
  },
  resume: {
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    uploadedAt: Date
  },
  
  // Recruiter specific fields
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  companyWebsite: {
    type: String,
    trim: true,
    maxlength: [200, 'Website URL cannot exceed 200 characters']
  },
  companyDescription: {
    type: String,
    trim: true,
    maxlength: [500, 'Company description cannot exceed 500 characters']
  },
  position: {
    type: String,
    trim: true,
    maxlength: [100, 'Position cannot exceed 100 characters']
  },
  
  // Common fields
  avatar: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for user type specific validation
userSchema.virtual('isJobseeker').get(function() {
  return this.userType === 'jobseeker';
});

userSchema.virtual('isRecruiter').get(function() {
  return this.userType === 'recruiter';
});

userSchema.index({ userType: 1 });
userSchema.index({ location: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Static method to validate user type specific fields
userSchema.statics.validateUserData = function(userData) {
  const errors = [];
  
  // Validation for profile completion, not initial signup
  if (userData.isProfileComplete) {
    if (userData.userType === 'jobseeker') {
      if (!userData.skills && !userData.experience) {
        errors.push('Jobseekers should provide skills or experience');
      }
    } else if (userData.userType === 'recruiter') {
      if (!userData.company) {
        errors.push('Recruiters must provide company information');
      }
    }
  }
  
  return errors;
};

module.exports = mongoose.model('User', userSchema);
