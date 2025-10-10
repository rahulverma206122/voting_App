const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { jwtAuthMiddleware, generateToken } = require('../jwt');

// ✅ REGISTER (Signup)
router.post('/signup', async (req, res) => {
  try {
    const data = req.body;

    // Validate required fields
    const requiredFields = ['name', 'age', 'address', 'aadharCardNumber', 'password'];
    for (let field of requiredFields) {
      if (!data[field]) {
        return res.status(400).json({ success: false, error: `${field} is required` });
      }
    }

    // Only allow 12-digit Aadhaar
    if (!/^\d{12}$/.test(data.aadharCardNumber)) {
      return res.status(400).json({ success: false, error: 'Aadhar Card Number must be exactly 12 digits' });
    }

    // Prevent duplicate Aadhar
    const existingUser = await User.findOne({ aadharCardNumber: data.aadharCardNumber });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User with this Aadhar already exists' });
    }

    // Only one admin allowed
    if (data.role === 'admin') {
      const adminUser = await User.findOne({ role: 'admin' });
      if (adminUser) {
        return res.status(400).json({ success: false, error: 'Admin user already exists' });
      }
    }

    // Save user
    const newUser = new User(data);
    const response = await newUser.save();

    // Generate token
    const payload = { id: response.id };
    const token = generateToken(payload);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: { id: response.id, name: response.name, role: response.role },
      token,
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


// ✅ LOGIN
router.post('/login', async (req, res) => {
  try {
    const { aadharCardNumber, password } = req.body;

    if (!aadharCardNumber || !password) {
      return res.status(400).json({ success: false, error: 'Aadhar Card Number and password are required' });
    }

    const user = await User.findOne({ aadharCardNumber });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid Aadhar or Password' });
    }

    const payload = { id: user.id };
    const token = generateToken(payload);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


// ✅ GET PROFILE
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


// ✅ UPDATE PASSWORD
router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Both current and new passwords are required' });
    }

    const user = await User.findById(userId);
    if (!user || !(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, error: 'Invalid current password' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
