import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { storyAPI, resolveImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StoryViewerModal from './StoryViewerModal';

export default function StoriesBar() {
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [storyImageUrl, setStoryImageUrl] = useState('');
  const [storyCaption, setStoryCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const res = await storyAPI.getStories();
      setStories(res.data);
    } catch (err) {
      console.error('Failed to load stories', err);
    }
  };

  const handleAddStory = async (e) => {
    e.preventDefault();
    if (!storyImageUrl) return;

    try {
      setIsUploading(true);
      await storyAPI.createStoryJson({
        mediaUrl: storyImageUrl,
        caption: storyCaption
      });
      setShowUploadModal(false);
      setStoryImageUrl('');
      setStoryCaption('');
      fetchStories();
    } catch (err) {
      console.error('Error posting story', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#111722] rounded-3xl p-4 border border-gray-200/80 dark:border-[#1d2737] shadow-sm mb-6 overflow-hidden">
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1 px-1">
        
        {/* Your Story button */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
          <div 
            onClick={() => setShowUploadModal(true)}
            className="relative w-16 h-16 rounded-full p-[2px] border-2 border-dashed border-pink-500/80 hover:border-pink-500 transition-colors"
          >
            <img 
              src={resolveImageUrl(user?.avatar)} 
              alt="My Story"
              className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center ring-2 ring-white dark:ring-[#111722]">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Your Story</span>
        </div>

        {/* Stories from following users */}
        {stories.map((story, index) => (
          <div 
            key={story.id} 
            onClick={() => setActiveStoryIndex(index)}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 group-hover:scale-105 transition-transform duration-200 shadow-sm">
              <div className="w-full h-full rounded-full p-[2px] bg-white dark:bg-[#111722]">
                <img 
                  src={resolveImageUrl(story.userAvatar)} 
                  alt={story.username}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 max-w-[68px] truncate">
              {story.username}
            </span>
          </div>
        ))}
      </div>

      {/* Story Viewer Modal */}
      {activeStoryIndex !== null && (
        <StoryViewerModal
          stories={stories}
          initialIndex={activeStoryIndex}
          onClose={() => setActiveStoryIndex(null)}
        />
      )}

      {/* Add Story Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161d2b] w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add a New Story</h3>
            <form onSubmit={handleAddStory} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Image URL</label>
                <input 
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={storyImageUrl}
                  onChange={(e) => setStoryImageUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f141f] text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Short Caption (optional)</label>
                <input 
                  type="text"
                  placeholder="Today's mood ✨"
                  value={storyCaption}
                  onChange={(e) => setStoryCaption(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f141f] text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              {/* Sample Photo Pickers */}
              <div>
                <span className="text-xs text-gray-400 block mb-1.5">Or pick a quick sample photo:</span>
                <div className="flex gap-2">
                  {[
                    "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=600",
                    "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=600",
                    "https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=600"
                  ].map((url, i) => (
                    <img 
                      key={i}
                      src={url}
                      alt="Sample"
                      onClick={() => setStoryImageUrl(url)}
                      className="w-12 h-12 rounded-lg object-cover cursor-pointer hover:ring-2 hover:ring-pink-500"
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/20 hover:opacity-95"
                >
                  {isUploading ? 'Posting...' : 'Share Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
