const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const passport = require('passport');

const router = express.Router();

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '24h' }
  );
};

// Create admin user (for development/testing only)
router.post('/admin/create', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Username, email, and password are required' 
      });
    }
    
    // Check if admin user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      return res.status(400).json({ 
        success: false,
        message: 'User with this email already exists' 
      });
    }
    
    // Create new admin user
    user = new User({
      username: username.trim(),
      email: email.trim(),
      password: password,
      provider: 'local',
      role: 'admin'
    });
    
    await user.save();
    
    // Generate token
    const token = generateToken(user);
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        provider: user.provider,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Admin user creation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during admin user creation' 
    });
  }
});

// Guest login
router.post('/guest', async (req, res) => {
  try {
    const { username } = req.body;
    
    // Validate username
    if (!username || username.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Username is required' 
      });
    }
    
    // Validate username length
    if (username.trim().length > 20) {
      return res.status(400).json({ 
        success: false,
        message: 'Username must be less than 20 characters' 
      });
    }
    
    // Check if guest user already exists
    let user = await User.findOne({ 
      username: username.trim(), 
      provider: 'guest' 
    });
    
    if (!user) {
      // Create new guest user
      user = new User({
        username: username.trim(),
        provider: 'guest'
      });
      
      await user.save();
    }
    
    // Update last seen
    user.lastSeen = Date.now();
    await user.save();
    
    // Generate token
    const token = generateToken(user);
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        provider: user.provider
      }
    });
  } catch (error) {
    console.error('Guest login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during guest login' 
    });
  }
});

// Google OAuth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = generateToken(req.user);
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?token=${token}`);
  }
);

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email']
}));

router.get('/facebook/callback',
  passport.authenticate('facebook', { session: false }),
  (req, res) => {
    const token = generateToken(req.user);
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?token=${token}`);
  }
);

module.exports = router;
