import { useState, useEffect } from 'react';
import { MusicService } from '../services/musicService';
import { Song } from '../types/mood';

interface UseMusicLibraryReturn {
  playlist: Song[];
  isLoading: boolean;
  error: string | null;
  refreshPlaylist: () => Promise<void>;
  totalSongs: number;
}

export const useMusicLibrary = (mood: string): UseMusicLibraryReturn => {
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalSongs, setTotalSongs] = useState(0);

  const musicService = MusicService.getInstance();

  const loadPlaylist = async (refresh: boolean = false) => {
    if (!mood) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log(`Loading playlist for mood: ${mood}${refresh ? ' (refresh)' : ''}`);
      const songs = await musicService.getMoodPlaylist(mood, refresh);
      
      setPlaylist(songs);
      setTotalSongs(songs.length);
      
      if (songs.length === 0) {
        setError('No songs found for this mood. Try refreshing.');
      }
    } catch (err) {
      console.error('Error loading playlist:', err);
      setError('Failed to load playlist. Please try again.');
      setPlaylist([]);
      setTotalSongs(0);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPlaylist = async () => {
    await loadPlaylist(true);
  };

  // Load playlist when mood changes
  useEffect(() => {
    loadPlaylist();
  }, [mood]);

  return {
    playlist,
    isLoading,
    error,
    refreshPlaylist,
    totalSongs
  };
};