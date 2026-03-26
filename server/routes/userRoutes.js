const express = require('express');
const { getAllUsers, updateUser, deleteUser, updateProfile } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// User route – update own profile
router.put('/profile', protect, updateProfile);

// Admin routes
router.get('/', protect, adminOnly, getAllUsers);
router.put('/:id', protect, adminOnly, updateUser);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
