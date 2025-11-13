const express = require('express');
const {
    updateApplicationStatus,
    getAllApplicationsForAdmin,
    updateApplicationStatusNoEmail
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all applications for admin's jobs
router.get('/', protect, getAllApplicationsForAdmin);

// Admin updates application status (with email)
router.put('/:applicationId/status', protect, updateApplicationStatus);

// Admin updates application status (no email)
router.put('/:applicationId/status-no-email', protect, updateApplicationStatusNoEmail);

module.exports = router;