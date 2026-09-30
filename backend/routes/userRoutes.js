import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getUsers, getUserById, getUserByUsername, saveUser, getAllPosts, addNotification } from '../data/db.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users
// @desc    Search users or get suggested users
router.get('/', (req, res) => {
  try {
    const { query } = req.query;
    let users = getUsers();

    if (query) {
      const q = query.toLowerCase();
      users = users.filter(u =>
        u.username.toLowerCase().includes(q) ||
        (u.name && u.name.toLowerCase().includes(q))
      );
    }

    // Strip passwords before returning
    const safeUsers = users.map(({ password, ...u }) => u);
    res.json(safeUsers);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving users' });
  }
});

// @route   GET /api/users/:username
// @desc    Get user profile with stats
router.get('/:username', (req, res) => {
  try {
    const user = getUserByUsername(req.params.username);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...safeUser } = user;
    const allPosts = getAllPosts();
    const userPosts = allPosts.filter(p => p.userId === user.id);

    res.json({
      ...safeUser,
      postsCount: userPosts.length,
      followersCount: (safeUser.followers || []).length,
      followingCount: (safeUser.following || []).length
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// @route   GET /api/users/:username/posts
// @desc    Get all posts by a specific username
router.get('/:username/posts', (req, res) => {
  try {
    const user = getUserByUsername(req.params.username);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const allPosts = getAllPosts();
    const userPosts = allPosts.filter(p => p.userId === user.id);
    res.json(userPosts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user posts' });
  }
});

// @route   GET /api/users/:username/saved
// @desc    Get saved posts for current logged in user
router.get('/:username/saved', protect, (req, res) => {
  try {
    if (req.user.username.toLowerCase() !== req.params.username.toLowerCase()) {
      return res.status(403).json({ message: 'Not authorized to view saved posts of another user' });
    }

    const user = getUserById(req.user.id);
    const savedIds = user.savedPosts || [];
    const allPosts = getAllPosts();
    const savedPosts = allPosts.filter(p => savedIds.includes(p.id));

    res.json(savedPosts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching saved posts' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update current user profile
router.put('/profile', protect, (req, res) => {
  try {
    const { name, bio, website, avatar } = req.body;
    const user = getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (website !== undefined) user.website = website;
    if (avatar !== undefined) user.avatar = avatar;

    saveUser(user);

    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// @route   POST /api/users/:id/follow
// @desc    Follow / Unfollow user toggle
router.post('/:id/follow', protect, (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user.id;

    if (targetUserId === currentUserId) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const targetUser = getUserById(targetUserId);
    const currentUser = getUserById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    targetUser.followers = targetUser.followers || [];
    currentUser.following = currentUser.following || [];

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      currentUser.following = currentUser.following.filter(id => id !== targetUserId);
      targetUser.followers = targetUser.followers.filter(id => id !== currentUserId);
    } else {
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);

      // Send notification
      addNotification({
        id: uuidv4(),
        recipientId: targetUserId,
        senderId: currentUserId,
        type: 'follow',
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    saveUser(currentUser);
    saveUser(targetUser);

    res.json({
      isFollowing: !isFollowing,
      followersCount: targetUser.followers.length,
      followingCount: currentUser.following.length
    });
  } catch (err) {
    console.error('Follow error:', err);
    res.status(500).json({ message: 'Error updating follow status' });
  }
});

export default router;
