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
      // Use CDN models as fallback since local models are corrupted
      const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);
    } catch (err) {
      setError('Failed to load face detection models');
      console.error('Model loading error:', err);
    }
  }, []);

  const startVideo = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Failed to access camera');
      console.error('Camera error:', err);
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
        canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      }
    } catch (err) {
      console.error('Detection error:', err);
    }
  }, [modelsLoaded]);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  useEffect(() => {
    if (modelsLoaded) {
      startVideo().then(() => {
        setIsLoading(false);
      });
    }
  }, [modelsLoaded, startVideo]);

  useEffect(() => {
    if (!isLoading && modelsLoaded) {
      const interval = setInterval(detectEmotions, 1000);
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