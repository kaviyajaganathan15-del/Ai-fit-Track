const mongoose = require('mongoose');
const Workout = require('../models/Workout');

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const findOwnedWorkout = async (id, userId) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Workout.findOne({ _id: id, user: userId });
};

// POST /api/workouts
exports.addWorkout = async (req, res, next) => {
  try {
    const { workoutName, category, duration, caloriesBurned, workoutDate } = req.body;
    const workout = await Workout.create({
      workoutName,
      category,
      duration,
      caloriesBurned,
      workoutDate,
      user: req.user._id,
    });
    res.status(201).json({ success: true, data: workout });
  } catch (error) {
    next(error);
  }
};

// GET /api/workouts
exports.getWorkouts = async (req, res, next) => {
  try {
    const workouts = await Workout.find({ user: req.user._id }).sort({ workoutDate: -1 });
    res.status(200).json({ success: true, count: workouts.length, data: workouts });
  } catch (error) {
    next(error);
  }
};

// GET /api/workouts/search?name=&category=&date=YYYY-MM-DD
exports.searchWorkouts = async (req, res, next) => {
  try {
    const { name, category, date } = req.query;
    const filter = { user: req.user._id };

    if (name) filter.workoutName = { $regex: escapeRegex(name), $options: 'i' };
    if (category) filter.category = { $regex: `^${escapeRegex(category)}$`, $options: 'i' };
    if (date) {
      const start = new Date(date);
      if (isNaN(start.getTime())) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid date. Use format YYYY-MM-DD' });
      }
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setUTCDate(end.getUTCDate() + 1);
      filter.workoutDate = { $gte: start, $lt: end };
    }

    const workouts = await Workout.find(filter).sort({ workoutDate: -1 });
    res.status(200).json({ success: true, count: workouts.length, data: workouts });
  } catch (error) {
    next(error);
  }
};

// GET /api/workouts/:id
exports.getWorkoutById = async (req, res, next) => {
  try {
    const workout = await findOwnedWorkout(req.params.id, req.user._id);
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }
    res.status(200).json({ success: true, data: workout });
  } catch (error) {
    next(error);
  }
};

// PUT /api/workouts/:id
exports.updateWorkout = async (req, res, next) => {
  try {
    const workout = await findOwnedWorkout(req.params.id, req.user._id);
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }

    const fields = ['workoutName', 'category', 'duration', 'caloriesBurned', 'workoutDate'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) workout[f] = req.body[f];
    });

    await workout.save(); // runs schema validators
    res.status(200).json({ success: true, data: workout });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/workouts/:id
exports.deleteWorkout = async (req, res, next) => {
  try {
    const workout = await findOwnedWorkout(req.params.id, req.user._id);
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }
    await workout.deleteOne();
    res.status(200).json({ success: true, message: 'Workout removed successfully' });
  } catch (error) {
    next(error);
  }
};
