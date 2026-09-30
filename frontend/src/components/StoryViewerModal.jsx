import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { resolveImageUrl } from '../services/api';

export const StoryViewerModal = ({ stories, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentStory = stories[currentIndex];

  useEffect(() => {
    if (!currentStory || isPaused) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(i => i + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2; // 50 ticks * 100ms = 5000ms (5 seconds)
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, stories.length, isPaused, currentStory, onClose]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(i => i + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setProgress(0);
    }
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50"
      >
        <X className="w-7 h-7" />
      </button>

      {/* Prev / Next desktop buttons */}
      {currentIndex > 0 && (
        <button 
          onClick={handlePrev}
          className="hidden md:flex absolute left-8 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-50"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {currentIndex < stories.length - 1 && (
        <button 
          onClick={handleNext}
          className="hidden md:flex absolute right-8 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-50"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      {/* Story Card Container */}
      <div className="relative w-full max-w-md h-[80vh] max-h-[720px] rounded-3xl overflow-hidden shadow-2xl bg-gray-900 border border-white/10 flex flex-col justify-between">
        
        {/* Progress Bars */}
        <div className="absolute top-3 left-3 right-3 z-30 flex gap-1.5">
          {stories.map((s, idx) => (
            <div key={s.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
                style={{
                  width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* User Info Header */}
        <div className="absolute top-7 left-4 right-4 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={resolveImageUrl(currentStory.userAvatar)} 
              alt={currentStory.username}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-pink-500 shadow"
            />
            <div>
              <p className="text-white text-sm font-bold drop-shadow">@{currentStory.username}</p>
              <p className="text-white/70 text-xs drop-shadow">Just now</p>
            </div>
          </div>
          <button 
            onClick={() => setIsPaused(p => !p)}
            className="text-white/80 hover:text-white p-1 rounded-full"
          >
            {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </button>
        </div>

        {/* Story Media (Image) */}
        <div className="absolute inset-0 z-10">
          <img 
            src={resolveImageUrl(currentStory.mediaUrl)} 
            alt="Story media"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
        </div>

        {/* Touch zones for mobile (tap left to go back, tap right to advance) */}
        <div className="absolute inset-0 z-20 flex">
          <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev} />
          <div className="w-2/3 h-full cursor-pointer" onClick={handleNext} />
        </div>

        {/* Story Caption at bottom */}
        {currentStory.caption && (
          <div className="relative z-30 p-5 mt-auto text-center">
            <p className="text-white text-base font-medium drop-shadow-md bg-black/40 backdrop-blur-sm px-4 py-2 rounded-2xl inline-block">
              {currentStory.caption}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryViewerModal;
