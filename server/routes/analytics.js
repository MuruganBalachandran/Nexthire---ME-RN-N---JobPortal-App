const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getUserAnalytics,
  getJobAnalytics,
  getApplicationAnalytics
} = require('../controllers/analytics');

router.get('/user', protect, getUserAnalytics);
router.get('/jobs', protect, getJobAnalytics);
router.get('/applications', protect, getApplicationAnalytics);

module.exports = router;
