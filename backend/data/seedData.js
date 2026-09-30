import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);
const defaultPasswordHash = bcrypt.hashSync('password123', salt);

export const initialUsers = [
  {
    id: "user-1",
    username: "priya_creative",
    name: "Priya Sharma",
    email: "priya@example.com",
    password: defaultPasswordHash,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    bio: "UI/UX Designer & Digital Creator ✨ Building beautiful experiences | Chennai, India 🇮🇳",
    website: "https://priyasharma.design",
    followers: ["user-2", "user-3", "user-4"],
    following: ["user-2", "user-3"],
    savedPosts: ["post-2"],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "user-2",
    username: "alex_dev",
    name: "Alex Chen",
    email: "alex@example.com",
    password: defaultPasswordHash,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face",
    bio: "Full-Stack Engineer 💻 Building reactive web apps with React & Node.js. Open source contributor 🚀",
    website: "https://alexchen.dev",
    followers: ["user-1", "user-3"],
    following: ["user-1", "user-4"],
    savedPosts: ["post-1"],
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "user-3",
    username: "rahul_travels",
    name: "Rahul Verma",
    email: "rahul@example.com",
    password: defaultPasswordHash,
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=200&fit=crop&crop=face",
    bio: "Photographer & Nomad 🏔️ Exploring mountain peaks & coastal trails. Camera always ready 📷",
    website: "https://rahulverma.photo",
    followers: ["user-1", "user-2"],
    following: ["user-1", "user-2", "user-4"],
    savedPosts: ["post-3"],
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "user-4",
    username: "sara_tech",
    name: "Sara Jenkins",
    email: "sara@example.com",
    password: defaultPasswordHash,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
    bio: "AI Researcher & Coffee Aficionado ☕ Exploring generative models and computer vision 🤖",
    website: "https://sarajenkins.ai",
    followers: ["user-2", "user-3"],
    following: ["user-1"],
    savedPosts: [],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const initialPosts = [
  {
    id: "post-1",
    userId: "user-1",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    caption: "Late night creative flow! Experimenting with modern generative 3D gradients and glassmorphism. What do you all think? 🎨✨ #design #uiux #creativespace #digitalart",
    location: "Marina Beach, Chennai",
    likes: ["user-2", "user-3", "user-4"],
    comments: [
      {
        id: "c-101",
        userId: "user-2",
        text: "The lighting and depth in this are incredible! 🔥",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "c-102",
        userId: "user-4",
        text: "Super clean aesthetic Priya! Which tool did you use?",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "post-2",
    userId: "user-3",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    caption: "Sunrise over the serene valley 🌄 Woke up at 4 AM for this shot and it was 100% worth every step. #nature #mountains #wanderlust #landscapephotography",
    location: "Himachal Pradesh, India",
    likes: ["user-1", "user-2"],
    comments: [
      {
        id: "c-103",
        userId: "user-1",
        text: "Breathtaking view Rahul! Take me with you next time 🤩",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "post-3",
    userId: "user-2",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    caption: "Shipped the new dark mode engine today! Clean code, zero bundle bloat, and snappy rendering. Keep building! 💻⚡ #coding #webdev #reactjs #developer",
    location: "Bangalore Tech Park",
    likes: ["user-1", "user-3", "user-4"],
    comments: [
      {
        id: "c-104",
        userId: "user-3",
        text: "Looks sleek Alex! Excited to test it out.",
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "post-4",
    userId: "user-4",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80",
    caption: "Collaborative brainstorming session on edge AI algorithms. Great ideas start around whiteboard sketches and good coffee ☕💡 #technology #ai #innovation",
    location: "San Francisco, CA",
    likes: ["user-1", "user-2"],
    comments: [],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

export const initialStories = [
  {
    id: "story-1",
    userId: "user-1",
    mediaUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&auto=format&fit=crop&q=80",
    caption: "New palette testing 🎨",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "story-2",
    userId: "user-2",
    mediaUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    caption: "Matrix vibes in the terminal 💻",
    createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "story-3",
    userId: "user-3",
    mediaUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=80",
    caption: "Road trip essentials 🚗⛺",
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "story-4",
    userId: "user-4",
    mediaUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80",
    caption: "Morning espresso run ☕",
    createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString()
  }
];

export const initialNotifications = [
  {
    id: "notif-1",
    recipientId: "user-1",
    senderId: "user-2",
    type: "like",
    postId: "post-1",
    read: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "notif-2",
    recipientId: "user-1",
    senderId: "user-4",
    type: "comment",
    postId: "post-1",
    text: "Super clean aesthetic Priya!",
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "notif-3",
    recipientId: "user-1",
    senderId: "user-3",
    type: "follow",
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];
