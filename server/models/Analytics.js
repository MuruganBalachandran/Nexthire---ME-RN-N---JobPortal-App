const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['job', 'application', 'profile', 'company'],
    required: true
  },
  metrics: {
    views: { type: Number, default: 0 },
    applications: { type: Number, default: 0 },
    interviews: { type: Number, default: 0 },
    offers: { type: Number, default: 0 },
    rejections: { type: Number, default: 0 },
    saved: { type: Number, default: 0 }
  },
  timeframe: {
    start: Date,
    end: Date
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
analyticsSchema.index({ user: 1, type: 1, 'timeframe.start': 1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
