import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'skillswap_super_secret_jwt_key_2026_peer_exchange',
    { expiresIn: '7d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new student account & store in MongoDB
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, college, major, bio, skillsTeaching, skillsLearning } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required fields.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    // Parse array if received as comma-separated or string
    const parsedTeaching = Array.isArray(skillsTeaching)
      ? skillsTeaching
      : typeof skillsTeaching === 'string' && skillsTeaching.trim()
      ? skillsTeaching.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const parsedLearning = Array.isArray(skillsLearning)
      ? skillsLearning
      : typeof skillsLearning === 'string' && skillsLearning.trim()
      ? skillsLearning.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    // Create user record in MongoDB
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      college: college ? college.trim() : 'University Campus',
      major: major ? major.trim() : 'Undeclared',
      bio: bio ? bio.trim() : 'Excited to learn new skills and share what I know on SkillSwap!',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name.trim())}`,
      skillsTeaching: parsedTeaching,
      skillsLearning: parsedLearning,
      karma: 50,
      badges: ['New Swapper', 'Verified Student'],
    });

    await user.save();
    console.log(`[Auth]  Successfully registered new user in MongoDB: ${user.email} (${user._id})`);

    const token = generateToken(user._id);

    // Return sanitized user object
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      college: user.college,
      major: user.major,
      bio: user.bio,
      avatar: user.avatar,
      karma: user.karma,
      skillsTeaching: user.skillsTeaching,
      skillsLearning: user.skillsLearning,
      rating: user.rating,
      badges: user.badges,
      createdAt: user.createdAt,
    };

    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('[Auth Error] Registration failed:', error);
    res.status(500).json({ message: 'Failed to create account.', error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      college: user.college,
      major: user.major,
      bio: user.bio,
      avatar: user.avatar,
      karma: user.karma,
      skillsTeaching: user.skillsTeaching,
      skillsLearning: user.skillsLearning,
      rating: user.rating,
      badges: user.badges,
      createdAt: user.createdAt,
    };

    res.json({
      message: 'Logged in successfully!',
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('[Auth Error] Login failed:', error);
    res.status(500).json({ message: 'Login failed.', error: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

// @route   PATCH /api/auth/profile
// @desc    Update current user profile
// @access  Private
router.patch('/profile', requireAuth, async (req, res) => {
  try {
    const { name, college, major, bio, skillsTeaching, skillsLearning, avatar } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (college) user.college = college;
    if (major) user.major = major;
    if (bio) user.bio = bio;
    if (avatar) user.avatar = avatar;
    if (skillsTeaching) user.skillsTeaching = skillsTeaching;
    if (skillsLearning) user.skillsLearning = skillsLearning;

    await user.save();

    res.json({
      message: 'Profile updated successfully!',
      user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile.', error: error.message });
  }
});

export default router;
