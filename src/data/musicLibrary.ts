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

  // More Happy songs
  {
    id: '15',
    title: 'Good as Hell',
    artist: 'Lizzo',
    youtubeId: 'SmbmeOgWsqE',
    mood: 'happy',
  },
  {
    id: '16',
    title: 'Shake It Off',
    artist: 'Taylor Swift',
    youtubeId: 'nfWlot6h_JM',
    mood: 'happy',
  },
  {
    id: '17',
    title: 'I Gotta Feeling',
    artist: 'The Black Eyed Peas',
    youtubeId: 'uSD4vsh1zDA',
    mood: 'happy',
  },
  {
    id: '18',
    title: 'Don\'t Stop Me Now',
    artist: 'Queen',
    youtubeId: 'HgzGwKwLmgM',
    mood: 'happy',
  },
  {
    id: '19',
    title: 'September',
    artist: 'Earth, Wind & Fire',
    youtubeId: 'Gs069dndIYk',
    mood: 'happy',
  },

  // More Sad songs
  {
    id: '20',
    title: 'The Sound of Silence',
    artist: 'Simon & Garfunkel',
    youtubeId: '4fWyzwo1xg0',
    mood: 'sad',
  },
  {
    id: '21',
    title: 'Everybody Hurts',
    artist: 'R.E.M.',
    youtubeId: '5rOiW_xY-kc',
    mood: 'sad',
  },
  {
    id: '22',
    title: 'Black',
    artist: 'Pearl Jam',
    youtubeId: 'cs-XZ_dN4Hc',
    mood: 'sad',
  },
  {
    id: '23',
    title: 'Tears in Heaven',
    artist: 'Eric Clapton',
    youtubeId: 'JxPj3GAYYZ0',
    mood: 'sad',
  },
  {
    id: '24',
    title: 'Hallelujah',
    artist: 'Jeff Buckley',
    youtubeId: 'y8AWFf7EAc4',
    mood: 'sad',
  },

  // More Angry songs
  {
    id: '25',
    title: 'Bodies',
    artist: 'Drowning Pool',
    youtubeId: '04F4xlWSFh0',
    mood: 'angry',
  },
  {
    id: '26',
    title: 'Chop Suey!',
    artist: 'System of a Down',
    youtubeId: 'CSvFpBOe8eY',
    mood: 'angry',
  },
  {
    id: '27',
    title: 'In the End',
    artist: 'Linkin Park',
    youtubeId: 'eVTXPUF4Oz4',
    mood: 'angry',
  },
  {
    id: '28',
    title: 'Freak on a Leash',
    artist: 'Korn',
    youtubeId: 'jRGrNDV2mKc',
    mood: 'angry',
  },

  // More Neutral/Calm songs
  {
    id: '29',
    title: 'Clair de Lune',
    artist: 'Claude Debussy',
    youtubeId: 'CvFH_6DNRCY',
    mood: 'neutral',
  },
  {
    id: '30',
    title: 'Mad World',
    artist: 'Tears for Fears',
    youtubeId: 'SFsHSHE-iJQ',
    mood: 'neutral',
  },
  {
    id: '31',
    title: 'Breathe Me',
    artist: 'Sia',
    youtubeId: 'hSjIz8oQuko',
    mood: 'neutral',
  },
  {
    id: '32',
    title: 'The Night We Met',
    artist: 'Lord Huron',
    youtubeId: 'KtlgYxa6BMU',
    mood: 'neutral',
  },
  {
    id: '33',
    title: 'Holocene',
    artist: 'Bon Iver',
    youtubeId: 'TWcyIpul8OE',
    mood: 'neutral',
  },

  // More Surprised/Excited songs
  {
    id: '34',
    title: 'Levitating',
    artist: 'Dua Lipa',
    youtubeId: 'TUVcZfQe-Kw',
    mood: 'surprised',
  },
  {
    id: '35',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    youtubeId: '4NRXx6U8ABQ',
    mood: 'surprised',
  },
  {
    id: '36',
    title: 'Mr. Blue Sky',
    artist: 'Electric Light Orchestra',
    youtubeId: 'wuJIqmha2Hc',
    mood: 'surprised',
  },
  {
    id: '37',
    title: 'Dancing Queen',
    artist: 'ABBA',
    youtubeId: 'xFrGuyw1V8s',
    mood: 'surprised',
  },
  {
    id: '38',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    youtubeId: 'fJ9rUzIMcZQ',
    mood: 'surprised',
  },

  // More Fearful songs (soothing/calming)
  {
    id: '39',
    title: 'Spiegel im Spiegel',
    artist: 'Arvo Pärt',
    youtubeId: 'TJ6Mzvh3XCc',
    mood: 'fearful',
  },
  {
    id: '40',
    title: 'On Earth as It Is in Heaven',
    artist: 'Angels & Airwaves',
    youtubeId: 'JMl8cQjBfqk',
    mood: 'fearful',
  },
  {
    id: '41',
    title: 'Svefn-g-englar',
    artist: 'Sigur Rós',
    youtubeId: '8LeQN249Jqw',
    mood: 'fearful',
  },
  {
    id: '42',
    title: 'Porcelain',
    artist: 'Moby',
    youtubeId: 'IJWlBfo5Oj0',
    mood: 'fearful',
  },

  // Disgusted songs (cleansing/uplifting)
  {
    id: '43',
    title: 'Cleanse Song',
    artist: 'Bright Eyes',
    youtubeId: 'zwFS69nA-1w',
    mood: 'disgusted',
  },
  {
    id: '44',
    title: 'Wash Away',
    artist: 'Joe Purdy',
    youtubeId: 'LfNVfiqKBeM',
    mood: 'disgusted',
  },
  {
    id: '45',
    title: 'Breathe',
    artist: 'Pink Floyd',
    youtubeId: 'mrojrDCI02k',
    mood: 'disgusted',
  },
  {
    id: '46',
    title: 'The Sound of Silence',
    artist: 'Disturbed',
    youtubeId: 'u9Dg-g7t2l4',
    mood: 'disgusted',
  },

  // Additional variety across moods
  {
    id: '47',
    title: 'Stressed Out',
    artist: 'Twenty One Pilots',
    youtubeId: 'pXRviuL6vMY',
    mood: 'neutral',
  },
  {
    id: '48',
    title: 'Pumped Up Kicks',
    artist: 'Foster the People',
    youtubeId: 'SDTZ7iX4vTQ',
    mood: 'neutral',
  },
  {
    id: '49',
    title: 'Radioactive',
    artist: 'Imagine Dragons',
    youtubeId: 'ktvTqknDobU',
    mood: 'angry',
  },
  {
    id: '50',
    title: 'Believer',
    artist: 'Imagine Dragons',
    youtubeId: 'IhP3J0j9JmY',
    mood: 'angry',
  },
  {
    id: '51',
    title: 'Sunflower',
    artist: 'Post Malone & Swae Lee',
    youtubeId: 'ApXoWvfEYVU',
    mood: 'happy',
  },
  {
    id: '52',
    title: 'Good 4 U',
    artist: 'Olivia Rodrigo',
    youtubeId: 'gNi_6U5Pm_o',
    mood: 'surprised',
  },
  {
    id: '53',
    title: 'Someone You Loved',
    artist: 'Lewis Capaldi',
    youtubeId: 'zABLecsR5UE',
    mood: 'sad',
  },
  {
    id: '54',
    title: 'Lovely',
    artist: 'Billie Eilish & Khalid',
    youtubeId: 'V1Pl8CzNzCw',
    mood: 'sad',
  },
];

export const getMoodPlaylist = (mood: string): Song[] => {
  return musicLibrary.filter(song => song.mood === mood);
};