const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxLength: [100, 'Company name cannot exceed 100 characters']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  logo: {
    url: String,
    publicId: String
  },
  website: {
    type: String,
    trim: true,
    match: [/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/, 'Please enter a valid URL']
  },
  description: {
    type: String,
    required: [true, 'Company description is required'],
    maxLength: [2000, 'Description cannot exceed 2000 characters']
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    trim: true
  },
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
  },
  founded: {
    type: Number,
    min: [1800, 'Founded year must be after 1800'],
    max: [new Date().getFullYear(), 'Founded year cannot be in the future']
  },
  locations: [{
    city: String,
    state: String,
    country: String,
    isPrimary: Boolean
  }],
  socialLinks: {
    linkedin: String,
    twitter: String,
    facebook: String
  },
  benefits: [{
    type: String,
    trim: true
  }],
  culture: {
    values: [String],
    workEnvironment: String,
    technologies: [String]
  },
  metrics: {
    employeeCount: Number,
    jobsPosted: { type: Number, default: 0 },
    activeJobs: { type: Number, default: 0 },
    totalApplications: { type: Number, default: 0 },
    averageResponseTime: { type: Number, default: 0 }
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  documents: [{
    type: {
      type: String,
      enum: ['registration', 'license', 'tax', 'other']
    },
    url: String,
    publicId: String,
    verified: Boolean
  }]
}, {
  timestamps: true
});

// Indexes
companySchema.index({ name: 1 });
companySchema.index({ owner: 1 });
companySchema.index({ industry: 1 });
companySchema.index({ verificationStatus: 1 });
companySchema.index({ 'locations.country': 1, 'locations.state': 1, 'locations.city': 1 });

module.exports = mongoose.model('Company', companySchema);
