import axios from 'axios';

export const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pulse_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Helper for resolving image URLs (local upload vs external URL)
export const resolveImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  return `${API_BASE_URL}${url}`;
};

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  getDemoUsers: () => api.get('/auth/demo-users')
};

export const postAPI = {
  getPosts: () => api.get('/posts'),
  getPost: (id) => api.get(`/posts/${id}`),
  createPost: (formData) => api.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  createPostJson: (data) => api.post('/posts', data),
  deletePost: (id) => api.delete(`/posts/${id}`),
  toggleLike: (id) => api.post(`/posts/${id}/like`),
  addComment: (id, text) => api.post(`/posts/${id}/comment`, { text }),
  deleteComment: (postId, commentId) => api.delete(`/posts/${postId}/comment/${commentId}`),
  toggleSave: (id) => api.post(`/posts/${id}/save`)
};

export const userAPI = {
  searchUsers: (query) => api.get(`/users${query ? `?query=${encodeURIComponent(query)}` : ''}`),
  getProfile: (username) => api.get(`/users/${username}`),
  getUserPosts: (username) => api.get(`/users/${username}/posts`),
  getUserSavedPosts: (username) => api.get(`/users/${username}/saved`),
  updateProfile: (data) => api.put('/users/profile', data),
  toggleFollow: (id) => api.post(`/users/${id}/follow`)
};

export const storyAPI = {
  getStories: () => api.get('/stories'),
  createStory: (formData) => api.post('/stories', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  createStoryJson: (data) => api.post('/stories', data)
};

export const notifAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: () => api.put('/notifications/read')
};

export default api;
