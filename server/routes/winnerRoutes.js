const express = require('express');
const multer = require('multer');
const path = require('path');
const { getMyWinnings, getAllWinners, approveWinner, rejectWinner, markPaid, uploadProof } = require('../controllers/winnerController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|pdf/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error('Only jpeg, jpg, png, and pdf files are allowed'));
    }
  },
});

// User routes
router.get('/my', protect, getMyWinnings);
router.post('/:id/proof', protect, upload.single('proof'), uploadProof);

// Admin routes
router.get('/', protect, adminOnly, getAllWinners);
router.put('/:id/approve', protect, adminOnly, approveWinner);
router.put('/:id/reject', protect, adminOnly, rejectWinner);
router.put('/:id/pay', protect, adminOnly, markPaid);

module.exports = router;
