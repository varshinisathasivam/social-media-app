import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Bookmark, 
  Settings, 
  Heart, 
  MessageCircle, 
  Globe, 
  Edit3, 
  Check,
  UserPlus,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userAPI, resolveImageUrl } from '../services/api';

export default function ProfilePage({ targetUsername, onSelectPost }) {
  const { user: currentUser, updateUserState } = useAuth();
  const username = targetUsername || currentUser?.username;
  const isOwnProfile = currentUser?.username?.toLowerCase() === username?.toLowerCase();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'saved'
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit form state
  const [nameInput, setNameInput] = useState('');
  const [bioInput, setBioInput] = useState('');
  const [websiteInput, setWebsiteInput] = useState('');
  const [avatarInput, setAvatarInput] = useState('');

  useEffect(() => {
    loadProfileData();
  }, [username]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const [profileRes, postsRes] = await Promise.all([
        userAPI.getProfile(username),
        userAPI.getUserPosts(username)
      ]);

      setProfile(profileRes.data);
      setPosts(postsRes.data);
      setIsFollowing(profileRes.data.followers?.includes(currentUser?.id));

      setNameInput(profileRes.data.name || '');
      setBioInput(profileRes.data.bio || '');
      setWebsiteInput(profileRes.data.website || '');
      setAvatarInput(profileRes.data.avatar || '');

      if (isOwnProfile) {
        const savedRes = await userAPI.getUserSavedPosts(username);
        setSavedPosts(savedRes.data);
      }
    } catch (err) {
      console.error('Error loading profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFollow = async () => {
    if (!profile) return;
    try {
      const nextFollowState = !isFollowing;
      setIsFollowing(nextFollowState);
      setProfile(prev => ({
        ...prev,
        followersCount: nextFollowState ? prev.followersCount + 1 : prev.followersCount - 1
      }));
      await userAPI.toggleFollow(profile.id);
    } catch (err) {
      console.error('Failed to toggle follow', err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await userAPI.updateProfile({
        name: nameInput,
        bio: bioInput,
        website: websiteInput,
        avatar: avatarInput
      });
      setProfile(prev => ({ ...prev, ...res.data }));
      updateUserState(res.data);
      setShowEditModal(false);
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-400 text-sm">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="text-center py-20 text-gray-400">User not found</div>;
  }

  const displayedPosts = activeTab === 'posts' ? posts : savedPosts;

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 pb-20 md:pb-8">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-[#111722] rounded-3xl p-6 md:p-8 border border-gray-200/80 dark:border-[#1d2737] shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 md:gap-10">
          
          {/* Avatar */}
          <div className="relative group">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 shadow-md shadow-pink-500/10">
              <img
                src={resolveImageUrl(profile.avatar)}
                alt={profile.name}
                className="w-full h-full rounded-full object-cover bg-white dark:bg-[#111722] p-0.5"
              />
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                @{profile.username}
              </h1>

              {isOwnProfile ? (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-4 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleToggleFollow}
                  className={`px-5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                    isFollowing
                      ? 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                      : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-pink-500/20 hover:opacity-95'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5" /> Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" /> Follow
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 my-2 text-sm">
              <div>
                <span className="font-extrabold text-gray-900 dark:text-white mr-1">
                  {profile.postsCount || posts.length}
                </span>
                <span className="text-gray-500 text-xs">posts</span>
              </div>
              <div>
                <span className="font-extrabold text-gray-900 dark:text-white mr-1">
                  {profile.followersCount || 0}
                </span>
                <span className="text-gray-500 text-xs">followers</span>
              </div>
              <div>
                <span className="font-extrabold text-gray-900 dark:text-white mr-1">
                  {profile.followingCount || 0}
                </span>
                <span className="text-gray-500 text-xs">following</span>
              </div>
            </div>

            {/* Name & Bio */}
            <div className="mt-2 space-y-1">
              <p className="font-bold text-sm text-gray-900 dark:text-gray-100">{profile.name}</p>
              {profile.bio && (
                <p className="text-xs text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed whitespace-pre-line">
                  {profile.bio}
                </p>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-pink-600 dark:text-pink-400 font-semibold hover:underline flex items-center gap-1 justify-center sm:justify-start"
                >
                  <Globe className="w-3.5 h-3.5" /> {profile.website.replace('https://', '')}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-b border-gray-200 dark:border-[#1d2737] mb-6">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 py-3 px-6 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'posts'
              ? 'border-pink-500 text-pink-600 dark:text-pink-400'
              : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
          }`}
        >
          <Grid className="w-4 h-4" /> Posts
        </button>

        {isOwnProfile && (
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 py-3 px-6 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'saved'
                ? 'border-pink-500 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
            }`}
          >
            <Bookmark className="w-4 h-4" /> Saved
          </button>
        )}
      </div>

      {/* Posts Grid */}
      {displayedPosts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="font-semibold text-sm">
            {activeTab === 'posts' ? 'No posts uploaded yet' : 'No saved posts'}
          </p>
          <p className="text-xs mt-1">
            {activeTab === 'posts' ? 'Share your first photo or thought!' : 'Save posts to view them later.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-4">
          {displayedPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectPost && onSelectPost(post)}
              className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group bg-black/5 dark:bg-black/40"
            >
              <img
                src={resolveImageUrl(post.imageUrl)}
                alt={post.caption || 'Post image'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-6 text-white font-bold text-sm">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-5 h-5 fill-white" />
                  <span>{post.likes?.length || 0}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>{post.comments?.length || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#151c28] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Edit Profile</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f141f] text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-800 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Bio</label>
                <textarea
                  rows={3}
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f141f] text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none text-gray-800 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Website Link</label>
                <input
                  type="url"
                  placeholder="https://yourportfolio.com"
                  value={websiteInput}
                  onChange={(e) => setWebsiteInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f141f] text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-800 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Avatar Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={avatarInput}
                  onChange={(e) => setAvatarInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f141f] text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-800 dark:text-gray-100"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/20 hover:opacity-95"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
