const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage for profile pictures
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'profile-pics',
        allowed_formats: ['jpg', 'png', 'gif', 'jpeg'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Storage for resumes
const resumeStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'resumes',
        allowed_formats: ['pdf', 'doc', 'docx'],
        resource_type: 'raw',
        public_id: (req, file) => {
            const timestamp = Date.now();
            const originalName = file.originalname.split('.')[0];
            return `${originalName}_${timestamp}`;
        }
    }
});

const uploadResume = multer({
    storage: resumeStorage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Storage for company logos
const logoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'company-logos',
        allowed_formats: ['jpg', 'png', 'gif', 'jpeg'],
        transformation: [{ width: 200, height: 200, crop: 'fit' }]
    }
});

const uploadLogo = multer({
    storage: logoStorage,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

module.exports = { cloudinary, upload, uploadResume, uploadLogo };