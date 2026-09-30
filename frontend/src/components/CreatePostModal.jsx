import React, { useState, useRef } from 'react';
import { X, Image, Upload, MapPin, Hash, Sparkles } from 'lucide-react';
import { postAPI, resolveImageUrl } from '../services/api';

const samplePresets = [
  { label: 'Coding Setup', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop&q=80' },
  { label: 'Mountain Trail', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&auto=format&fit=crop&q=80' },
  { label: 'Cozy Cafe', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900&auto=format&fit=crop&q=80' },
  { label: 'Abstract Art', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=900&auto=format&fit=crop&q=80' },
  { label: 'City Lights', url: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=900&auto=format&fit=crop&q=80' }
];

export default function CreatePostModal({ isOpen, onClose, onPostCreated }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('upload'); // 'upload' | 'url' | 'presets'
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setImageUrlInput('');
    }
  };

  const handleSelectPreset = (url) => {
    setSelectedFile(null);
    setPreviewUrl(url);
    setImageUrlInput(url);
  };

  const handleUrlChange = (e) => {
    const val = e.target.value;
    setImageUrlInput(val);
    setSelectedFile(null);
    setPreviewUrl(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!previewUrl) {
      alert('Please select or upload an image first!');
      return;
    }

    try {
      setLoading(true);
      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('caption', caption);
        formData.append('location', location);
        await postAPI.createPost(formData);
      } else {
        await postAPI.createPostJson({
          imageUrl: imageUrlInput || previewUrl,
          caption,
          location
        });
      }

      onClose();
      if (onPostCreated) onPostCreated();
      // Reset
      setSelectedFile(null);
      setPreviewUrl('');
      setImageUrlInput('');
      setCaption('');
      setLocation('');
    } catch (err) {
      console.error('Error creating post', err);
      alert('Failed to share post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#151c28] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#202a3a]">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-500" /> Create New Post
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Source Tabs */}
          <div className="flex rounded-xl bg-gray-100 dark:bg-[#0e141f] p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                mode === 'upload' ? 'bg-white dark:bg-[#1b2434] text-pink-600 dark:text-pink-400 shadow-sm' : 'text-gray-500'
              }`}
            >
              Upload Image
            </button>
            <button
              type="button"
              onClick={() => setMode('url')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                mode === 'url' ? 'bg-white dark:bg-[#1b2434] text-pink-600 dark:text-pink-400 shadow-sm' : 'text-gray-500'
              }`}
            >
              Paste Image URL
            </button>
            <button
              type="button"
              onClick={() => setMode('presets')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                mode === 'presets' ? 'bg-white dark:bg-[#1b2434] text-pink-600 dark:text-pink-400 shadow-sm' : 'text-gray-500'
              }`}
            >
              Sample Photos
            </button>
          </div>

          {/* Mode: Upload */}
          {mode === 'upload' && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-pink-500 dark:hover:border-pink-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-gray-50/50 dark:bg-[#101723]"
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="hidden" 
              />
              <div className="w-12 h-12 rounded-full bg-pink-50 dark:bg-pink-950/40 text-pink-500 mx-auto flex items-center justify-center mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {selectedFile ? selectedFile.name : 'Click to select photo or drag here'}
              </p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
            </div>
          )}

          {/* Mode: URL */}
          {mode === 'url' && (
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">Image Web URL</label>
              <input 
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={imageUrlInput}
                onChange={handleUrlChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f141f] text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-800 dark:text-gray-200"
              />
            </div>
          )}

          {/* Mode: Presets */}
          {mode === 'presets' && (
            <div>
              <p className="text-xs text-gray-500 mb-2 font-medium">Click any curated high-res photo to use it:</p>
              <div className="grid grid-cols-5 gap-2">
                {samplePresets.map((preset, i) => (
                  <div 
                    key={i} 
                    onClick={() => handleSelectPreset(preset.url)}
                    className={`relative rounded-xl overflow-hidden cursor-pointer group aspect-square border-2 transition-all ${
                      previewUrl === preset.url ? 'border-pink-500 scale-95 shadow-md' : 'border-transparent hover:border-pink-400'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] text-center py-0.5 truncate px-1">
                      {preset.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview if image selected */}
          {previewUrl && (
            <div className="relative rounded-2xl overflow-hidden max-h-56 bg-black flex items-center justify-center border border-gray-200 dark:border-gray-700">
              <img src={previewUrl} alt="Preview" className="max-h-56 w-auto object-contain" />
              <button 
                type="button" 
                onClick={() => { setPreviewUrl(''); setSelectedFile(null); setImageUrlInput(''); }}
                className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Caption */}
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 flex items-center justify-between">
              <span>Write a Caption</span>
              <span className="text-[11px] text-gray-400">{caption.length}/500</span>
            </label>
            <textarea 
              rows={3}
              maxLength={500}
              placeholder="What's on your mind? Add hashtags like #dev #photography #sunset"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f141f] text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none text-gray-800 dark:text-gray-200"
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">Location (optional)</label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-pink-500" />
              <input 
                type="text"
                placeholder="e.g. Marina Beach, Chennai or San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f141f] text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-800 dark:text-gray-200"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-semibold border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Discard
            </button>
            <button 
              type="submit"
              disabled={loading || !previewUrl}
              className="flex-1 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white shadow-lg shadow-pink-500/25 hover:opacity-95 disabled:opacity-50 transition-opacity"
            >
              {loading ? 'Sharing Post...' : 'Share Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
