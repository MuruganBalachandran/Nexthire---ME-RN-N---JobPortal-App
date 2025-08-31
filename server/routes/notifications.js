const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../controllers/notifications');

router.get('/', protect, getNotifications);
router.post('/', protect, createNotification);
router.patch('/:id/read', protect, markAsRead);
router.patch('/read-all', protect, markAllAsRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
