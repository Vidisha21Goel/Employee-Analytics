const express = require('express');
const router = express.Router();
const { signup, login, getProfile, getUsers } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// POST /api/auth/signup - Register new user
router.post('/signup', signup);

// POST /api/auth/login - Login user
router.post('/login', login);

// GET /api/auth/profile - Get current user (Protected)
router.get('/profile', protect, getProfile);

// GET /api/auth/users - Get all users (Admin only)
router.get('/users', protect, adminOnly, getUsers);

module.exports = router;

