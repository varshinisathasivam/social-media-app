import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getAllStories, saveStory } from '../data/db.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// @route   GET /api/stories
// @desc    Get active stories
router.get('/', (req, res) => {
  try {
    const stories = getAllStories();
    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving stories' });
  }
});

// @route   POST /api/stories
// @desc    Create a story
router.post('/', protect, upload.single('media'), (req, res) => {
  try {
    const { caption, mediaUrl } = req.body;
    let finalMediaUrl = mediaUrl;

    if (req.file) {
      finalMediaUrl = `/uploads/${req.file.filename}`;
    }

    if (!finalMediaUrl) {
      return res.status(400).json({ message: 'Story media is required' });
    }

    const newStory = {
      id: uuidv4(),
      userId: req.user.id,
      mediaUrl: finalMediaUrl,
      caption: caption || '',
      createdAt: new Date().toISOString()
    };

    saveStory(newStory);
    const allStories = getAllStories();
    res.status(201).json(allStories.find(s => s.id === newStory.id));
  } catch (err) {
    res.status(500).json({ message: 'Error creating story' });
  }
});

export default router;
