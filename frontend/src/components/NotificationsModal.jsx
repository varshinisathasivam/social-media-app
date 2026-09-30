import React, { useEffect, useState } from 'react';
import { X, Heart, MessageCircle, UserPlus, CheckCheck } from 'lucide-react';
import { notifAPI, resolveImageUrl } from '../services/api';

export default function NotificationsModal({ isOpen, onClose, onNotificationsRead }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await notifAPI.getNotifications();
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notifAPI.markAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      if (onNotificationsRead) onNotificationsRead();
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#151c28] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#202a3a]">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500 fill-pink-500" /> Notifications
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              title="Mark all as read"
              className="text-xs text-pink-600 dark:text-pink-400 font-semibold hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-4 h-4" /> Mark Read
            </button>
            <button 
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="text-center py-10 text-gray-400 text-xs">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">
              No new notifications right now.
            </div>
          ) : (
            notifications.map((n) => (
              <div 
                key={n.id}
                className={`flex items-center justify-between p-3 rounded-2xl transition-colors ${
                  n.read ? 'bg-transparent' : 'bg-pink-50/60 dark:bg-pink-950/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={resolveImageUrl(n.senderAvatar)} 
                      alt={n.senderUsername}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-[#151c28] flex items-center justify-center shadow">
                      {n.type === 'like' && <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />}
                      {n.type === 'comment' && <MessageCircle className="w-3 h-3 text-blue-500 fill-blue-500" />}
                      {n.type === 'follow' && <UserPlus className="w-3 h-3 text-green-500" />}
                    </div>
                  </div>

                  <div className="text-xs text-gray-700 dark:text-gray-300">
                    <p>
                      <span className="font-bold text-gray-900 dark:text-white mr-1">
                        @{n.senderUsername}
                      </span>
                      {n.type === 'like' && 'liked your post.'}
                      {n.type === 'comment' && `commented: "${n.text}"`}
                      {n.type === 'follow' && 'started following you.'}
                    </p>
                    <span className="text-[10px] text-gray-400 mt-0.5 block">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-pink-500 shrink-0" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
