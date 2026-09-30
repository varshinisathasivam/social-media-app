import React from 'react';
import { Home, Compass, PlusSquare, Heart, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { resolveImageUrl } from '../services/api';

export default function MobileNav({ 
  activeTab, 
  setActiveTab, 
  openCreateModal, 
  openNotifications, 
  openMessages,
  unreadCount = 0 
}) {
  const { user } = useAuth();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-[#0c1017]/95 backdrop-blur-md border-t border-gray-200 dark:border-[#20293a] flex items-center justify-around px-2 z-40">
      <button
        onClick={() => setActiveTab('feed')}
        className={`p-2 transition-colors ${activeTab === 'feed' ? 'text-pink-600 dark:text-pink-400' : 'text-gray-500'}`}
      >
        <Home className="w-6 h-6" />
      </button>

      <button
        onClick={() => setActiveTab('explore')}
        className={`p-2 transition-colors ${activeTab === 'explore' ? 'text-pink-600 dark:text-pink-400' : 'text-gray-500'}`}
      >
        <Compass className="w-6 h-6" />
      </button>

      <button
        onClick={openCreateModal}
        className="p-2 text-pink-600 dark:text-pink-400 active:scale-95 transition-transform"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-pink-500/20">
          <PlusSquare className="w-5 h-5" />
        </div>
      </button>

      <button
        onClick={openNotifications}
        className="p-2 text-gray-500 relative transition-colors"
      >
        <Heart className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-pink-500 rounded-full" />
        )}
      </button>

      <button
        onClick={() => setActiveTab('profile')}
        className={`p-2 transition-colors ${activeTab === 'profile' ? 'text-pink-600' : 'text-gray-500'}`}
      >
        <img
          src={resolveImageUrl(user?.avatar)}
          alt="Profile"
          className="w-6 h-6 rounded-full object-cover ring-2 ring-pink-500"
        />
      </button>
    </nav>
  );
}
