import express from 'express';
import { getUserNotifications, markNotificationsAsRead } from '../data/db.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get current user notifications
router.get('/', protect, (req, res) => {
  try {
    const notifications = getUserNotifications(req.user.id);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving notifications' });
  }
});

// @route   PUT /api/notifications/read
// @desc    Mark notifications as read
router.put('/read', protect, (req, res) => {
  try {
    markNotificationsAsRead(req.user.id);
    res.json({ message: 'Notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Error marking notifications read' });
  }
});

export default router;
