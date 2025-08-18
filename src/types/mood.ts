export interface MoodData {
  mood: string;
  confidence: number;
  timestamp: number;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
  mood: string;
  duration?: string;
}

export interface EmotionScores {
  neutral: number;
  happy: number;
  sad: number;
  angry: number;
  fearful: number;
  disgusted: number;
  surprised: number;
}