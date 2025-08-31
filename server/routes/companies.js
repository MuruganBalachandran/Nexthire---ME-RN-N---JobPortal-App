const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createCompany,
  updateCompany,
  getCompany,
  deleteCompany,
  uploadDocument,
  updateMetrics
} = require('../controllers/companies');

router.post('/', protect, upload.fields([{ name: 'logo', maxCount: 1 }]), createCompany);
router.put('/:id', protect, upload.fields([{ name: 'logo', maxCount: 1 }]), updateCompany);
router.get('/:id', getCompany);
router.delete('/:id', protect, deleteCompany);
router.post('/:id/documents', protect, upload.fields([{ name: 'document', maxCount: 1 }]), uploadDocument);
router.patch('/:id/metrics', protect, updateMetrics);

module.exports = router;
