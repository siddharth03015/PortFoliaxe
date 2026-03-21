const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getProfile, updateProfile, uploadResume, getResume } = require('../controllers/profileController');
const authMiddleware = require('../middleware/auth');

// Multer config for resume uploads
const uploadsDir = path.join(__dirname, '..', 'uploads', 'resumes');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = `${req.user.id}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed.'), false);
    }
  },
});

// Public routes
router.get('/:username', getProfile);
router.get('/:username/resume', getResume);

// Authenticated routes
router.put('/', authMiddleware, updateProfile);
router.post('/resume', authMiddleware, upload.single('resume'), uploadResume);

module.exports = router;
