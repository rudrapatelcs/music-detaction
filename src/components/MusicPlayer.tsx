import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart, ExternalLink } from 'lucide-react';
import { Song } from '../types/mood';
import { getMoodPlaylist } from '../data/musicLibrary';

interface MusicPlayerProps {
  currentMood: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ currentMood }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    console.log('MusicPlayer: currentMood changed to:', currentMood);
    
    if (currentMood) {
      const moodPlaylist = getMoodPlaylist(currentMood);
      console.log('Loading playlist for mood:', currentMood, 'Songs found:', moodPlaylist.length);
      
      if (moodPlaylist.length > 0) {
        setPlaylist(moodPlaylist);
        setCurrentIndex(0);
        setCurrentSong(moodPlaylist[0]);
      } else {
        console.log('No songs found for mood:', currentMood);
        setPlaylist([]);
        setCurrentSong(null);
      }
    }
  }, [currentMood]);

  // Initialize playlist on component mount
  useEffect(() => {
    if (currentMood) {
      const moodPlaylist = getMoodPlaylist(currentMood);
      if (moodPlaylist.length > 0) {
        setPlaylist(moodPlaylist);
        setCurrentSong(moodPlaylist[0]);
        setCurrentIndex(0);
      }
    }
  }, []);

  const handleNext = () => {
    if (playlist.length > 0) {
      const nextIndex = (currentIndex + 1) % playlist.length;
      setCurrentIndex(nextIndex);
      setCurrentSong(playlist[nextIndex]);
    }
  };

  const handlePrevious = () => {
    if (playlist.length > 0) {
      const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentSong(playlist[prevIndex]);
    }
  };

  const handleSongSelect = (song: Song, index: number) => {
    setCurrentIndex(index);
    setCurrentSong(song);
  };

  const openInYouTube = (youtubeId: string) => {
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank');
  };

  const getMoodColor = (mood: string) => {
    const colors = {
      happy: 'from-yellow-400 to-orange-500',
      sad: 'from-blue-600 to-indigo-800',
      angry: 'from-red-500 to-red-700',
      neutral: 'from-gray-500 to-gray-700',
      surprised: 'from-purple-500 to-pink-500',
      fearful: 'from-indigo-500 to-purple-700',
      disgusted: 'from-green-600 to-teal-700',
    };
    return colors[mood as keyof typeof colors] || 'from-gray-500 to-gray-700';
  };

  return (
    <div className="flex-1 bg-gray-900 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-white font-semibold text-lg mb-2">
          Music for Your Mood: <span className="capitalize text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{currentMood}</span>
        </h2>
        <p className="text-gray-400 text-sm">
          AI-curated playlist based on your detected emotion
        </p>
      </div>

      {currentSong && (
        <div className={`bg-gradient-to-br ${getMoodColor(currentMood)} rounded-lg p-6 mb-6`}>
          <div className="text-center mb-4">
            <h3 className="text-white font-bold text-xl mb-1">{currentSong.title}</h3>
            <p className="text-white/80">{currentSong.artist}</p>
          </div>

          {/* YouTube Thumbnail with Play Button */}
          <div className="relative bg-black/20 rounded-lg overflow-hidden mb-4 group cursor-pointer"
               onClick={() => openInYouTube(currentSong.youtubeId)}>
            <img 
              src={`https://img.youtube.com/vi/${currentSong.youtubeId}/maxresdefault.jpg`}
              alt={currentSong.title}
              className="w-full h-48 object-cover"
              onError={(e) => {
                // Fallback to standard quality thumbnail
                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${currentSong.youtubeId}/hqdefault.jpg`;
              }}
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-colors">
              <div className="bg-red-600 hover:bg-red-700 rounded-full p-4 transition-colors">
                <Play size={32} fill="white" className="text-white ml-1" />
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <ExternalLink size={20} className="text-white/80" />
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/60 rounded px-3 py-1 text-white text-sm">
                Click to play on YouTube
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-6">
            <button
              onClick={handlePrevious}
              className="text-white hover:text-white/80 transition-colors"
            >
              <SkipBack size={24} fill="currentColor" />
            </button>
            
            <button
              onClick={() => openInYouTube(currentSong.youtubeId)}
              className="bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors"
            >
              <Play size={32} fill="currentColor" className="text-white ml-1" />
            </button>
            
            <button
              onClick={handleNext}
              className="text-white hover:text-white/80 transition-colors"
            >
              <SkipForward size={24} fill="currentColor" />
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h4 className="text-white font-semibold">Current Playlist ({playlist.length} songs)</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {playlist.length > 0 ? (
            playlist.map((song, index) => (
              <div
                key={song.id}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  index === currentIndex
                    ? 'bg-blue-600/20 border border-blue-500/30'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
                onClick={() => handleSongSelect(song, index)}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded flex items-center justify-center">
                  {index === currentIndex ? (
                    <Volume2 size={16} className="text-blue-400" />
                  ) : (
                    <span className="text-gray-400 text-sm">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h5 className="text-white font-medium">{song.title}</h5>
                  <p className="text-gray-400 text-sm">{song.artist}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openInYouTube(song.youtubeId);
                  }}
                  className="text-gray-600 hover:text-red-500 transition-colors p-1"
                >
                  <ExternalLink size={16} />
                </button>
                <Heart size={16} className="text-gray-600 hover:text-red-500 transition-colors" />
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No songs available for this mood</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;