import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  MoreHorizontal, 
  Trash2,
  Send,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { postAPI, resolveImageUrl } from '../services/api';

export default function PostCard({ 
  post, 
  onPostUpdated, 
  onPostDeleted, 
  onOpenComments,
  onUserClick
}) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.likes?.includes(user?.id));
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [isSaved, setIsSaved] = useState(user?.savedPosts?.includes(post.id));
  const [commentText, setCommentText] = useState('');
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  const handleLike = async () => {
    try {
      const nextLiked = !isLiked;
      setIsLiked(nextLiked);
      setLikesCount(prev => nextLiked ? prev + 1 : prev - 1);
      await postAPI.toggleLike(post.id);
      if (onPostUpdated) onPostUpdated();
    } catch (err) {
      console.error('Failed to toggle like', err);
    }
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
      handleLike();
    }
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 900);
  };

  const handleSave = async () => {
    try {
      setIsSaved(!isSaved);
      await postAPI.toggleSave(post.id);
      if (onPostUpdated) onPostUpdated();
    } catch (err) {
      console.error('Failed to save post', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submittingComment) return;

    try {
      setSubmittingComment(true);
      await postAPI.addComment(post.id, commentText);
      setCommentText('');
      if (onPostUpdated) onPostUpdated();
    } catch (err) {
      console.error('Failed to add comment', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postAPI.deletePost(post.id);
        if (onPostDeleted) onPostDeleted(post.id);
      } catch (err) {
        console.error('Failed to delete post', err);
      }
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.origin);
    alert('Post link copied to clipboard!');
  };

  const isOwner = user?.id === post.userId;

  return (
    <article className="w-full bg-white dark:bg-[#111722] rounded-3xl border border-gray-200/80 dark:border-[#1d2737] shadow-sm mb-6 overflow-hidden transition-all">
      
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div 
          onClick={() => onUserClick && onUserClick(post.author?.username)}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 to-pink-500 group-hover:scale-105 transition-transform">
            <img 
              src={resolveImageUrl(post.author?.avatar)} 
              alt={post.author?.username} 
              className="w-full h-full rounded-full object-cover bg-white dark:bg-[#111722] p-[1px]"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-gray-900 dark:text-gray-100 group-hover:text-pink-500 transition-colors">
                {post.author?.username}
              </span>
              <span className="text-gray-400 dark:text-gray-500 text-xs">•</span>
              <span className="text-gray-400 dark:text-gray-500 text-xs">
                {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </div>
            {post.location && (
              <p className="text-[11px] text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-pink-500" />
                <span>{post.location}</span>
              </p>
            )}
          </div>
        </div>

        {/* Options dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowMenu(p => !p)}
            className="p-1.5 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-8 w-44 bg-white dark:bg-[#182130] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 py-1.5 z-20">
              <button 
                onClick={handleShare}
                className="w-full px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1d2737] flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" /> Share Link
              </button>
              {isOwner && (
                <button 
                  onClick={handleDeletePost}
                  className="w-full px-4 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Post Media */}
      <div 
        onDoubleClick={handleDoubleTap}
        className="relative w-full bg-black/5 dark:bg-black/40 overflow-hidden cursor-pointer select-none max-h-[580px] flex items-center justify-center"
      >
        <img 
          src={resolveImageUrl(post.imageUrl)} 
          alt="Post Content" 
          className="w-full h-auto max-h-[580px] object-cover"
          loading="lazy"
        />

        {/* Double-tap animated heart */}
        {showHeartAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Heart className="w-28 h-28 text-white fill-white drop-shadow-2xl animate-heart" />
          </div>
        )}
      </div>

      {/* Post Actions Bar */}
      <div className="px-5 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLike}
              className={`p-1 -ml-1 transition-transform active:scale-125 ${
                isLiked ? 'text-pink-600 fill-pink-600' : 'text-gray-700 dark:text-gray-300 hover:text-pink-500'
              }`}
            >
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-pink-600 stroke-pink-600' : ''}`} />
            </button>

            <button 
              onClick={() => onOpenComments && onOpenComments(post)}
              className="p-1 text-gray-700 dark:text-gray-300 hover:text-pink-500 transition-colors"
            >
              <MessageCircle className="w-6 h-6" />
            </button>

            <button 
              onClick={handleShare}
              className="p-1 text-gray-700 dark:text-gray-300 hover:text-pink-500 transition-colors"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>

          <button 
            onClick={handleSave}
            className={`p-1 transition-transform active:scale-125 ${
              isSaved ? 'text-pink-600' : 'text-gray-700 dark:text-gray-300 hover:text-pink-500'
            }`}
          >
            <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-pink-600 stroke-pink-600' : ''}`} />
          </button>
        </div>

        {/* Likes Count */}
        <p className="font-bold text-sm mt-2 text-gray-900 dark:text-gray-100">
          {likesCount.toLocaleString()} {likesCount === 1 ? 'like' : 'likes'}
        </p>

        {/* Caption */}
        {post.caption && (
          <div className="text-sm mt-1 text-gray-800 dark:text-gray-200 leading-snug">
            <span 
              onClick={() => onUserClick && onUserClick(post.author?.username)}
              className="font-bold mr-2 cursor-pointer hover:underline text-gray-900 dark:text-white"
            >
              {post.author?.username}
            </span>
            <span>{post.caption}</span>
          </div>
        )}

        {/* Comments count / preview */}
        {post.comments && post.comments.length > 0 && (
          <div className="mt-2 space-y-1">
            {post.comments.length > 2 && (
              <button 
                onClick={() => onOpenComments && onOpenComments(post)}
                className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium"
              >
                View all {post.comments.length} comments
              </button>
            )}

            {/* Last 2 comments preview */}
            {post.comments.slice(-2).map((c) => (
              <div key={c.id} className="text-xs text-gray-700 dark:text-gray-300">
                <span className="font-bold mr-1.5 text-gray-900 dark:text-gray-100">{c.username}</span>
                <span>{c.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add inline comment input */}
      <form onSubmit={handleAddComment} className="flex items-center gap-2 px-5 py-3 border-t border-gray-100 dark:border-[#1d2737]">
        <input 
          type="text" 
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-1 text-xs bg-transparent focus:outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400"
        />
        <button 
          type="submit" 
          disabled={!commentText.trim() || submittingComment}
          className="text-xs font-bold text-pink-600 disabled:opacity-40 hover:text-pink-700 transition-opacity"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </article>
  );
}
