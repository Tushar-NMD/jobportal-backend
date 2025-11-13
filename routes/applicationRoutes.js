const express = require('express');
const { applyForJob, getMyApplications } = require('../controllers/applicationController');
const { protectUser } = require('../middleware/authMiddleware');
const { uploadResume } = require('../config/cloudinary');

const router = express.Router();

// User applies for job
router.post('/:jobId', protectUser, uploadResume.single('resume'), applyForJob);

// User gets their applications
router.get('/my-applications', protectUser, getMyApplications);

module.exports = router;
