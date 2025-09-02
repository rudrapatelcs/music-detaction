import { useEffect, useRef, useState } from 'react';
import { YouTubePlayer, YouTubePlayerState } from '../types/youtube';

interface UseYouTubePlayerProps {
  videoId: string;
  onEnded?: () => void;
  onError?: () => void;
}

export const useYouTubePlayer = ({ videoId, onEnded, onError }: UseYouTubePlayerProps) => {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize YouTube player
  useEffect(() => {
    if (!containerRef.current) return;

    const initializePlayer = () => {
      if (!window.YT || !window.YT.Player) {
        // YouTube API not ready yet, wait and retry
        setTimeout(initializePlayer, 100);
        return;
      }

      try {
        playerRef.current = new window.YT.Player(containerRef.current!, {
          height: '100%',
          width: '100%',
          videoId: videoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            showinfo: 0,
          },
          events: {
            onReady: (event) => {
              console.log('YouTube player ready');
              setIsReady(true);
              event.target.setVolume(volume);
            },
            onStateChange: (event) => {
              const state = event.data;
              setIsPlaying(state === YouTubePlayerState.PLAYING);
              
              if (state === YouTubePlayerState.PLAYING) {
                setDuration(event.target.getDuration());
                startTimeTracking();
              } else {
                stopTimeTracking();
              }
              
              if (state === YouTubePlayerState.ENDED && onEnded) {
                onEnded();
              }
            },
            onError: (event) => {
              console.error('YouTube player error:', event.data);
              if (onError) onError();
            },
          },
        });
      } catch (error) {
        console.error('Failed to initialize YouTube player:', error);
      }
    };

    // Check if YouTube API is already loaded
    if (window.YT && window.YT.Player) {
      initializePlayer();
    } else {
      // Wait for YouTube API to load
      window.onYouTubeIframeAPIReady = initializePlayer;
    }

    return () => {
      stopTimeTracking();
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.error('Error destroying YouTube player:', error);
        }
      }
    };
  }, []);

  // Update video when videoId changes
  useEffect(() => {
    if (playerRef.current && isReady && videoId) {
      try {
        playerRef.current.loadVideoById(videoId);
      } catch (error) {
        console.error('Error loading video:', error);
      }
    }
  }, [videoId, isReady]);

  const startTimeTracking = () => {
    stopTimeTracking();
    intervalRef.current = setInterval(() => {
      if (playerRef.current && isPlaying) {
        try {
          setCurrentTime(playerRef.current.getCurrentTime());
        } catch (error) {
          console.error('Error getting current time:', error);
        }
      }
    }, 1000);
  };

  const stopTimeTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const play = () => {
    if (playerRef.current && isReady) {
      try {
        playerRef.current.playVideo();
      } catch (error) {
        console.error('Error playing video:', error);
      }
    }
  };

  const pause = () => {
    if (playerRef.current && isReady) {
      try {
        playerRef.current.pauseVideo();
      } catch (error) {
        console.error('Error pausing video:', error);
      }
    }
  };

  const stop = () => {
    if (playerRef.current && isReady) {
      try {
        playerRef.current.stopVideo();
      } catch (error) {
        console.error('Error stopping video:', error);
      }
    }
  };

  const seekTo = (seconds: number) => {
    if (playerRef.current && isReady) {
      try {
        playerRef.current.seekTo(seconds, true);
      } catch (error) {
        console.error('Error seeking video:', error);
      }
    }
  };

  const setVolume = (newVolume: number) => {
    if (playerRef.current && isReady) {
      try {
        playerRef.current.setVolume(newVolume);
        setVolumeState(newVolume);
      } catch (error) {
        console.error('Error setting volume:', error);
      }
    }
  };

  const toggleMute = () => {
    if (playerRef.current && isReady) {
      try {
        if (isMuted) {
          playerRef.current.unMute();
          setIsMuted(false);
        } else {
          playerRef.current.mute();
          setIsMuted(true);
        }
      } catch (error) {
        console.error('Error toggling mute:', error);
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    containerRef,
    isReady,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    play,
    pause,
    stop,
    seekTo,
    setVolume,
    toggleMute,
    formatTime,
  };
};