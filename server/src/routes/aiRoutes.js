const express = require('express');
const { workoutRecommendation, fitnessInsights } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/workout-recommendation', workoutRecommendation);
router.post('/fitness-insights', fitnessInsights);

module.exports = router;
