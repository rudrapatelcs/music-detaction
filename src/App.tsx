import React, { useState } from 'react';
import { useEffect } from 'react';
import { Music, Brain, Sparkles } from 'lucide-react';
import LoginPage from './components/LoginPage';
import CameraFeed from './components/CameraFeed';
import { MusicPlayer } from './components/MusicPlayer';
import { useFaceDetection } from './hooks/useFaceDetection';
import { getMoodPlaylist } from './data/musicLibrary';

function App() {
  const [user, setUser] = useState<any>(null);
  const { currentMood } = useFaceDetection();
  const [manualMood, setManualMood] = useState<string>('');
  const [lastAutoMood, setLastAutoMood] = useState<string>('neutral');

  // Update last auto mood when detection changes
  React.useEffect(() => {
    if (currentMood?.mood && currentMood.confidence > 0.3) {
      setLastAutoMood(currentMood.mood);
    }
  }, [currentMood]);

  // Use manual mood if set, otherwise use detected mood or last detected mood
  const activeMood = manualMood || lastAutoMood;

  // Get playlist for current mood
  const playlist = getMoodPlaylist(activeMood);

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setManualMood('');
  };

  // Show login page if user is not authenticated
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const moods = ['happy', 'sad', 'angry', 'neutral', 'surprised', 'fearful', 'disgusted'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <Music className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">MoodTune AI</h1>
                <p className="text-gray-300 text-sm">AI-Powered Emotion Music System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-white text-sm">Welcome, {user.name || user.email}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-white text-sm transition-colors ml-2"
                >
                  Logout
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">
                  Current Mood: <span className="capitalize text-blue-400">{activeMood}</span>
                  {!manualMood && currentMood && (
                    <span className="text-xs text-gray-400 ml-2">
                      ({(currentMood.confidence * 100).toFixed(0)}% confidence)
                    </span>
                  )}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 text-sm">Live</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Manual Mood Override */}
        <div className="mb-8 bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-4">Manual Mood Override</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setManualMood('')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                !manualMood
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Auto Detect
            </button>
            {moods.map((mood) => (
              <button
                key={mood}
                onClick={() => setManualMood(mood)}
                className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                  manualMood === mood
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          <CameraFeed />
          <MusicPlayer playlist={playlist} currentMood={activeMood} />
        </div>

        {/* Stats Section */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-white font-semibold">AI Detection</h4>
                <p className="text-gray-400 text-sm">Real-time analysis</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-white">
              {currentMood ? `${(currentMood.confidence * 100).toFixed(1)}%` : '0%'}
            </p>
            <p className="text-gray-400 text-sm">Accuracy</p>
          </div>

          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-white font-semibold">Songs Available</h4>
                <p className="text-gray-400 text-sm">Curated library</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-white">84</p>
            <p className="text-gray-400 text-sm">Across all moods</p>
          </div>

          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-white font-semibold">Active Mood</h4>
                <p className="text-gray-400 text-sm">Currently playing</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-white capitalize">{activeMood}</p>
            <p className="text-gray-400 text-sm">
              {manualMood ? 'Manual override' : 'Auto detected'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;