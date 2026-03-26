const express = require('express');
const { getMySubscription, createSubscription, cancelSubscription, getAllSubscriptions } = require('../controllers/subscriptionController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// User routes
router.get('/my', protect, getMySubscription);
router.post('/', protect, createSubscription);
router.put('/:id/cancel', protect, cancelSubscription);

// Admin routes
router.get('/', protect, adminOnly, getAllSubscriptions);

module.exports = router;
