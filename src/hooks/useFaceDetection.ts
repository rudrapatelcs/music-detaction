import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { EmotionScores, MoodData } from '../types/mood';

export const useFaceDetection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMood, setCurrentMood] = useState<MoodData | null>(null);
  const [emotionScores, setEmotionScores] = useState<EmotionScores | null>(null);

  // Load face detection models
  useEffect(() => {
    let isMounted = true;

    const loadModels = async () => {
      try {
        console.log('Loading face detection models...');
        
        // Try loading from CDN first, fallback to local if needed
        const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@latest/model';
        
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        
        console.log('Models loaded successfully');
        
        if (isMounted) {
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to load models:', err);
        if (isMounted) {
          setError('Failed to load face detection models. Please check your internet connection.');
          setIsLoading(false);
        }
      }
    };

    loadModels();

    return () => {
      isMounted = false;
    };
  }, []);

  // Start camera when models are loaded
  useEffect(() => {
    let isMounted = true;

    const startCamera = async () => {
      if (isLoading || !videoRef.current) return;

      try {
        console.log('Starting camera...');
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          }
        });
        
        if (isMounted && videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          
          // Wait for video to be ready and start detection
          videoRef.current.onloadedmetadata = () => {
            console.log('Video ready, starting detection...');
            if (videoRef.current) {
              videoRef.current.play().then(() => {
                startDetection();
              }).catch(console.error);
            }
          };
        }
      } catch (err) {
        console.error('Camera access error:', err);
        if (isMounted) {
          setError('Failed to access camera. Please allow camera permissions and refresh.');
        }
      }
    };

    if (!isLoading) {
      startCamera();
    }

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isLoading]);

  const startDetection = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const detectEmotions = async () => {
      if (!videoRef.current || !canvasRef.current || videoRef.current.readyState !== 4) {
        return;
      }

      try {
        // Use TinyFaceDetector for better performance
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions({ 
            inputSize: 416,
            scoreThreshold: 0.5 
          }))
          .withFaceLandmarks()
          .withFaceExpressions();

        // Clear canvas
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        if (detections.length > 0) {
          console.log('Face detected, analyzing emotions...');
          const detection = detections[0];
          const expressions = detection.expressions;
          
          // Get all emotion scores
          const scores: EmotionScores = {
            neutral: expressions.neutral,
            happy: expressions.happy,
            sad: expressions.sad,
            angry: expressions.angry,
            fearful: expressions.fearful,
            disgusted: expressions.disgusted,
            surprised: expressions.surprised,
          };

          setEmotionScores(scores);

          // Find the dominant emotion
          const dominantEmotion = Object.entries(expressions).reduce((prev, current) => {
            return expressions[prev[0] as keyof typeof expressions] > expressions[current[0] as keyof typeof expressions] ? prev : current;
          });

          const [emotion, confidence] = dominantEmotion;
          console.log(`Detected emotion: ${emotion} with confidence: ${confidence}`);

          // Update mood with lower threshold for better detection
          if (confidence > 0.3) {
            setCurrentMood({
              mood: emotion,
              confidence: confidence,
              timestamp: Date.now(),
            });
          }

          // Draw face detection overlay
          const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
          faceapi.matchDimensions(canvas, displaySize);
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          
          // Draw bounding box and landmarks
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
          
          // Draw emotion label
          if (ctx) {
            ctx.fillStyle = '#00ff00';
            ctx.font = 'bold 16px Arial';
            ctx.fillText(
              `${emotion}: ${(confidence * 100).toFixed(1)}%`,
              detection.detection.box.x,
              detection.detection.box.y - 10
            );
          }
        } else {
          console.log('No face detected');
          // Keep the last detected mood for a short time instead of immediately clearing
          // This prevents flickering when face detection is momentarily lost
        }
      } catch (err) {
        console.error('Detection error:', err);
      }
    };

    // Start detection interval - more frequent for better responsiveness
    intervalRef.current = setInterval(detectEmotions, 500);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
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