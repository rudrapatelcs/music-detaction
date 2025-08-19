import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart } from 'lucide-react';
import { Song } from '../types/mood';
import { getMoodPlaylist } from '../data/musicLibrary';

interface MusicPlayerProps {
  currentMood: string;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ currentMood }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [player, setPlayer] = useState<any>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load YouTube API
    if (!window.YT) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(script);

      window.onYouTubeIframeAPIReady = () => {
        initializePlayer();
      };
    } else {
      initializePlayer();
    }
  }, []);

  const initializePlayer = () => {
    if (window.YT && playerRef.current) {
      const newPlayer = new window.YT.Player(playerRef.current, {
        height: '300',
        width: '100%',
        videoId: '',
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: (event: any) => {
            setPlayer(event.target);
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              handleNext();
            }
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
          },
        },
      });
    }
  };

  useEffect(() => {
    console.log('MusicPlayer: currentMood changed to:', currentMood);
    
    if (currentMood && player && player.loadVideoById) {
      const moodPlaylist = getMoodPlaylist(currentMood);
      console.log('Loading playlist for mood:', currentMood, 'Songs found:', moodPlaylist.length);
      
      if (moodPlaylist.length > 0) {
        setPlaylist(moodPlaylist);
        setCurrentIndex(0);
        setCurrentSong(moodPlaylist[0]);
        
        console.log('Loading new song:', moodPlaylist[0].title);
        
        try {
          // Load the new song
          player.loadVideoById(moodPlaylist[0].youtubeId);
          
          // Auto-play if music was already playing
          setTimeout(() => {
            if (isPlaying) {
              console.log('Auto-playing new song');
              player.playVideo();
            }
          }, 1000);
        } catch (error) {
          console.error('Error loading video:', error);
        }
      }
    }
  }, [currentMood, player]); // Removed isPlaying from dependencies to avoid loops

  const handlePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
  };

  const handleNext = () => {
    if (playlist.length > 0) {
      const nextIndex = (currentIndex + 1) % playlist.length;
      setCurrentIndex(nextIndex);
      setCurrentSong(playlist[nextIndex]);
      
      if (player) {
        player.loadVideoById(playlist[nextIndex].youtubeId);
        if (isPlaying) {
          player.playVideo();
        }
      }
    }
  };

  const handlePrevious = () => {
    if (playlist.length > 0) {
      const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentSong(playlist[prevIndex]);
      
      if (player) {
        player.loadVideoById(playlist[prevIndex].youtubeId);
        if (isPlaying) {
          player.playVideo();
        }
      }
    }
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

          <div className="bg-black/20 rounded-lg overflow-hidden mb-4">
            <div ref={playerRef} />
          </div>

          <div className="flex items-center justify-center space-x-6">
            <button
              onClick={handlePrevious}
              className="text-white hover:text-white/80 transition-colors"
            >
              <SkipBack size={24} fill="currentColor" />
            </button>
            
            <button
              onClick={handlePlayPause}
              className="bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors"
            >
              {isPlaying ? (
                <Pause size={32} fill="currentColor" className="text-white" />
              ) : (
                <Play size={32} fill="currentColor" className="text-white ml-1" />
              )}
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
        <h4 className="text-white font-semibold">Current Playlist</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {playlist.map((song, index) => (
            <div
              key={song.id}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                index === currentIndex
                  ? 'bg-blue-600/20 border border-blue-500/30'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
              onClick={() => {
                setCurrentIndex(index);
                setCurrentSong(song);
                if (player) {
                  player.loadVideoById(song.youtubeId);
                  if (isPlaying) {
                    player.playVideo();
                  }
                }
              }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded flex items-center justify-center">
                {index === currentIndex && isPlaying ? (
                  <Volume2 size={16} className="text-blue-400" />
                ) : (
                  <span className="text-gray-400 text-sm">{index + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <h5 className="text-white font-medium">{song.title}</h5>
                <p className="text-gray-400 text-sm">{song.artist}</p>
              </div>
              <Heart size={16} className="text-gray-600 hover:text-red-500 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;