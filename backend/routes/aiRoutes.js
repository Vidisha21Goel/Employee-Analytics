const express = require('express');
const router = express.Router();
const { getRecommendation, rankAllEmployees } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/ai/recommend - Get AI recommendation for a single employee
router.post('/recommend', protect, getRecommendation);

// POST /api/ai/rank-all - Get AI ranking for all employees
router.post('/rank-all', protect, rankAllEmployees);

module.exports = router;
