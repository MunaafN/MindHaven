import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { protect } from '../middleware/auth';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', {
      body: req.body,
      headers: req.headers,
      method: req.method,
      url: req.url
    });
    
    const { name, email, password } = req.body;
    
    console.log('Extracted fields:', { name, email, password: password ? '[HIDDEN]' : 'undefined' });
    
    // Validate input
    if (!name || !email || !password) {
      console.log('Validation failed:', { hasName: !!name, hasEmail: !!email, hasPassword: !!password });
      return res.status(400).json({ error: 'Please provide all required fields' });
    }
    
    // Check if user exists in MongoDB
    console.log('Checking if user exists...');
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', existingUser.email);
      return res.status(400).json({ error: 'User already exists' });
    }
    console.log('No existing user found, creating new user...');
    
    // Create new user in MongoDB
    const user = new User({
      name,
      email,
      password
    });
    
    console.log('User object created, attempting to save...');
    await user.save();
    console.log('User saved successfully:', user._id);
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );
    
    // Return user data without password and token
    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }
    
    console.log(`Login attempt: ${email}`);
    
    // Find user in MongoDB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Compare password using bcrypt
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log(`Successful login: ${email}`);
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );
    
    // Return user and token
    res.json({
      user: { 
        id: user._id,
        name: user.name, 
        email: user.email 
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Google OAuth
router.get('/google', (req, res, next) => {
  console.log('Initiating Google OAuth login');
  console.log('Request URL:', req.url);
  console.log('Request path:', req.path);
  console.log('Request originalUrl:', req.originalUrl);
  console.log('Request headers:', req.headers);
  console.log('Request method:', req.method);
  
  // Test if we can access this route directly
  if (req.query.test === 'true') {
    return res.json({ 
      message: 'Google OAuth route is accessible',
      url: req.url,
      path: req.path,
      originalUrl: req.originalUrl
    });
  }
  
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })(req, res, next);
});

// Google OAuth callback
router.get('/google/callback', 
  (req, res, next) => {
    console.log('Received Google OAuth callback');
    passport.authenticate('google', { 
      failureRedirect: `${process.env.FRONTEND_URL}/login?error=authentication_failed`,
      session: true // Enable session
    })(req, res, next);
  },
  async (req, res) => {
    try {
      console.log('Processing Google OAuth callback');
      const user = req.user as any;
      
      if (!user || !user.id) {
        console.error('Failed to get user ID from user object:', user);
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=authentication_failed`);
      }
      
      console.log('Generating JWT token for user:', user.id);
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '30d' }
      );
      
      // Redirect to OAuth success page with token in URL
      res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
    } catch (error) {
      console.error('Error in Google callback:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
  }
);

// Get current user from token
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user?.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return user data without password
    res.json({
      id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify token endpoint
router.get('/verify-token', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 