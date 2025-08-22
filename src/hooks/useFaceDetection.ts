import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { EmotionScores, MoodData } from '../types/mood';

export const useFaceDetection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const modelsLoadedRef = useRef(false);
  const videoStartedRef = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMood, setCurrentMood] = useState<MoodData | null>(null);
  const [emotionScores, setEmotionScores] = useState<EmotionScores | null>(null);

  // Load models only once
  useEffect(() => {
    const loadModels = async () => {
      if (modelsLoadedRef.current) return;
      
      try {
        console.log('Loading face detection models...');
        const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
        
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        
        console.log('Face detection models loaded successfully');
        modelsLoadedRef.current = true;
        setIsLoading(false);
      } catch (err) {
        console.error('Model loading error:', err);
        setError('Failed to load face detection models. Please refresh the page.');
        setIsLoading(false);
      }
    };

    loadModels();
  }, []); // Empty dependency array - run only once

  // Start video only once after models are loaded
  useEffect(() => {
    const startVideo = async () => {
      if (!modelsLoadedRef.current || videoStartedRef.current || !videoRef.current) return;
      
      try {
        console.log('Starting camera...');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 }
        });
        
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        videoStartedRef.current = true;
        console.log('Camera started successfully');
      } catch (err) {
        console.error('Camera error:', err);
        setError('Failed to access camera. Please allow camera permissions.');
      }
    };

    if (!isLoading) {
      startVideo();
    }
  }, [isLoading]); // Only depend on isLoading

  // Start detection only once after video is ready
  useEffect(() => {
    const detectEmotions = async () => {
      if (!videoRef.current || !canvasRef.current || !modelsLoadedRef.current || !videoStartedRef.current) {
        return;
      }

      try {
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
          .withFaceLandmarks()
          .withFaceExpressions();

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        if (detections.length > 0) {
          const expressions = detections[0].expressions;
          
          // Find dominant emotion
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
          
          // Update mood if confidence is high enough
          if (dominantEmotion[1] > 0.3) {
            setCurrentMood({
              mood: dominantEmotion[0],
              confidence: dominantEmotion[1],
              timestamp: Date.now(),
            });
          }

          // Draw detections
          const displaySize = { width: 640, height: 480 };
          faceapi.matchDimensions(canvas, displaySize);
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          
          if (ctx) {
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            ctx.fillStyle = '#00ff00';
            ctx.font = 'bold 16px Arial';
          }
          
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
          faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        }
      } catch (err) {
        console.error('Detection error:', err);
      }
    };

    const startDetection = () => {
      if (intervalRef.current) return; // Prevent multiple intervals
      
      console.log('Starting emotion detection...');
      intervalRef.current = setInterval(detectEmotions, 1000);
    };

    // Start detection when everything is ready
    if (!isLoading && modelsLoadedRef.current && videoStartedRef.current) {
      // Small delay to ensure video is fully loaded
      const timer = setTimeout(startDetection, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]); // Only depend on isLoading

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  return {
    videoRef,
    canvasRef,
    isLoading,
    error,
    currentMood,
    emotionScores,
  };
};