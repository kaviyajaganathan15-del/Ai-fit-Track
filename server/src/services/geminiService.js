const { GoogleGenerativeAI } = require('@google/generative-ai');

const getModel = () => {
  if (!process.env.GEMINI_API_KEY) {
    const err = new Error('GEMINI_API_KEY is not configured in the .env file');
    err.statusCode = 500;
    throw err;
  }
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  });
};

const generate = async (prompt) => {
  try {
    const model = getModel();
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    if (error.statusCode) throw error;
    const err = new Error(`Gemini AI request failed: ${error.message}`);
    err.statusCode = 502;
    throw err;
  }
};

const getWorkoutRecommendation = async ({ age, fitnessGoal, experience }) => {
  const prompt = `You are a certified fitness coach. Create a personalized workout recommendation for a ${age}-year-old
user whose fitness goal is "${fitnessGoal}" and whose experience level is "${experience}".
Include: a weekly workout plan, suggested exercises (with sets/reps or durations), a
Beginner/Intermediate/Advanced appropriate progression, short motivational guidance, and safety tips.
Keep the answer concise and use plain text (no markdown symbols).`;
  return generate(prompt);
};

const getFitnessInsights = async ({ totalWorkouts, averageDuration, totalCaloriesBurned }) => {
  const prompt = `You are a fitness analyst. A user has completed ${totalWorkouts} workouts, averaging
${averageDuration} minutes each, and burned a total of ${totalCaloriesBurned} calories.
Provide a short performance analysis, improvement suggestions, motivational advice and a brief
fitness progress summary. Keep it under 120 words, plain text, no markdown symbols.`;
  return generate(prompt);
};

module.exports = { getWorkoutRecommendation, getFitnessInsights };
