import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { getUsers, getUserById, getUserByUsername, getUserByEmail, saveUser } from '../data/db.js';
import { protect, JWT_SECRET } from '../middleware/auth.js';

const router = express.Router();

function generateToken(id) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
}

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, name, email, password, avatar, bio } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    if (getUserByUsername(username)) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    if (getUserByEmail(email)) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: uuidv4(),
      username: username.toLowerCase().trim(),
      name: name || username,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      bio: bio || '',
      website: '',
      followers: [],
      following: [],
      savedPosts: [],
      createdAt: new Date().toISOString()
    };

    saveUser(newUser);

    const { password: _, ...userSafe } = newUser;
    const token = generateToken(newUser.id);

    res.status(201).json({
      user: userSafe,
      token
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  try {
    const { loginIdentifier, password } = req.body; // Can be username or email

    if (!loginIdentifier || !password) {
      return res.status(400).json({ message: 'Username/Email and password are required' });
    }

    const user = getUserByUsername(loginIdentifier) || getUserByEmail(loginIdentifier);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { password: _, ...userSafe } = user;
    const token = generateToken(user.id);

    res.json({
      user: userSafe,
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user });
});

// @route   GET /api/auth/demo-users
// @desc    Get list of demo accounts for quick testing
router.get('/demo-users', (req, res) => {
  const users = getUsers().map(u => ({
    id: u.id,
    username: u.username,
    name: u.name,
    avatar: u.avatar,
    bio: u.bio
  }));
  res.json(users);
});

export default router;
