# 📸 Pulse - Modern Full-Stack Social Media Application

A complete, production-grade Instagram-style social media platform built with **React**, **Tailwind CSS**, **Node.js**, **Express**, and **JWT Authentication**.

---

## ✨ Features Overview

### 1. 🔐 User Authentication & Authorization
- User registration and login with secure **bcrypt** password hashing.
- **JWT (JSON Web Token)** based stateless authentication.
- **One-Click Demo Account Login** (instant login as Priya, Alex, Rahul, or Sara without typing passwords).

### 2. 📱 Instagram-Style Feed & Interactions
- **Stories Bar**:
  - Top story avatars with gradient status rings.
  - Interactive full-screen Story Viewer with a 5-second animated progress bar, pause/resume, and next/prev tap controls.
  - "+ Your Story" button allowing users to post their own stories.
- **Post Feed**:
  - Image posts with captions, hashtags, and location tags.
  - **Double-click heart animation** directly over images.
  - Like & unlike with real-time counter updates.
  - Bookmark & save posts into a dedicated user collection.
  - Share button with one-click link copying to clipboard.
  - Comments preview with quick inline comment input.

### 3. ➕ Post Creation & Media Uploads
- Multiple image input modes:
  - **Local file upload** via file picker (drag-and-drop support, processed via `multer`).
  - **Direct image URL** input.
  - **Curated preset photos** (Nature, Coding, Coffee, Art, City) for one-click testing.
- Caption editor with character counter and hashtag support.
- Location tagging.

### 4. 💬 Full Comments & Discussion Thread
- Modal view showing full image alongside discussion thread.
- Real-time comment addition with timestamp and user avatars.
- Delete comment button for comment owners or post owners.

### 5. 🔍 Explore & Global Search
- Instagram-style responsive grid view with hover overlay showing likes and comments.
- Live search bar filtering by usernames, full names, captions, and hashtags.
- Instant user account search dropdown.

### 6. 👤 User Profiles & Social Graph
- Profile statistics: Posts count, Followers count, Following count.
- Bio, full name, and clickable website URL.
- **Follow / Unfollow** toggle with real-time counter updates.
- **Edit Profile Modal** allowing users to update their bio, name, avatar, and website.
- Dual tab view: **Posts Grid** and **Saved Posts** (for bookmarked posts).

### 7. 💌 Direct Messaging (DMs) & Notifications
- Interactive direct messages drawer with simulated active conversations.
- Notifications drawer for likes, comments, and new followers with "Mark all as read".

### 8. 🌓 Dark Mode / Light Mode
- Clean modern theme switcher with persistent localStorage preference.

---

## 🛠️ Tech Stack Architecture

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Axios |
| **Backend** | Node.js, Express.js, RESTful API architecture |
| **Authentication** | JWT (jsonwebtoken), bcryptjs |
| **File Handling** | Multer (disk storage in `backend/uploads`) |
| **Database** | Lightweight zero-config file DB (`backend/data/db.json`) auto-seeded on first run |

---

## 🚀 How to Run the Project

### Option A: 1-Click Launch (Recommended for Windows)
Simply double-click the `run.bat` file in this directory:
```text
run.bat
```
This automatically starts both the backend server (Port 5000) and frontend Vite server (Port 3000) in separate terminals and opens your browser.

---

### Option B: Command Line (Step-by-Step)

#### 1. Start the Backend:
```bash
cd backend
npm run dev
```
Backend will start at: `http://localhost:5000`  
Health check: `http://localhost:5000/api/health`

#### 2. Start the Frontend:
Open a second terminal window:
```bash
cd frontend
npm run dev
```
Frontend will start at: `http://localhost:3000`

---

## 👥 Demo User Accounts (Pre-Seeded)

All demo accounts come pre-configured with the default password: `password123`

| Username | Full Name | Role / Bio |
| :--- | :--- | :--- |
| `priya_creative` | Priya Sharma | UI/UX Designer & Digital Creator (Chennai, India) |
| `alex_dev` | Alex Chen | Full-Stack Engineer (React & Node.js) |
| `rahul_travels` | Rahul Verma | Photographer & Nomad (Himachal Pradesh) |
| `sara_tech` | Sara Jenkins | AI Researcher & Coffee Aficionado (San Francisco) |

> 💡 **Tip**: On the login screen or in the left sidebar, you can click on any demo user's badge to **switch accounts instantly with 1 click**!

---

## 📡 REST API Reference

### Auth Endpoints
- `POST /api/auth/register` - Create a new user account
- `POST /api/auth/login` - Authenticate and return JWT token
- `GET /api/auth/me` - Fetch profile of logged-in user (Protected)
- `GET /api/auth/demo-users` - Retrieve list of available demo accounts

### Post Endpoints
- `GET /api/posts` - Fetch all feed posts with authors and comments
- `GET /api/posts/:id` - Fetch single post by ID
- `POST /api/posts` - Create new post (File upload or JSON) (Protected)
- `DELETE /api/posts/:id` - Delete post (Protected, Author only)
- `POST /api/posts/:id/like` - Toggle like/unlike on post (Protected)
- `POST /api/posts/:id/comment` - Add comment to post (Protected)
- `DELETE /api/posts/:id/comment/:commentId` - Delete comment (Protected)
- `POST /api/posts/:id/save` - Toggle save/bookmark post (Protected)

### User & Social Endpoints
- `GET /api/users?query=xxx` - Search users by name/username
- `GET /api/users/:username` - Get full public profile and stats
- `GET /api/users/:username/posts` - Get posts by username
- `GET /api/users/:username/saved` - Get saved posts (Protected)
- `PUT /api/users/profile` - Update profile bio/avatar/name (Protected)
- `POST /api/users/:id/follow` - Toggle follow/unfollow user (Protected)

### Stories & Notifications
- `GET /api/stories` - Get active stories list
- `POST /api/stories` - Post a new story (Protected)
- `GET /api/notifications` - Get user notifications (Protected)
- `PUT /api/notifications/read` - Mark all notifications as read (Protected)

---

## 🎓 Project Presentation / College Viva Tips (தமிழ் / English)

1. **Architecture Explanation**:
   - The application follows a decoupled client-server architecture:
   - Frontend is a Single Page Application (SPA) powered by React & Vite using component-driven UI and React Context for global state (`AuthContext`, `ThemeContext`).
   - Backend is a RESTful API service built on Express.js with JWT authentication middleware protecting sensitive routes.
2. **Self-Contained Database**:
   - Uses a persistent, file-based data layer (`backend/data/db.json`) initialized automatically with real-world seed data. It requires zero configuration, no external database installation, and works reliably on any computer.
3. **Key Concepts Demonstrated**:
   - JWT stateless authentication & authorization tokens.
   - Multipart file upload handling with Multer.
   - Responsive UI design (Mobile bottom bar + Desktop left & right sidebars).
   - Optimistic UI updates (instant like animations and follow counts).
