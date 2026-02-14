interface YouTubeSearchResult {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    description: string;
  };
}

interface YouTubeSearchResponse {
  items: YouTubeSearchResult[];
}

export class MusicService {
  private static instance: MusicService;
  private cache: Map<string, any[]> = new Map();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private cacheTimestamps: Map<string, number> = new Map();

  private constructor() {}

  static getInstance(): MusicService {
    if (!MusicService.instance) {
      MusicService.instance = new MusicService();
    }
    return MusicService.instance;
  }

  private getMoodSearchTerms(mood: string): string[] {
    const searchTerms: Record<string, string[]> = {
      happy: [
        'happy upbeat songs',
        'feel good music',
        'uplifting pop songs',
        'cheerful music',
        'positive vibes songs'
      ],
      sad: [
        'sad emotional songs',
        'melancholy music',
        'heartbreak songs',
        'emotional ballads',
        'slow sad music'
      ],
      angry: [
        'angry rock songs',
        'aggressive music',
        'metal songs',
        'intense music',
        'hard rock songs'
      ],
      neutral: [
        'chill ambient music',
        'relaxing instrumental',
        'calm background music',
        'peaceful songs',
        'meditation music'
      ],
      surprised: [
        'energetic dance music',
        'exciting pop songs',
        'upbeat electronic',
        'party music',
        'high energy songs'
      ],
      fearful: [
        'calming peaceful music',
        'soothing instrumental',
        'anxiety relief music',
        'gentle acoustic songs',
        'comfort music'
      ],
      disgusted: [
        'cleansing uplifting music',
        'fresh positive songs',
        'renewal music',
        'inspiring songs',
        'motivational music'
      ]
    };

    return searchTerms[mood] || searchTerms.neutral;
  }

