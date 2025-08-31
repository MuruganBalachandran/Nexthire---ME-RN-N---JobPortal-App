const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['application', 'job', 'profile', 'message', 'interview', 'system'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxLength: [500, 'Message cannot exceed 500 characters']
  },
  read: {
    type: Boolean,
    default: false
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'onModel'
  },
  onModel: {
    type: String,
    enum: ['Job', 'Application', 'User']
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, read: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
