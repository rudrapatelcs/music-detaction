import { useEffect, useRef, useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import { EmotionScores, MoodData } from '../types/mood';

export const useFaceDetection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMood, setCurrentMood] = useState<MoodData | null>(null);
  const [emotionScores, setEmotionScores] = useState<EmotionScores | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const loadModels = async () => {
    try {
      // Use CDN models since local models are missing/corrupted
      const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
      
      console.log('Loading face detection models...');
      
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
      ]);
      
      console.log('Face detection models loaded successfully');
      setModelsLoaded(true);
    } catch (err) {
      setError('Failed to load face detection models. Please check your internet connection and try refreshing the page.');
      console.error('Model loading error:', err);
    }
  };

  const startVideo = async () => {
    try {
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log('Camera access granted');
      }
    } catch (err) {
      const error = err as Error;
      console.error('Camera access error:', error);
      if (error.name === 'NotAllowedError' || error.message.includes('Permission dismissed')) {
        setError('Camera access denied. Please click the camera icon in your browser\'s address bar and select "Allow" to enable mood detection.');
      } else if (error.name === 'NotFoundError') {
        setError('No camera found. Please connect a camera and refresh the page.');
      } else {
        setError('Failed to access camera. Please check your camera permissions and try again.');
      }
    }
  };

  const detectEmotions = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !modelsLoaded) return;

    try {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender();

      if (detections.length > 0) {
        const expressions = detections[0].expressions;
        const ageGender = detections[0].ageAndGender;
        
        // Apply confidence threshold for more reliable detection
        const minConfidence = 0.25;
        const dominantEmotion = Object.entries(expressions).reduce((a, b) => 
          expressions[a[0] as keyof typeof expressions] > expressions[b[0] as keyof typeof expressions] ? a : b
        );

        const emotionScores: EmotionScores = {
          neutral: expressions.neutral,
          happy: expressions.happy,
          sad: expressions.sad,
          angry: expressions.angry,
          fearful: expressions.fearful,
          disgusted: expressions.disgusted,
          surprised: expressions.surprised,
        };

        setEmotionScores(emotionScores);
        
        // Only update mood if confidence is above threshold
        if (dominantEmotion[1] > minConfidence) {
          const newMood = {
            mood: dominantEmotion[0],
            confidence: dominantEmotion[1],
            timestamp: Date.now(),
          };
          
          console.log('Face detection: New mood detected:', newMood.mood, 'confidence:', (newMood.confidence * 100).toFixed(1) + '%');
          setCurrentMood(newMood);
        } else {
          console.log('Face detection: Low confidence detection, keeping previous mood');
        }

        // Draw detections
        const canvas = canvasRef.current;
        const displaySize = { width: 640, height: 480 };
        faceapi.matchDimensions(canvas, displaySize);
        
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Set drawing styles for better visibility
          ctx.strokeStyle = '#00ff00';
          ctx.lineWidth = 2;
          ctx.fillStyle = '#00ff00';
          ctx.font = 'bold 16px Arial';
        }
        
        // Draw face detection boxes and landmarks
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        
        // Draw age and gender info
        if (ageGender) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#00ff00';
            ctx.font = 'bold 18px Arial';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            
            const text = `${Math.round(ageGender.age)} years, ${ageGender.gender}`;
            const x = detections[0].detection.box.x;
            const y = detections[0].detection.box.y - 15;
            
            // Draw text with outline for better visibility
            ctx.strokeText(text, x, y);
            ctx.fillText(
              text,
              x,
              y
            );
          }
        }
      } else {
        // Clear canvas if no face detected
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    } catch (err) {
      console.error('Detection error:', err);
    }
  }, [modelsLoaded]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  useEffect(() => {
    console.log('Initializing face detection...');
    loadModels();
  }, []);

  useEffect(() => {
    if (modelsLoaded) {
      console.log('Models loaded, starting video...');
      startVideo().then(() => {
        console.log('Video started, detection ready');
        setIsLoading(false);
      });
    }
  }, [modelsLoaded]);

  useEffect(() => {
    cleanup(); // Clear any existing interval
    
    if (!isLoading && modelsLoaded) {
      console.log('Starting emotion detection interval...');
      intervalRef.current = setInterval(detectEmotions, 500); // Reduced frequency to prevent overload
    }
    
    return cleanup;
  }, [isLoading, modelsLoaded, detectEmotions, cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
      // Stop video stream
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cleanup]);
  return {
    videoRef,
    canvasRef,
    isLoading,
    error,
    currentMood,
    emotionScores,
  };
};