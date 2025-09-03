import React from 'react';
import { useFaceDetection } from '../hooks/useFaceDetection';
import { Camera, AlertCircle, Loader } from 'lucide-react';

const CameraFeed: React.FC = () => {
  const { videoRef, canvasRef, isLoading, error, currentMood, emotionScores } = useFaceDetection();

  if (error) {
    return (
      <div className="flex-1 bg-gray-900 rounded-lg p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">Camera Error</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Camera className="w-6 h-6 text-blue-400" />
          <h2 className="text-white font-semibold text-lg">Mood Detection</h2>
        </div>
        {isLoading && (
          <div className="flex items-center space-x-2">
            <Loader className="w-4 h-4 text-blue-400 animate-spin" />
            <span className="text-gray-400 text-sm">Loading models...</span>
          </div>
        )}
      </div>

      <div className="relative bg-black rounded-lg overflow-hidden mb-6">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          width="640"
          height="480"
          className="w-full h-auto block"
        />
        <canvas
          ref={canvasRef}
          width="640"
          height="480"
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ zIndex: 10 }}
        />
        
        {/* Status overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center">
              <Loader className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-2" />
              <p className="text-white text-sm">Loading AI models...</p>
            </div>
          </div>
        )}
      </div>

      {currentMood && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white capitalize mb-2">
              {currentMood.mood}
            </h3>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  currentMood.mood === 'happy' 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                    : currentMood.mood === 'sad'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                    : currentMood.mood === 'angry'
                    ? 'bg-gradient-to-r from-red-500 to-red-700'
                    : currentMood.mood === 'surprised'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                    : currentMood.mood === 'fearful'
                    ? 'bg-gradient-to-r from-gray-500 to-gray-700'
                    : currentMood.mood === 'disgusted'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-700'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-500' // neutral
                }`}
                style={{ width: `${currentMood.confidence * 100}%` }}
              />
            </div>
            <p className="text-gray-400 text-sm mt-1">
              {(currentMood.confidence * 100).toFixed(1)}% confidence
              {currentMood.confidence > 0.7 && <span className="text-green-400 ml-2">High</span>}
              {currentMood.confidence > 0.5 && currentMood.confidence <= 0.7 && <span className="text-yellow-400 ml-2">Medium</span>}
              {currentMood.confidence <= 0.5 && <span className="text-red-400 ml-2">Low</span>}
            </p>
          </div>

          {emotionScores && (
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(emotionScores).map(([emotion, score]) => (
                <div key={emotion} className="flex justify-between items-center">
                  <span className="text-gray-400 capitalize">{emotion}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-700 rounded-full h-1">
                      <div
                        className={`h-1 rounded-full transition-all duration-300 ${
                          emotion === 'happy' 
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                            : emotion === 'sad'
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                            : emotion === 'angry'
                            ? 'bg-gradient-to-r from-red-500 to-red-700'
                            : emotion === 'surprised'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                            : emotion === 'fearful'
                            ? 'bg-gradient-to-r from-gray-500 to-gray-700'
                            : emotion === 'disgusted'
                            ? 'bg-gradient-to-r from-green-600 to-emerald-700'
                            : 'bg-gradient-to-r from-cyan-500 to-blue-500' // neutral
                        }`}
                        style={{ width: `${score * 100}%` }}
                      />
                    </div>
                    <span className="text-white w-10 text-right">
                      {(score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CameraFeed;