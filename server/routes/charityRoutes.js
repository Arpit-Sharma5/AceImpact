const express = require('express');
const { getAllCharities, getCharityById, createCharity, updateCharity, deleteCharity, getAllCharitiesAdmin } = require('../controllers/charityController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Admin route (must be BEFORE /:id to avoid conflict)
router.get('/admin/all', protect, adminOnly, getAllCharitiesAdmin);

// Public routes
router.get('/', getAllCharities);

// Admin write routes
router.post('/', protect, adminOnly, createCharity);
router.put('/:id', protect, adminOnly, updateCharity);
router.delete('/:id', protect, adminOnly, deleteCharity);

// Public single charity (after admin routes)
router.get('/:id', getCharityById);

module.exports = router;
