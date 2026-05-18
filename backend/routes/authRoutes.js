const express = require('express');
const router = express.Router();
const { signup, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/auth/signup - Register new user
router.post('/signup', signup);

// POST /api/auth/login - Login user
router.post('/login', login);

// GET /api/auth/profile - Get current user (Protected)
router.get('/profile', protect, getProfile);

module.exports = router;
