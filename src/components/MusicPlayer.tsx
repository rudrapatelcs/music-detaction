import React, { useState, useEffect } from 'react';
import { Play, SkipBack, SkipForward, ExternalLink } from 'lucide-react';
import { Song } from '../types/mood';

interface MusicPlayerProps {
  playlist: Song[];
  currentMood: string;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ playlist, currentMood }) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  // Reset to first song when playlist changes (mood changes)
  useEffect(() => {
    setCurrentSongIndex(0);
  }, [playlist]);

  const currentSong = playlist[currentSongIndex];

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % playlist.length);
  };

  const prevSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const openYouTube = (song: Song) => {
    window.open(`https://www.youtube.com/watch?v=${song.youtubeId}`, '_blank');
  };

  const getYouTubeThumbnail = (youtubeId: string) => {
    if (youtubeId) {
      return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
    }
    return 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg';
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
      {/* Song Thumbnail */}
      <div className="relative aspect-video bg-gray-900">
        <img
          src={getYouTubeThumbnail(currentSong.youtubeId)}
          alt={currentSong.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg';
          }}
        />
        
        {/* Play Overlay */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center cursor-pointer hover:bg-opacity-30 transition-all duration-200"
          onClick={() => openYouTube(currentSong)}
        >
          <div className="bg-red-600 hover:bg-red-700 rounded-full p-4 transform hover:scale-110 transition-all duration-200">
            <Play className="w-8 h-8 text-white ml-1" fill="white" />
          </div>
        </div>

        {/* External Link Icon */}
        <div className="absolute top-4 right-4">
          <ExternalLink className="w-5 h-5 text-white opacity-80" />
        </div>
      </div>

      {/* Song Info */}
      <div className="p-6">
        <div className="mb-4">
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

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prevSong}
            disabled={playlist.length <= 1}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <SkipBack className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={() => openYouTube(currentSong)}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium flex items-center gap-2 transition-colors"
          >
            <Play className="w-4 h-4" fill="white" />
            Play on YouTube
          </button>

          <button
            onClick={nextSong}
            disabled={playlist.length <= 1}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <SkipForward className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Playlist Preview */}
        {playlist.length > 1 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Up next:</p>
            <div className="space-y-1">
              {playlist.slice(currentSongIndex + 1, currentSongIndex + 3).map((song, index) => (
                <div key={index} className="text-sm text-gray-500 truncate">
                  {song.title} - {song.artist}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};