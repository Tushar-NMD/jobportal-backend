const express = require('express');
const { upload } = require('../config/cloudinary');
const { registerAdmin, loginAdmin, getAdminProfile, getAdminProfilePic, updateAdminProfilePic, uploadProfilePic } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Private routes
router.get('/profile', protect, getAdminProfile);

router.put('/profile-pic', protect, updateAdminProfilePic);

router.post('/upload-profile-pic', protect, upload.single('profilePic'), uploadProfilePic);
module.exports = router;
