const User = require('../models/User');
const { generateToken } = require('../services/jwtService');

const sendAuthResponse = (user, statusCode, res) => {
  res.status(statusCode).json({
    success: true,
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, email: user.email },
  });
};

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide name, email and password' });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });
    sendAuthResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    sendAuthResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/profile
exports.getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    user: { id: req.user._id, name: req.user.name, email: req.user.email },
  });
};
