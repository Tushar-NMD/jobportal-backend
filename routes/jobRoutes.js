const express = require('express');
const { createJob, getAllJobs, getMyJobs } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const { uploadLogo } = require('../config/cloudinary');
const { getJobApplications } = require('../controllers/applicationController');

const router = express.Router();

router.post('/', protect, uploadLogo.single('companyLogo'), createJob);
router.post('/no-logo', protect, createJob);
router.get('/', protect, getAllJobs);
router.get('/my-jobs', protect, getMyJobs);
router.get('/:jobId/applications', protect, getJobApplications);

module.exports = router;



















