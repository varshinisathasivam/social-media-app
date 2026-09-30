import React, { useState } from 'react';
import { X, Trash2, Send, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { postAPI, resolveImageUrl } from '../services/api';

export default function CommentsModal({ post, isOpen, onClose, onCommentAdded }) {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState(post?.comments || []);

  if (!isOpen || !post) return null;

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || loading) return;

    try {
      setLoading(true);
      const res = await postAPI.addComment(post.id, commentText);
      setComments(res.data);
      setCommentText('');
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      console.error('Failed to add comment', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await postAPI.deleteComment(post.id, commentId);
      setComments(res.data);
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      console.error('Failed to delete comment', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 md:p-6">
      <div className="bg-white dark:bg-[#121926] w-full max-w-4xl h-[85vh] max-h-[700px] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row">
        
        {/* Left Side: Post Image */}
        <div className="hidden md:flex md:w-1/2 bg-black items-center justify-center overflow-hidden">
          <img 
            src={resolveImageUrl(post.imageUrl)} 
            alt="Post content" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side: Comments List & Input */}
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#121926]">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-[#1d2737]">
            <div className="flex items-center gap-3">
              <img 
                src={resolveImageUrl(post.author?.avatar)} 
                alt={post.author?.username} 
                className="w-9 h-9 rounded-full object-cover ring-1 ring-pink-500"
              />
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">@{post.author?.username}</p>
                {post.location && <p className="text-[11px] text-gray-400">{post.location}</p>}
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Comments List (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Caption as first comment */}
            {post.caption && (
              <div className="flex gap-3 pb-3 border-b border-gray-100 dark:border-[#1d2737]">
                <img 
                  src={resolveImageUrl(post.author?.avatar)} 
                  alt={post.author?.username}
                  className="w-8 h-8 rounded-full object-cover shrink-0" 
                />
                <div className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed">
                  <span className="font-bold mr-1.5 text-gray-900 dark:text-white">{post.author?.username}</span>
                  <span>{post.caption}</span>
                </div>
              </div>
            )}

            {/* List of comments */}
            {comments.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-sm font-medium">No comments yet.</p>
                <p className="text-xs mt-1">Start the conversation!</p>
              </div>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="flex items-start justify-between gap-2 group">
                  <div className="flex gap-3">
                    <img 
                      src={resolveImageUrl(c.userAvatar)} 
                      alt={c.username}
                      className="w-8 h-8 rounded-full object-cover shrink-0" 
                    />
                    <div>
                      <div className="text-xs text-gray-800 dark:text-gray-200 leading-snug">
                        <span className="font-bold mr-1.5 text-gray-900 dark:text-white">{c.username}</span>
                        <span>{c.text}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Delete button if comment belongs to user or post owner */}
                  {(user?.id === c.userId || user?.id === post.userId) && (
                    <button 
                      onClick={() => handleDeleteComment(c.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 transition-opacity"
                      title="Delete comment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Comment Input */}
          <form onSubmit={handleAddComment} className="p-4 border-t border-gray-100 dark:border-[#1d2737] flex items-center gap-2">
            <input 
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f141f] text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button 
              type="submit"
              disabled={!commentText.trim() || loading}
              className="px-4 py-2.5 rounded-xl bg-pink-600 text-white text-xs font-bold disabled:opacity-40 hover:bg-pink-700 transition-colors flex items-center gap-1.5 shadow-md shadow-pink-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Posting...' : 'Post'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
