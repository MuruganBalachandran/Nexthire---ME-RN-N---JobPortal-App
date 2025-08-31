const mongoose = require('mongoose');

const savedJobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  savedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    maxLength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate saves
savedJobSchema.index({ user: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('SavedJob', savedJobSchema);
