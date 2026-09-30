import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getAllPosts, getPostById, savePost, removePost, getUserById, saveUser, addNotification } from '../data/db.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// @route   GET /api/posts
// @desc    Get all posts for the feed
router.get('/', (req, res) => {
  try {
    const posts = getAllPosts();
    res.json(posts);
  } catch (err) {
    console.error('Fetch posts error:', err);
    res.status(500).json({ message: 'Failed to retrieve posts' });
  }
});

// @route   GET /api/posts/:id
// @desc    Get single post by ID
router.get('/:id', (req, res) => {
  try {
    const post = getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving post' });
  }
});

// @route   POST /api/posts
// @desc    Create a new post (handles file upload or image URL)
router.post('/', protect, upload.single('image'), (req, res) => {
  try {
    const { caption, location, imageUrl } = req.body;
    let finalImageUrl = imageUrl;

    if (req.file) {
      // Relative URL served by static express middleware
      finalImageUrl = `/uploads/${req.file.filename}`;
    }

    if (!finalImageUrl) {
      return res.status(400).json({ message: 'Post image or image URL is required' });
    }

    const newPost = {
      id: uuidv4(),
      userId: req.user.id,
      imageUrl: finalImageUrl,
      caption: caption || '',
      location: location || '',
      likes: [],
      comments: [],
      createdAt: new Date().toISOString()
    };

    savePost(newPost);
    const enrichedPost = getPostById(newPost.id);

    res.status(201).json(enrichedPost);
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete post
router.delete('/:id', protect, (req, res) => {
  try {
    const post = getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    removePost(req.params.id);
    res.json({ message: 'Post removed successfully', postId: req.params.id });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete post' });
  }
});

// @route   POST /api/posts/:id/like
// @desc    Toggle like on a post
router.post('/:id/like', protect, (req, res) => {
  try {
    const post = getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user.id;
    const hasLiked = post.likes.includes(userId);

    let updatedLikes;
    if (hasLiked) {
      updatedLikes = post.likes.filter(id => id !== userId);
    } else {
      updatedLikes = [...post.likes, userId];

      // Send notification to post owner if not self
      if (post.userId !== userId) {
        addNotification({
          id: uuidv4(),
          recipientId: post.userId,
          senderId: userId,
          type: 'like',
          postId: post.id,
          read: false,
          createdAt: new Date().toISOString()
        });
      }
    }

    post.likes = updatedLikes;
    savePost(post);

    res.json({
      likes: post.likes,
      likesCount: post.likes.length,
      hasLiked: !hasLiked
    });
  } catch (err) {
    console.error('Like error:', err);
    res.status(500).json({ message: 'Failed to update like status' });
  }
});

// @route   POST /api/posts/:id/comment
// @desc    Add comment to a post
router.post('/:id/comment', protect, (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text cannot be empty' });
    }

    const post = getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      id: uuidv4(),
      userId: req.user.id,
      text: text.trim(),
      createdAt: new Date().toISOString()
    };

    post.comments = post.comments || [];
    post.comments.push(newComment);
    savePost(post);

    // Send notification
    if (post.userId !== req.user.id) {
      addNotification({
        id: uuidv4(),
        recipientId: post.userId,
        senderId: req.user.id,
        type: 'comment',
        postId: post.id,
        text: text.trim().slice(0, 60),
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    const enrichedPost = getPostById(post.id);
    res.status(201).json(enrichedPost.comments);
  } catch (err) {
    console.error('Comment error:', err);
    res.status(500).json({ message: 'Failed to add comment' });
  }
});

// @route   DELETE /api/posts/:id/comment/:commentId
// @desc    Delete comment from a post
router.delete('/:id/comment/:commentId', protect, (req, res) => {
  try {
    const post = getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const commentIndex = post.comments.findIndex(c => c.id === req.params.commentId);
    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Only comment author or post author can delete comment
    const comment = post.comments[commentIndex];
    if (comment.userId !== req.user.id && post.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    post.comments.splice(commentIndex, 1);
    savePost(post);

    const enrichedPost = getPostById(post.id);
    res.json(enrichedPost.comments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete comment' });
  }
});

// @route   POST /api/posts/:id/save
// @desc    Toggle save/bookmark post for current user
router.post('/:id/save', protect, (req, res) => {
  try {
    const user = getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.savedPosts = user.savedPosts || [];
    const postId = req.params.id;
    const isSaved = user.savedPosts.includes(postId);

    if (isSaved) {
      user.savedPosts = user.savedPosts.filter(id => id !== postId);
    } else {
      user.savedPosts.push(postId);
    }

    saveUser(user);

    res.json({
      savedPosts: user.savedPosts,
      isSaved: !isSaved
    });
  } catch (err) {
    console.error('Save post error:', err);
    res.status(500).json({ message: 'Failed to update saved posts' });
  }
});

export default router;
