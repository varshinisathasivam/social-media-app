import React from 'react';
import { 
  Home, 
  Compass, 
  PlusSquare, 
  Heart, 
  MessageCircle, 
  Sun, 
  Moon, 
  LogOut, 
  Sparkles,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { resolveImageUrl } from '../services/api';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  openCreateModal, 
  openNotifications, 
  openMessages,
  unreadCount = 0
}) {
  const { user, logout, demoUsers, loginAsDemo } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 h-screen sticky top-0 px-5 py-6 border-r border-gray-200 dark:border-[#20293a] bg-white dark:bg-[#0c1017] select-none z-30">
      <div className="flex flex-col gap-6">
        {/* Logo */}
        <div 
          onClick={() => setActiveTab('feed')}
          className="flex items-center gap-3 px-2 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Pulse
            </span>
            <span className="ml-1 text-[10px] font-bold uppercase tracking-wider text-pink-500 bg-pink-50 dark:bg-pink-950/40 px-1.5 py-0.5 rounded-full">
              Social
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5 mt-2">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-medium text-base transition-all duration-200 ${
              activeTab === 'feed'
                ? 'bg-gradient-to-r from-pink-50 to-purple-50 text-pink-600 dark:from-pink-950/30 dark:to-purple-950/30 dark:text-pink-400 font-semibold shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-[#151c28]'
            }`}
          >
            <Home className={`w-6 h-6 ${activeTab === 'feed' ? 'stroke-[2.5px]' : ''}`} />
            <span>Feed</span>
          </button>

          <button
            onClick={() => setActiveTab('explore')}
            className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-medium text-base transition-all duration-200 ${
              activeTab === 'explore'
                ? 'bg-gradient-to-r from-pink-50 to-purple-50 text-pink-600 dark:from-pink-950/30 dark:to-purple-950/30 dark:text-pink-400 font-semibold shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-[#151c28]'
            }`}
          >
            <Compass className={`w-6 h-6 ${activeTab === 'explore' ? 'stroke-[2.5px]' : ''}`} />
            <span>Explore</span>
          </button>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-4 px-4 py-3 rounded-2xl font-medium text-base text-gray-600 hover:text-pink-600 hover:bg-pink-50/70 dark:text-gray-400 dark:hover:text-pink-400 dark:hover:bg-pink-950/20 transition-all duration-200 group"
          >
            <div className="w-6 h-6 rounded-lg bg-pink-500/10 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400 flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-colors">
              <PlusSquare className="w-5 h-5" />
            </div>
            <span className="font-semibold text-pink-600 dark:text-pink-400">Create Post</span>
          </button>

          <button
            onClick={openNotifications}
            className="flex items-center justify-between px-4 py-3 rounded-2xl font-medium text-base text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-[#151c28] transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <Heart className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-pink-500 rounded-full ring-2 ring-white dark:ring-[#0c1017]" />
                )}
              </div>
              <span>Notifications</span>
            </div>
            {unreadCount > 0 && (
              <span className="bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={openMessages}
            className="flex items-center gap-4 px-4 py-3 rounded-2xl font-medium text-base text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-[#151c28] transition-all duration-200"
          >
            <MessageCircle className="w-6 h-6" />
            <span>Messages</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-medium text-base transition-all duration-200 ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-pink-50 to-purple-50 text-pink-600 dark:from-pink-950/30 dark:to-purple-950/30 dark:text-pink-400 font-semibold shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-[#151c28]'
            }`}
          >
            <div className="relative">
              <img
                src={resolveImageUrl(user?.avatar)}
                alt={user?.name || 'User'}
                className="w-6 h-6 rounded-full object-cover ring-2 ring-pink-500/40"
              />
            </div>
            <span>Profile</span>
          </button>
        </nav>

        {/* Quick Demo Account Switcher */}
        <div className="p-3 bg-gray-100/70 dark:bg-[#131b27] rounded-2xl border border-gray-200/70 dark:border-[#1e293b]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-1">
            <UserCheck className="w-3.5 h-3.5 text-pink-500" />
            <span>Quick Switch Demo Account:</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {demoUsers.map(du => (
              <button
                key={du.id}
                onClick={() => loginAsDemo(du.username)}
                className={`flex items-center gap-2 p-1.5 rounded-xl text-left text-xs font-medium transition-all ${
                  user?.id === du.id
                    ? 'bg-pink-500 text-white font-semibold'
                    : 'bg-white dark:bg-[#192233] text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-950/30'
                }`}
              >
                <img
                  src={resolveImageUrl(du.avatar)}
                  alt={du.username}
                  className="w-5 h-5 rounded-full object-cover shrink-0"
                />
                <span className="truncate">@{du.username.split('_')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer / Controls */}
      <div className="flex flex-col gap-3 pt-4 border-t border-gray-200 dark:border-[#20293a]">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-[#151c28] transition-colors"
        >
          <div className="flex items-center gap-3">
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-500" />}
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </div>
        </button>

        {/* Current User Info & Logout */}
        <div className="flex items-center justify-between p-2 rounded-2xl bg-gray-50 dark:bg-[#131b27]">
          <div 
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-3 overflow-hidden cursor-pointer"
          >
            <img
              src={resolveImageUrl(user?.avatar)}
              alt={user?.name}
              className="w-9 h-9 rounded-full object-cover shrink-0"
            />
            <div className="truncate">
              <p className="text-xs font-bold truncate text-gray-900 dark:text-gray-100">{user?.name}</p>
              <p className="text-[11px] text-gray-500 truncate">@{user?.username}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
