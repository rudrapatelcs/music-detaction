import { useEffect, useRef, useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import { EmotionScores, MoodData } from '../types/mood';

export const useFaceDetection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMood, setCurrentMood] = useState<MoodData | null>(null);
  const [emotionScores, setEmotionScores] = useState<EmotionScores | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const loadModels = useCallback(async () => {
    try {
      // Use CDN models since local models are missing/corrupted
      const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
      
      console.log('Loading face detection models...');
      
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
      
      console.log('Face detection models loaded successfully');
      setModelsLoaded(true);
    } catch (err) {
      setError('Failed to load face detection models. Please check your internet connection and try refreshing the page.');
      console.error('Model loading error:', err);
    }
  }, []);

  const startVideo = useCallback(async () => {
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
  }, []);

  const detectEmotions = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !modelsLoaded) return;

    try {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detections.length > 0) {
        const expressions = detections[0].expressions;
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
        setCurrentMood({
          mood: dominantEmotion[0],
          confidence: dominantEmotion[1],
          timestamp: Date.now(),
        });

        // Draw detections
        const canvas = canvasRef.current;
        const displaySize = { width: 640, height: 480 };
        faceapi.matchDimensions(canvas, displaySize);
        
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
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

  useEffect(() => {
    console.log('Initializing face detection...');
    loadModels();
  }, [loadModels]);

  useEffect(() => {
    if (modelsLoaded) {
      console.log('Models loaded, starting video...');
      startVideo().then(() => {
        console.log('Video started, detection ready');
        setIsLoading(false);
      });
    }
  }, [modelsLoaded, startVideo]);

  useEffect(() => {
    if (!isLoading && modelsLoaded) {
      console.log('Starting emotion detection interval...');
      const interval = setInterval(detectEmotions, 500); // Increased frequency for better responsiveness
      return () => clearInterval(interval);
    }
  }, [isLoading, modelsLoaded, detectEmotions]);

  return {
    videoRef,
    canvasRef,
    isLoading,
    error,
    currentMood,
    emotionScores,
  };
};