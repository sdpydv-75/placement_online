const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Ensure upload dir exists safely (Vercel friendly)
const uploadDir = 'uploads/';
try {
    if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir, { recursive: true });
    }
} catch (err) {
    console.warn('Could not create uploads directory (expected on some serverless providers):', err.message);
}

// Mongoose-friendly storage generator
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir); 
  },
  filename(req, file, cb) {
    cb(null, `resume-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Enforce safe documents only
function checkFileType(file, cb) {
  const filetypes = /pdf|doc|docx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Resumes must be PDF or Word documents!'));
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // Generous 5MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

// Photo-friendly storage generator
const photoStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir); 
  },
  filename(req, file, cb) {
    cb(null, `photo-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

function checkPhotoType(file, cb) {
  const filetypes = /jpeg|jpg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Profile photos must be JPEG, PNG, or WebP images!'));
  }
}

const uploadPhoto = multer({
  storage: photoStorage,
  limits: { fileSize: 3000000 }, // 3MB limit
  fileFilter: function (req, file, cb) {
    checkPhotoType(file, cb);
  }
});

// @desc    Upload user local resume document
// @route   POST /api/v1/upload/resume
// @access  Private (Students)
router.post('/resume', protect, authorize('student'), (req, res) => {
  upload.single('resume')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
    
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please submit a valid document' });
    }

    res.status(200).json({
      success: true,
      data: `/uploads/${req.file.filename}`
    });
  });
});

// @desc    Upload user profile photo
// @route   POST /api/v1/upload/photo
// @access  Private
router.post('/photo', protect, (req, res) => {
  uploadPhoto.single('photo')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
    
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please submit a valid image file' });
    }

    res.status(200).json({
      success: true,
      data: `/uploads/${req.file.filename}`
    });
  });
});

module.exports = router;
