import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  ExternalLink,
  Loader
} from 'lucide-react';
import { Song } from '../types/mood';
import { useYouTubePlayer } from '../hooks/useYouTubePlayer';

interface MusicPlayerProps {
  playlist: Song[];
  currentMood: string;
  isAutoDetect?: boolean;
  shouldAutoPlay?: boolean;
  onAutoPlayTriggered?: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  playlist, 
  currentMood, 
  isAutoDetect = false,
  shouldAutoPlay = false,
  onAutoPlayTriggered
}) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Reset to first song when playlist changes (mood changes)
  useEffect(() => {
    if (shouldAutoPlay && isAutoDetect) {
      // Auto-detect triggered a mood change - select new song and play
      setCurrentSongIndex(0);
      console.log(`Auto-selecting song for mood: ${currentMood}`);
      
      // Notify parent that auto-play was triggered
      if (onAutoPlayTriggered) {
        onAutoPlayTriggered();
      }
    } else {
      // Manual mode or initial load - just reset to first song
      setCurrentSongIndex(0);
    }
  }, [playlist, shouldAutoPlay, isAutoDetect, currentMood, onAutoPlayTriggered]);

  // Auto-play when shouldAutoPlay is true and player is ready
  useEffect(() => {
    if (shouldAutoPlay && isAutoDetect && isReady) {
      console.log('Auto-playing song for detected mood:', currentMood);
      setTimeout(() => {
        play();
      }, 500); // Small delay to ensure video is loaded
    }
  }, [shouldAutoPlay, isAutoDetect, isReady, currentMood, play]);

  const currentSong = playlist[currentSongIndex];

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % playlist.length);
  };

  const prevSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const {
    containerRef,
    isReady,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    play,
    pause,
    seekTo,
    setVolume,
    toggleMute,
    formatTime,
  } = useYouTubePlayer({
    videoId: currentSong?.youtubeId || '',
    onEnded: nextSong,
    onError: nextSong,
  });

  const openYouTube = (song: Song) => {
    window.open(`https://www.youtube.com/watch?v=${song.youtubeId}`, '_blank');
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    seekTo(newTime);
  };

  if (!currentSong) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center text-gray-500">
          <p>No songs available for current mood</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* YouTube Player Container */}
      <div className="relative aspect-video bg-gray-900">
        <div 
          ref={containerRef}
          className="w-full h-full"
          style={{ pointerEvents: 'none' }}
        />
        
        {/* Loading Overlay */}
        {!isReady && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center">
              <Loader className="w-8 h-8 text-white animate-spin mx-auto mb-2" />
              <p className="text-white text-sm">Loading player...</p>
            </div>
          </div>
        )}

        {/* Control Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end">
          <div className="w-full p-4">
            {/* Progress Bar */}
            {duration > 0 && (
              <div 
                className="w-full bg-white/20 rounded-full h-1 mb-3 cursor-pointer"
                onClick={handleProgressClick}
              >
                <div
                  className="bg-red-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
            )}

            {/* Time Display */}
            {duration > 0 && (
              <div className="flex justify-between text-white text-xs mb-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            )}
          </div>
        </div>

        {/* External Link Icon */}
        <button
          onClick={() => openYouTube(currentSong)}
          className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
        >
          <ExternalLink className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Song Info & Controls */}
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-1">{currentSong.title}</h3>
          <p className="text-gray-600">{currentSong.artist}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
              {currentMood}
            </span>
            <span className="text-sm text-gray-500">
              {currentSongIndex + 1} of {playlist.length}
            </span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={prevSong}
            disabled={playlist.length <= 1}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <SkipBack className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={isPlaying ? pause : play}
            disabled={!isReady}
            className="p-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-full transition-colors"
          >
            {!isReady ? (
              <Loader className="w-6 h-6 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-6 h-6" fill="white" />
            ) : (
              <Play className="w-6 h-6 ml-1" fill="white" />
            )}
          </button>

          <button
            onClick={nextSong}
            disabled={playlist.length <= 1}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <SkipForward className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <button
            onClick={toggleMute}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-gray-700" />
            ) : (
              <Volume2 className="w-4 h-4 text-gray-700" />
            )}
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              {volume}%
            </button>
            
            {showVolumeSlider && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        {/* Secondary Actions */}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => openYouTube(currentSong)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Open in YouTube
          </button>
        </div>

        {/* Playlist Preview */}
        {playlist.length > 1 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Up next:</p>
            <div className="space-y-2">
              {playlist.slice(currentSongIndex + 1, currentSongIndex + 4).map((song, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSongIndex(currentSongIndex + 1 + index)}
                  className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="text-sm font-medium text-gray-800 truncate group-hover:text-blue-600">
                    {song.title}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {song.artist}
                  </div>
                </button>
              ))}
              {playlist.length > currentSongIndex + 4 && (
                <p className="text-xs text-gray-400 text-center pt-2">
                  +{playlist.length - currentSongIndex - 4} more songs
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close volume slider */}
      {showVolumeSlider && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowVolumeSlider(false)}
        />
      )}
    </div>
  );
};