import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialUsers, initialPosts, initialStories, initialNotifications } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

// Initialize database with seed data if file doesn't exist
export function initDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: initialUsers,
      posts: initialPosts,
      stories: initialStories,
      notifications: initialNotifications
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    console.log('📦 Database initialized with seed data at:', DB_FILE);
  }
}

export function readDb() {
  initDb();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB, re-initializing...', err);
    initDb();
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  }
}

export function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to DB:', err);
    throw err;
  }
}

// User Helpers
export function getUsers() {
  return readDb().users || [];
}

export function getUserById(id) {
  return getUsers().find(u => u.id === id);
}

export function getUserByUsername(username) {
  return getUsers().find(u => u.username.toLowerCase() === username.toLowerCase());
}

export function getUserByEmail(email) {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function saveUser(user) {
  const db = readDb();
  const index = db.users.findIndex(u => u.id === user.id);
  if (index !== -1) {
    db.users[index] = { ...db.users[index], ...user };
  } else {
    db.users.push(user);
  }
  writeDb(db);
  return user;
}

// Post Helpers
export function getAllPosts() {
  const db = readDb();
  const users = db.users || [];
  
  // Attach user details to posts for feed display
  return (db.posts || []).map(post => {
    const author = users.find(u => u.id === post.userId) || {
      id: post.userId,
      username: "unknown",
      name: "Unknown User",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
    };

    // Attach user details to comments
    const enrichedComments = (post.comments || []).map(c => {
      const commentAuthor = users.find(u => u.id === c.userId) || {
        username: "user",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
      };
      return {
        ...c,
        username: commentAuthor.username,
        userAvatar: commentAuthor.avatar
      };
    });

    return {
      ...post,
      author: {
        id: author.id,
        username: author.username,
        name: author.name,
        avatar: author.avatar
      },
      comments: enrichedComments
    };
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getPostById(id) {
  const posts = getAllPosts();
  return posts.find(p => p.id === id);
}

export function savePost(post) {
  const db = readDb();
  const index = db.posts.findIndex(p => p.id === post.id);
  if (index !== -1) {
    db.posts[index] = { ...db.posts[index], ...post };
  } else {
    db.posts.unshift(post);
  }
  writeDb(db);
  return getPostById(post.id);
}

export function removePost(id) {
  const db = readDb();
  db.posts = db.posts.filter(p => p.id !== id);
  writeDb(db);
}

// Story Helpers
export function getAllStories() {
  const db = readDb();
  const users = db.users || [];
  return (db.stories || []).map(story => {
    const author = users.find(u => u.id === story.userId) || {
      username: "user",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
    };
    return {
      ...story,
      username: author.username,
      userAvatar: author.avatar
    };
  });
}

export function saveStory(story) {
  const db = readDb();
  db.stories.unshift(story);
  writeDb(db);
  return story;
}

// Notification Helpers
export function getUserNotifications(userId) {
  const db = readDb();
  const users = db.users || [];
  return (db.notifications || [])
    .filter(n => n.recipientId === userId)
    .map(n => {
      const sender = users.find(u => u.id === n.senderId) || {
        username: "someone",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
      };
      return {
        ...n,
        senderUsername: sender.username,
        senderAvatar: sender.avatar
      };
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function addNotification(notification) {
  const db = readDb();
  db.notifications.unshift(notification);
  writeDb(db);
  return notification;
}

export function markNotificationsAsRead(userId) {
  const db = readDb();
  db.notifications = db.notifications.map(n => {
    if (n.recipientId === userId) {
      return { ...n, read: true };
    }
    return n;
  });
  writeDb(db);
}
