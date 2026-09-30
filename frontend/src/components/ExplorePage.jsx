import React, { useState, useEffect } from 'react';
import { Search, Heart, MessageCircle, User } from 'lucide-react';
import { postAPI, userAPI, resolveImageUrl } from '../services/api';

export default function ExplorePage({ onSelectPost, onSelectUser }) {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExplorePosts();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await userAPI.searchUsers(searchQuery);
        setSearchResults(res.data);
      } catch (err) {
        console.error('Search error', err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadExplorePosts = async () => {
    try {
      setLoading(true);
      const res = await postAPI.getPosts();
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to load explore posts', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.caption?.toLowerCase().includes(q) ||
      p.location?.toLowerCase().includes(q) ||
      p.author?.username?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 pb-20 md:pb-6">
      {/* Search Header */}
      <div className="relative mb-6">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search accounts, hashtags, or places..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-[#111722] border border-gray-200/80 dark:border-[#1d2737] shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-800 dark:text-gray-100"
          />
        </div>

        {/* User Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute top-14 left-0 right-0 bg-white dark:bg-[#151c28] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-2 z-30 space-y-1">
            <span className="text-[11px] font-bold text-gray-400 px-3 uppercase tracking-wider block py-1">
              Matching Accounts:
            </span>
            {searchResults.map((u) => (
              <div
                key={u.id}
                onClick={() => {
                  if (onSelectUser) onSelectUser(u.username);
                  setSearchQuery('');
                }}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#1d2737] cursor-pointer transition-colors"
              >
                <img
                  src={resolveImageUrl(u.avatar)}
                  alt={u.username}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-pink-500"
                />
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">@{u.username}</p>
                  <p className="text-xs text-gray-500">{u.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grid of Posts */}
      {loading ? (
        <div className="text-center py-20 text-gray-400 text-sm">Loading discover feed...</div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="font-semibold">No posts found</p>
          <p className="text-xs mt-1">Try another search keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-4">
          {filteredPosts.map((post, idx) => (
            <div
              key={post.id}
              onClick={() => onSelectPost && onSelectPost(post)}
              className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group bg-black/5 dark:bg-black/40"
            >
              <img
                src={resolveImageUrl(post.imageUrl)}
                alt={post.caption || 'Explore post'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />

              {/* Hover overlay with likes & comments */}
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
    </div>
  );
}
