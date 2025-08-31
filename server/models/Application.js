const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job is required']
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Applicant is required']
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'shortlisted', 'interviewed', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  coverLetter: {
    type: String,
    required: [true, 'Cover letter is required'],
    trim: true,
    maxlength: [2000, 'Cover letter cannot exceed 2000 characters']
  },
  expectedSalary: {
    amount: {
      type: Number,
      required: [true, 'Expected salary is required']
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
    required: [true, 'Experience is required'],
    trim: true,
    maxlength: [500, 'Experience cannot exceed 500 characters']
  },
  resume: {
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    uploadedAt: Date
  },
  additionalDocuments: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    uploadedAt: Date,
    type: String // e.g., 'portfolio', 'certificate', 'reference'
  }],
  recruiterNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Recruiter notes cannot exceed 1000 characters'],
    select: false // Only visible to recruiters
  },
  interviewSchedule: {
    scheduledAt: Date,
    duration: Number, // in minutes
    type: {
      type: String,
      enum: ['phone', 'video', 'onsite', 'technical']
    },
    location: String,
    notes: String
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'shortlisted', 'interviewed', 'accepted', 'rejected', 'withdrawn']
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  }],
  isWithdrawn: {
    type: Boolean,
    default: false
  },
  withdrawnAt: Date,
  withdrawnReason: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted expected salary
applicationSchema.virtual('formattedExpectedSalary').get(function() {
  const { amount, currency, period } = this.expectedSalary;
  return `${currency} ${amount.toLocaleString()} per ${period}`;
});

// Virtual for application duration
applicationSchema.virtual('applicationDuration').get(function() {
  const now = new Date();
  const applied = this.createdAt;
  const diffTime = Math.abs(now - applied);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day';
  if (diffDays < 7) return `${diffDays} days`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks`;
  return `${Math.floor(diffDays / 30)} months`;
});

// Virtual for status color (for UI)
applicationSchema.virtual('statusColor').get(function() {
  const statusColors = {
    pending: '#FFA500',
    reviewing: '#4169E1',
    shortlisted: '#32CD32',
    interviewed: '#9370DB',
    accepted: '#008000',
    rejected: '#FF0000',
    withdrawn: '#808080'
  };
  return statusColors[this.status] || '#FFA500';
});

// Indexes for better query performance
applicationSchema.index({ job: 1 });
applicationSchema.index({ applicant: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ createdAt: -1 });
applicationSchema.index({ 'interviewSchedule.scheduledAt': 1 });

// Compound indexes
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true }); // Prevent duplicate applications
applicationSchema.index({ applicant: 1, status: 1 });
applicationSchema.index({ job: 1, status: 1 });

// Pre-save middleware to update status history
applicationSchema.pre('save', function(next) {
  // If status has changed, add to history
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date(),
      changedBy: this.updatedBy || this.applicant, // Default to applicant if not specified
      notes: this.statusChangeNotes
    });
    
    // Clear temporary fields
    delete this.updatedBy;
    delete this.statusChangeNotes;
  }
  
  // If application is withdrawn, update withdrawn fields
  if (this.isModified('isWithdrawn') && this.isWithdrawn) {
    this.withdrawnAt = new Date();
    this.status = 'withdrawn';
  }
  
  next();
});

// Post-save middleware to update job applications count
applicationSchema.post('save', async function() {
  try {
    const Job = mongoose.model('Job');
    const job = await Job.findById(this.job);
    
    if (job) {
      const applicationsCount = await mongoose.model('Application').countDocuments({
        job: this.job,
        status: { $ne: 'withdrawn' }
      });
      
      job.applicationsCount = applicationsCount;
      await job.save();
    }
  } catch (error) {
    console.error('Error updating job applications count:', error);
  }
});

// Static method to get applications with filters
applicationSchema.statics.getApplications = function(filters = {}) {
  const query = {};
  
  if (filters.jobId) {
    query.job = filters.jobId;
  }
  
  if (filters.applicantId) {
    query.applicant = filters.applicantId;
  }
  
  if (filters.status) {
    query.status = filters.status;
  }
  
  if (filters.recruiterId) {
    // Get applications for jobs posted by this recruiter
    query['job'] = { $in: filters.recruiterJobIds };
  }
  
  return this.find(query)
    .populate('job', 'title company location type salary')
    .populate('applicant', 'fullName email phone location skills experience')
    .sort({ createdAt: -1 });
};

// Instance method to update status
applicationSchema.methods.updateStatus = function(newStatus, changedBy, notes = '') {
  this.status = newStatus;
  this.updatedBy = changedBy;
  this.statusChangeNotes = notes;
  return this.save();
};

// Instance method to withdraw application
applicationSchema.methods.withdraw = function(reason = '') {
  this.isWithdrawn = true;
  this.withdrawnReason = reason;
  this.status = 'withdrawn';
  return this.save();
};

module.exports = mongoose.model('Application', applicationSchema);
