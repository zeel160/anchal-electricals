const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// @POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: 'Provide email and password' });
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  res.json({ success: true, token: signToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

// @POST /api/auth/register (admin only after first user)
router.post('/register', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @POST /api/auth/setup - First-time admin creation (only if no users exist)
router.post('/setup', async (req, res) => {
  const count = await User.countDocuments();
  if (count > 0) return res.status(403).json({ success: false, message: 'Setup already done' });
  try {
    const user = await User.create({ ...req.body, role: 'admin' });
    res.status(201).json({ success: true, token: signToken(user._id), message: 'Admin created' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @GET /api/auth/me
router.get('/me', protect, (req, res) => res.json({ success: true, user: req.user }));

module.exports = router;
