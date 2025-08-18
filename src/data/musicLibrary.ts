import { Song } from '../types/mood';

export const musicLibrary: Song[] = [
  // Happy songs
  {
    id: '1',
    title: 'Happy',
    artist: 'Pharrell Williams',
    youtubeId: 'ZbZSe6N_BXs',
    mood: 'happy',
  },
  {
    id: '2', 
    title: 'Can\'t Stop the Feeling!',
    artist: 'Justin Timberlake',
    youtubeId: 'ru0K8uYEZWw',
    mood: 'happy',
  },
  {
    id: '3',
    title: 'Walking on Sunshine',
    artist: 'Katrina and the Waves',
    youtubeId: 'iPUmE-tne5U',
    mood: 'happy',
  },

  // Sad songs
  {
    id: '4',
    title: 'Someone Like You',
    artist: 'Adele',
    youtubeId: 'hLQl3WQQoQ0',
    mood: 'sad',
  },
  {
    id: '5',
    title: 'Mad World',
    artist: 'Gary Jules',
    youtubeId: '4N3N1MlvVc4',
    mood: 'sad',
  },
  {
    id: '6',
    title: 'Hurt',
    artist: 'Johnny Cash',
    youtubeId: '8AHCfZTRGiI',
    mood: 'sad',
  },

  // Angry songs
  {
    id: '7',
    title: 'Killing in the Name',
    artist: 'Rage Against the Machine',
    youtubeId: 'bWXazVhlyxQ',
    mood: 'angry',
  },
  {
    id: '8',
    title: 'Break Stuff',
    artist: 'Limp Bizkit',
    youtubeId: 'ZpUYjpKg9KY',
    mood: 'angry',
  },

  // Neutral/Calm songs
  {
    id: '9',
    title: 'Weightless',
    artist: 'Marconi Union',
    youtubeId: 'UfcAVejslrU',
    mood: 'neutral',
  },
  {
    id: '10',
    title: 'Claire de Lune',
    artist: 'Claude Debussy',
    youtubeId: 'CvFH_6DNRCY',
    mood: 'neutral',
  },

  // Surprised/Excited songs
  {
    id: '11',
    title: 'Uptown Funk',
    artist: 'Mark Ronson ft. Bruno Mars',
    youtubeId: 'OPf0YbXqDm0',
    mood: 'surprised',
  },
  {
    id: '12',
    title: 'Thunderstruck',
    artist: 'AC/DC',
    youtubeId: 'v2AC41dglnM',
    mood: 'surprised',
  },

  // Fearful songs (ambient/calming to help with fear)
  {
    id: '13',
    title: 'Aqueous Transmission',
    artist: 'Incubus',
    youtubeId: 'eQK7KSTQfaw',
    mood: 'fearful',
  },
  {
    id: '14',
    title: 'Gymnopédie No. 1',
    artist: 'Erik Satie',
    youtubeId: 'S-Xm7s9eGM0',
    mood: 'fearful',
  },
];

export const getMoodPlaylist = (mood: string): Song[] => {
  return musicLibrary.filter(song => song.mood === mood);
};