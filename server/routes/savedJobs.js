const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  saveJob,
  unsaveJob,
  getSavedJobs,
  checkSavedStatus
} = require('../controllers/savedJobs');

router.post('/', protect, saveJob);
router.delete('/:jobId', protect, unsaveJob);
router.get('/', protect, getSavedJobs);
router.get('/:jobId/check', protect, checkSavedStatus);

module.exports = router;
