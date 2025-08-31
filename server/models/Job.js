const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters']
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Job location is required'],
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  type: {
    type: String,
    required: [true, 'Job type is required'],
    enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
    default: 'full-time'
  },
  remote: {
    type: Boolean,
    default: false
  },
  salary: {
    min: {
      type: Number,
      required: [true, 'Minimum salary is required']
    },
    max: {
      type: Number,
      required: [true, 'Maximum salary is required']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
    },
    period: {
      type: String,
      default: 'yearly',
      enum: ['hourly', 'daily', 'weekly', 'monthly', 'yearly']
    }
  },
  experience: {
    type: String,
    required: [true, 'Experience level is required'],
    enum: ['entry', 'junior', 'mid-level', 'senior', 'lead', 'executive']
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  requirements: [{
    type: String,
    trim: true,
    maxlength: [200, 'Requirement cannot exceed 200 characters']
  }],
  responsibilities: [{
    type: String,
    trim: true,
    maxlength: [200, 'Responsibility cannot exceed 200 characters']
  }],
  benefits: [{
    type: String,
    trim: true,
    maxlength: [200, 'Benefit cannot exceed 200 characters']
  }],
  skills: [{
    type: String,
    trim: true,
    maxlength: [50, 'Skill cannot exceed 50 characters']
  }],
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recruiter is required']
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'closed', 'draft'],
    default: 'active'
  },
  applicationsCount: {
    type: Number,
    default: 0
  },
  viewsCount: {
    type: Number,
    default: 0
  },
  deadline: {
    type: Date,
    default: function() {
      // Default deadline is 30 days from posting
      const date = new Date();
      date.setDate(date.getDate() + 30);
      return date;
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isUrgent: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted salary
jobSchema.virtual('formattedSalary').get(function() {
  const salary = this.salary || {};
  const { min, max, currency = 'USD', period = 'yearly' } = salary;
  
  // Handle cases where min or max might be undefined
  if (typeof min !== 'number' || typeof max !== 'number') {
    return 'Salary not specified';
  }
  
  try {
    return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()} per ${period}`;
  } catch (error) {
    console.error('Error formatting salary:', error);
    return 'Salary not specified';
  }
});

// Virtual for time since posting
jobSchema.virtual('timeSincePosted').get(function() {
  const now = new Date();
  const posted = this.createdAt;
  const diffTime = Math.abs(now - posted);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
});

// Virtual for application rate
jobSchema.virtual('applicationRate').get(function() {
  if (this.viewsCount === 0) return 0;
  return ((this.applicationsCount / this.viewsCount) * 100).toFixed(1);
});

// Indexes for better query performance
jobSchema.index({ title: 'text', description: 'text', company: 'text' });
jobSchema.index({ location: 1 });
jobSchema.index({ type: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ recruiter: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ 'salary.min': 1, 'salary.max': 1 });
jobSchema.index({ tags: 1 });
jobSchema.index({ isUrgent: 1, isFeatured: 1 });

// Pre-save middleware to update tags
jobSchema.pre('save', function(next) {
  // Auto-generate tags from title and skills
  const titleWords = this.title.toLowerCase().split(' ');
  const skillWords = this.skills ? this.skills.map(skill => skill.toLowerCase()) : [];
  const allWords = [...titleWords, ...skillWords];
  
  // Filter out common words and create unique tags
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  this.tags = [...new Set(allWords.filter(word => 
    word.length > 2 && !commonWords.includes(word)
  ))].slice(0, 10); // Limit to 10 tags
  
  next();
});

// Static method to search jobs
jobSchema.statics.searchJobs = function(filters = {}) {
  const query = { status: 'active' };
  
  if (filters.search) {
    query.$text = { $search: filters.search };
  }
  
  if (filters.location) {
    query.location = { $regex: filters.location, $options: 'i' };
  }
  
  if (filters.type) {
    query.type = filters.type;
  }
  
  if (filters.remote !== undefined) {
    query.remote = filters.remote;
  }
  
  if (filters.experience) {
    query.experience = filters.experience;
  }
  
  if (filters.minSalary) {
    query['salary.max'] = { $gte: filters.minSalary };
  }
  
  if (filters.maxSalary) {
    query['salary.min'] = { $lte: filters.maxSalary };
  }
  
  if (filters.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags.map(tag => tag.toLowerCase()) };
  }
  
  return this.find(query);
};

module.exports = mongoose.model('Job', jobSchema);