  private async searchYouTube(query: string, maxResults: number = 10): Promise<any[]> {
    try {
      // Using YouTube's public search without API key (limited functionality)
      // In a real app, you'd use YouTube Data API v3 with proper API key
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&maxResults=${maxResults}&key=YOUR_API_KEY`;
      
      // For demo purposes, we'll return mock data based on the query
      return this.getMockSongs(query, maxResults);
    } catch (error) {
      console.error('YouTube search error:', error);
      return this.getMockSongs(query, maxResults);
    }
  }

  private getMockSongs(query: string, count: number): any[] {
    // Mock song database for demonstration
    const mockSongs: Record<string, any[]> = {
      'happy upbeat songs': [
        { id: 'happy1', title: 'Happy', artist: 'Pharrell Williams', youtubeId: 'ZbZSe6N_BXs' },
        { id: 'happy2', title: 'Can\'t Stop the Feeling!', artist: 'Justin Timberlake', youtubeId: 'ru0K8uYEZWw' },
        { id: 'happy3', title: 'Good as Hell', artist: 'Lizzo', youtubeId: 'SmbmeOgWsqE' },
        { id: 'happy4', title: 'Shake It Off', artist: 'Taylor Swift', youtubeId: 'nfWlot6h_JM' },
        { id: 'happy5', title: 'Walking on Sunshine', artist: 'Katrina and the Waves', youtubeId: 'iPUmE-tne5U' }
      ],
      'sad emotional songs': [
        { id: 'sad1', title: 'Someone Like You', artist: 'Adele', youtubeId: 'hLQl3WQQoQ0' },
        { id: 'sad2', title: 'Mad World', artist: 'Gary Jules', youtubeId: '4N3N1MlvVc4' },
        { id: 'sad3', title: 'Hurt', artist: 'Johnny Cash', youtubeId: '8AHCfZTRGiI' },
        { id: 'sad4', title: 'The Sound of Silence', artist: 'Simon & Garfunkel', youtubeId: '4fWyzwo1xg0' },
        { id: 'sad5', title: 'Everybody Hurts', artist: 'R.E.M.', youtubeId: '5rOiW_xY-kc' }
      ],
      'angry rock songs': [
        { id: 'angry1', title: 'Killing in the Name', artist: 'Rage Against the Machine', youtubeId: 'bWXazVhlyxQ' },
        { id: 'angry2', title: 'Break Stuff', artist: 'Limp Bizkit', youtubeId: 'ZpUYjpKg9KY' },
        { id: 'angry3', title: 'Bodies', artist: 'Drowning Pool', youtubeId: '04F4xlWSFh0' },
        { id: 'angry4', title: 'Chop Suey!', artist: 'System of a Down', youtubeId: 'CSvFpBOe8eY' },
        { id: 'angry5', title: 'In the End', artist: 'Linkin Park', youtubeId: 'eVTXPUF4Oz4' }
      ],
      'chill ambient music': [
        { id: 'neutral1', title: 'Weightless', artist: 'Marconi Union', youtubeId: 'UfcAVejslrU' },
        { id: 'neutral2', title: 'Claire de Lune', artist: 'Claude Debussy', youtubeId: 'CvFH_6DNRCY' },
        { id: 'neutral3', title: 'Breathe Me', artist: 'Sia', youtubeId: 'hSjIz8oQuko' },
        { id: 'neutral4', title: 'The Night We Met', artist: 'Lord Huron', youtubeId: 'KtlgYxa6BMU' },
        { id: 'neutral5', title: 'Holocene', artist: 'Bon Iver', youtubeId: 'TWcyIpul8OE' }
      ],
      'energetic dance music': [
        { id: 'surprised1', title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', youtubeId: 'OPf0YbXqDm0' },
        { id: 'surprised2', title: 'Levitating', artist: 'Dua Lipa', youtubeId: 'TUVcZfQe-Kw' },
        { id: 'surprised3', title: 'Blinding Lights', artist: 'The Weeknd', youtubeId: '4NRXx6U8ABQ' },
        { id: 'surprised4', title: 'Dancing Queen', artist: 'ABBA', youtubeId: 'xFrGuyw1V8s' },
        { id: 'surprised5', title: 'Mr. Blue Sky', artist: 'Electric Light Orchestra', youtubeId: 'wuJIqmha2Hc' }
      ],
      'calming peaceful music': [
        { id: 'fearful1', title: 'Aqueous Transmission', artist: 'Incubus', youtubeId: 'eQK7KSTQfaw' },
        { id: 'fearful2', title: 'Gymnopédie No. 1', artist: 'Erik Satie', youtubeId: 'S-Xm7s9eGM0' },
        { id: 'fearful3', title: 'Spiegel im Spiegel', artist: 'Arvo Pärt', youtubeId: 'TJ6Mzvh3XCc' },
        { id: 'fearful4', title: 'Svefn-g-englar', artist: 'Sigur Rós', youtubeId: '8LeQN249Jqw' },
        { id: 'fearful5', title: 'Porcelain', artist: 'Moby', youtubeId: 'IJWlBfo5Oj0' }
      ],
      'cleansing uplifting music': [
        { id: 'disgusted1', title: 'Breathe', artist: 'Pink Floyd', youtubeId: 'mrojrDCI02k' },
        { id: 'disgusted2', title: 'The Sound of Silence', artist: 'Disturbed', youtubeId: 'u9Dg-g7t2l4' },
        { id: 'disgusted3', title: 'Cleanse Song', artist: 'Bright Eyes', youtubeId: 'zwFS69nA-1w' },
        { id: 'disgusted4', title: 'Wash Away', artist: 'Joe Purdy', youtubeId: 'LfNVfiqKBeM' },
        { id: 'disgusted5', title: 'Here Comes the Sun', artist: 'The Beatles', youtubeId: 'KQetemT1sWc' }
      ]
    };

    // Find matching songs based on query keywords
    for (const [key, songs] of Object.entries(mockSongs)) {
      if (query.toLowerCase().includes(key.toLowerCase()) || 
          key.toLowerCase().includes(query.toLowerCase())) {
        return songs.slice(0, count).map(song => ({
          ...song,
          mood: this.extractMoodFromQuery(query)
        }));
      }
    }

    // Default fallback
    return mockSongs['chill ambient music'].slice(0, count).map(song => ({
      ...song,
      mood: 'neutral'
    }));
  }

  private extractMoodFromQuery(query: string): string {
    const moodKeywords: Record<string, string> = {
      'happy': 'happy',
      'upbeat': 'happy',
      'cheerful': 'happy',
      'sad': 'sad',
      'emotional': 'sad',
      'melancholy': 'sad',
      'angry': 'angry',
      'aggressive': 'angry',
      'rock': 'angry',
      'chill': 'neutral',
      'ambient': 'neutral',
      'calm': 'neutral',
      'energetic': 'surprised',
      'dance': 'surprised',
      'party': 'surprised',
      'peaceful': 'fearful',
      'soothing': 'fearful',
      'calming': 'fearful',
      'uplifting': 'disgusted',
      'cleansing': 'disgusted',
      'inspiring': 'disgusted'
    };

    for (const [keyword, mood] of Object.entries(moodKeywords)) {
      if (query.toLowerCase().includes(keyword)) {
        return mood;
      }
    }

    return 'neutral';
  }

  private isCacheValid(mood: string): boolean {
    const timestamp = this.cacheTimestamps.get(mood);
    if (!timestamp) return false;
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  async getMoodPlaylist(mood: string, refresh: boolean = false): Promise<any[]> {
    // Check cache first
    if (!refresh && this.cache.has(mood) && this.isCacheValid(mood)) {
      console.log(`Using cached playlist for mood: ${mood}`);
      return this.cache.get(mood) || [];
    }

    console.log(`Generating new playlist for mood: ${mood}`);
    
    try {
      const searchTerms = this.getMoodSearchTerms(mood);
      const allSongs: any[] = [];

      // Search for songs using different terms
      for (let i = 0; i < Math.min(2, searchTerms.length); i++) {
        const songs = await this.searchYouTube(searchTerms[i], 5);
        allSongs.push(...songs);
      }

      // Remove duplicates and limit to 10 songs
      const uniqueSongs = allSongs.filter((song, index, self) => 
        index === self.findIndex(s => s.youtubeId === song.youtubeId)
      ).slice(0, 10);

      // Cache the results
      this.cache.set(mood, uniqueSongs);
      this.cacheTimestamps.set(mood, Date.now());

      return uniqueSongs;
    } catch (error) {
      console.error('Error generating playlist:', error);
      
      // Return cached data if available, otherwise empty array
      return this.cache.get(mood) || [];
    }
  }

  async refreshPlaylist(mood: string): Promise<any[]> {
    return this.getMoodPlaylist(mood, true);
  }

  clearCache(): void {
    this.cache.clear();
    this.cacheTimestamps.clear();
  }

  getCacheInfo(): { mood: string; songCount: number; age: string }[] {
    const info: { mood: string; songCount: number; age: string }[] = [];
    
    for (const [mood, songs] of this.cache.entries()) {
      const timestamp = this.cacheTimestamps.get(mood) || 0;
      const ageMs = Date.now() - timestamp;
      const ageHours = Math.floor(ageMs / (1000 * 60 * 60));
      const ageMinutes = Math.floor((ageMs % (1000 * 60 * 60)) / (1000 * 60));
      
      info.push({
        mood,
        songCount: songs.length,
        age: `${ageHours}h ${ageMinutes}m`
      });
    }
    
    return info;
  }
}