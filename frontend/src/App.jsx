import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { postAPI, notifAPI } from './services/api';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import StoriesBar from './components/StoriesBar';
import PostCard from './components/PostCard';
import CreatePostModal from './components/CreatePostModal';
import CommentsModal from './components/CommentsModal';
import NotificationsModal from './components/NotificationsModal';
import MessagesModal from './components/MessagesModal';
import ExplorePage from './components/ExplorePage';
import ProfilePage from './components/ProfilePage';
import SuggestionsSidebar from './components/SuggestionsSidebar';
import AuthModal from './components/AuthModal';

export default function App() {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'explore' | 'profile'
  const [targetProfileUsername, setTargetProfileUsername] = useState(null);
  
  // Feed state
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      loadFeed();
      loadNotificationCount();
    }
  }, [isAuthenticated]);

  const loadFeed = async () => {
    try {
      setPostsLoading(true);
      const res = await postAPI.getPosts();
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to load feed', err);
    } finally {
      setPostsLoading(false);
    }
  };

  const loadNotificationCount = async () => {
    try {
      const res = await notifAPI.getNotifications();
      const unread = (res.data || []).filter(n => !n.read).length;
      setUnreadNotifCount(unread);
    } catch (err) {
      console.error('Error fetching unread notifs', err);
    }
  };

  const handleUserClick = (username) => {
    setTargetProfileUsername(username);
    setActiveTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPostFromGrid = (post) => {
    setActiveCommentPost(post);
  };

  const handlePostDeleted = (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0c1017]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 animate-spin flex items-center justify-center shadow-lg shadow-pink-500/30" />
          <span className="text-xs font-bold text-gray-500 tracking-wider uppercase">Loading Pulse...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthModal />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0c1017] text-gray-900 dark:text-gray-100">
      
      {/* Left Navigation Sidebar (Desktop) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'profile') setTargetProfileUsername(null);
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        openCreateModal={() => setShowCreateModal(true)}
        openNotifications={() => setShowNotifications(true)}
        openMessages={() => setShowMessages(true)}
        unreadCount={unreadNotifCount}
      />

      {/* Main Center Content */}
      <main className="flex-1 flex justify-center min-h-screen overflow-x-hidden">
        
        {/* Feed Tab */}
        {activeTab === 'feed' && (
          <div className="w-full max-w-xl py-6 px-4 pb-20 md:pb-8">
            {/* Stories Row */}
            <StoriesBar />

            {/* Posts Feed */}
            {postsLoading ? (
              <div className="space-y-6">
                {[1, 2].map((n) => (
                  <div key={n} className="bg-white dark:bg-[#111722] rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 animate-pulse space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800" />
                      <div className="space-y-1.5 flex-1">
                        <div className="w-28 h-3 bg-gray-200 dark:bg-gray-800 rounded" />
                        <div className="w-20 h-2 bg-gray-200 dark:bg-gray-800 rounded" />
                      </div>
                    </div>
                    <div className="w-full h-80 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-[#111722] rounded-3xl border border-gray-200/80 dark:border-[#1d2737] p-8 shadow-sm">
                <p className="font-bold text-gray-700 dark:text-gray-300">No posts in your feed yet</p>
                <p className="text-xs text-gray-400 mt-1 mb-4">Be the first to share a moment or photo!</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold shadow-md shadow-pink-500/20"
                >
                  Create Post
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onPostUpdated={loadFeed}
                    onPostDeleted={handlePostDeleted}
                    onOpenComments={(p) => setActiveCommentPost(p)}
                    onUserClick={handleUserClick}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Explore Tab */}
        {activeTab === 'explore' && (
          <ExplorePage
            onSelectPost={handleSelectPostFromGrid}
            onSelectUser={handleUserClick}
          />
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <ProfilePage
            targetUsername={targetProfileUsername}
            onSelectPost={handleSelectPostFromGrid}
          />
        )}
      </main>

      {/* Right Suggestions Sidebar (Desktop) */}
      {activeTab === 'feed' && (
        <SuggestionsSidebar onSelectUser={handleUserClick} />
      )}

      {/* Mobile Navigation Bar */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'profile') setTargetProfileUsername(null);
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        openCreateModal={() => setShowCreateModal(true)}
        openNotifications={() => setShowNotifications(true)}
        openMessages={() => setShowMessages(true)}
        unreadCount={unreadNotifCount}
      />

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPostCreated={loadFeed}
      />

      {/* Comments Drawer / Modal */}
      {activeCommentPost && (
        <CommentsModal
          post={activeCommentPost}
          isOpen={!!activeCommentPost}
          onClose={() => setActiveCommentPost(null)}
          onCommentAdded={loadFeed}
        />
      )}

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onNotificationsRead={() => setUnreadNotifCount(0)}
      />

      {/* Direct Messages Modal */}
      <MessagesModal
        isOpen={showMessages}
        onClose={() => setShowMessages(false)}
      />
    </div>
  );
}
