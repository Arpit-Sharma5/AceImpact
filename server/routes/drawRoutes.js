const express = require('express');
const { runDraw, publishDraw, getAllDraws, getDrawById } = require('../controllers/drawController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Public/User routes
router.get('/', protect, getAllDraws);
router.get('/:id', protect, getDrawById);

// Admin routes
router.post('/run', protect, adminOnly, runDraw);
router.put('/:id/publish', protect, adminOnly, publishDraw);

module.exports = router;
