const gemini = require('../services/geminiService');

const isMissing = (v) => v === undefined || v === null || v === '';

// POST /api/ai/workout-recommendation
exports.workoutRecommendation = async (req, res, next) => {
  try {
    const { age, fitnessGoal, experience } = req.body;
    if ([age, fitnessGoal, experience].some(isMissing)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide age, fitnessGoal and experience',
      });
    }
    const recommendation = await gemini.getWorkoutRecommendation({ age, fitnessGoal, experience });
    res.status(200).json({ recommendation });
  } catch (error) {
    next(error);
  }
};

// POST /api/ai/fitness-insights
exports.fitnessInsights = async (req, res, next) => {
  try {
    const { totalWorkouts, averageDuration, totalCaloriesBurned } = req.body;
    if ([totalWorkouts, averageDuration, totalCaloriesBurned].some(isMissing)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide totalWorkouts, averageDuration and totalCaloriesBurned',
      });
    }
    const insight = await gemini.getFitnessInsights({
      totalWorkouts,
      averageDuration,
      totalCaloriesBurned,
    });
    res.status(200).json({ insight });
  } catch (error) {
    next(error);
  }
};
