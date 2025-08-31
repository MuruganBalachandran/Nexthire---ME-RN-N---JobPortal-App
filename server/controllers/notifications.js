const Notification = require('../models/Notification');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get user notifications
// @route   GET /api/notifications
exports.getNotifications = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 20, type, read } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = { recipient: req.user._id };
    
    if (type) {
      query.type = type;
    }
    
    if (read !== undefined) {
      query.read = read === 'true';
    }

    const notifications = await Notification.find(query)
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit))
      .populate('relatedId');

    const total = await Notification.countDocuments(query);

    res.json({
      success: true,
      data: notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

// @desc    Create notification
// @route   POST /api/notifications
exports.createNotification = asyncHandler(async (req, res) => {
  try {
    const { recipient, type, title, message, relatedId, onModel, metadata } = req.body;

    const notification = await Notification.create({
      recipient,
      type,
      title,
      message,
      relatedId,
      onModel,
      metadata
    });

    // Here you would typically emit a socket event for real-time notifications
    // io.to(recipient).emit('notification', notification);

    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
exports.markAsRead = asyncHandler(async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    notification.read = true;
    await notification.save();

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
exports.markAllAsRead = asyncHandler(async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
exports.deleteNotification = asyncHandler(async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    await notification.remove();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

// Explicitly export all handlers for correct property access
module.exports = {
  getNotifications: exports.getNotifications,
  createNotification: exports.createNotification,
  markAsRead: exports.markAsRead,
  markAllAsRead: exports.markAllAsRead,
  deleteNotification: exports.deleteNotification
};
