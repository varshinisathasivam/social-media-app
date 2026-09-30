import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI, resolveImageUrl } from '../services/api';

export default function SuggestionsSidebar({ onSelectUser }) {
  const { user, demoUsers } = useAuth();
  const [followingMap, setFollowingMap] = useState({});

  const suggestions = (demoUsers || []).filter(u => u.id !== user?.id).slice(0, 4);

  const handleFollowToggle = async (userId) => {
    try {
      const current = !!followingMap[userId];
      setFollowingMap(prev => ({ ...prev, [userId]: !current }));
      await userAPI.toggleFollow(userId);
    } catch (err) {
      console.error('Follow error', err);
    }
  };

  return (
    <aside className="hidden xl:flex flex-col w-80 py-6 px-4 shrink-0">
      {/* Current User Card */}
      <div 
        onClick={() => onSelectUser && onSelectUser(user?.username)}
        className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#111722] border border-gray-200/80 dark:border-[#1d2737] cursor-pointer hover:border-pink-500/50 transition-colors mb-6 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <img
            src={resolveImageUrl(user?.avatar)}
            alt={user?.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-pink-500/50"
          />
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{user?.name}</p>
            <p className="text-xs text-gray-400">@{user?.username}</p>
          </div>
        </div>
        <span className="text-xs text-pink-600 font-bold hover:underline">Switch</span>
      </div>

      {/* Suggestions Section */}
      <div className="bg-white dark:bg-[#111722] rounded-3xl p-5 border border-gray-200/80 dark:border-[#1d2737] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Suggested For You</span>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 hover:underline cursor-pointer">
            See All
          </span>
        </div>

        <div className="space-y-3.5">
          {suggestions.map((s) => {
            const isFollowed = !!followingMap[s.id];
            return (
              <div key={s.id} className="flex items-center justify-between">
                <div 
                  onClick={() => onSelectUser && onSelectUser(s.username)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <img
                    src={resolveImageUrl(s.avatar)}
                    alt={s.username}
                    className="w-9 h-9 rounded-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-pink-500 transition-colors">
                      @{s.username}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate max-w-[120px]">{s.name}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleFollowToggle(s.id)}
                  className={`text-xs font-bold transition-colors ${
                    isFollowed ? 'text-gray-400' : 'text-pink-600 hover:text-pink-700'
                  }`}
                >
                  {isFollowed ? 'Following' : 'Follow'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer credits */}
      <div className="mt-8 px-2 text-[11px] text-gray-400 space-y-2 leading-relaxed">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <span className="hover:underline cursor-pointer">About</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Help</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Privacy</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Terms</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">API</span>
        </div>
        <p>© 2026 PULSE FROM SOCIAL MEDIA LABS</p>
      </div>
    </aside>
  );
}
