const express = require('express');
const { getMyScores, addScore, updateScore, deleteScore, getAllScores } = require('../controllers/scoreController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// User routes
router.get('/my', protect, getMyScores);
router.post('/', protect, addScore);

// Admin routes
router.get('/all', protect, adminOnly, getAllScores);
router.put('/:id', protect, adminOnly, updateScore);
router.delete('/:id', protect, adminOnly, deleteScore);

module.exports = router;
