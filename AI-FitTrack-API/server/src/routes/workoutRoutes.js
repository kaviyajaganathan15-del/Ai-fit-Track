const express = require('express');
const {
  addWorkout,
  getWorkouts,
  searchWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
} = require('../controllers/workoutController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/').get(getWorkouts).post(addWorkout);
router.get('/search', searchWorkouts); // must be before '/:id'
router.route('/:id').get(getWorkoutById).put(updateWorkout).delete(deleteWorkout);

module.exports = router;
