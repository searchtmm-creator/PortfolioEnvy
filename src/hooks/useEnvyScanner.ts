import { useState, useEffect, useRef, useCallback } from 'react';
import { EnvyEngine, type NormalizedLandmark, type EnvyComponents } from '../services/EnvyEngine';

export interface UseEnvyScannerReturn {
  stream: MediaStream | null;
  envyScore: number | null;
  landmarks: NormalizedLandmark[] | null;
  blinkCount: number;
  blinkRate: number;
  confidence: number;
  components: EnvyComponents | null;
  isCalibrated: boolean;
  calibrationProgress: number;
  isLoadingModel: boolean;
  modelProgress: string;
  isCameraActive: boolean;
  error: string | null;
  startScanner: () => Promise<void>;
  stopScanner: () => void;
}

export function useEnvyScanner(projectId?: number | null): UseEnvyScannerReturn {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [envyScore, setEnvyScore] = useState<number | null>(null);
  const [landmarks, setLandmarks] = useState<NormalizedLandmark[] | null>(null);
  const [blinkCount, setBlinkCount] = useState<number>(0);
  const [blinkRate, setBlinkRate] = useState<number>(0);
  const [confidence, setConfidence] = useState<number>(0);
  const [components, setComponents] = useState<EnvyComponents | null>(null);
  const [isCalibrated, setIsCalibrated] = useState<boolean>(false);
  const [calibrationProgress, setCalibrationProgress] = useState<number>(0);
  const [isLoadingModel, setIsLoadingModel] = useState<boolean>(false);
  const [modelProgress, setModelProgress] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const activeLoopRef = useRef<number | null>(null);
  const lastProcessedTimeRef = useRef<number>(0);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const sessionPeakRef = useRef<number | null>(null);

  // Reset peak when projectId changes (e.g. entering/leaving a project)
  useEffect(() => {
    sessionPeakRef.current = null;
    const frameId = requestAnimationFrame(() => {
      setEnvyScore(null);
    });
    EnvyEngine.getInstance().reset();
    return () => cancelAnimationFrame(frameId);
  }, [projectId]);

  // Stop camera tracks safely and clean up state
  const stopScanner = useCallback(() => {
    if (activeLoopRef.current) {
      cancelAnimationFrame(activeLoopRef.current);
      activeLoopRef.current = null;
    }

    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
    }

    if (videoElementRef.current) {
      videoElementRef.current.srcObject = null;
      videoElementRef.current = null;
    }

    setIsCameraActive(false);
    setEnvyScore(null);
    setLandmarks(null);
    setBlinkCount(0);
    setBlinkRate(0);
    setConfidence(0);
    setComponents(null);
    setIsCalibrated(false);
    setCalibrationProgress(0);
    sessionPeakRef.current = null;
    EnvyEngine.getInstance().reset();
  }, [stream]);

  // Start model initialization and camera stream
  const startScanner = useCallback(async () => {
    setIsLoadingModel(true);
    setError(null);
    setModelProgress('Awakening bio-sensors...');

    try {
      // 1. Initialize Envy Engine (Loads WASM on-demand)
      const engine = EnvyEngine.getInstance();
      await engine.initialize((progress) => {
        setModelProgress(progress);
      });

      // 2. Request user camera access
      setModelProgress('Accessing camera peripheral...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      });

      setStream(mediaStream);
      setIsCameraActive(true);
    } catch (e: unknown) {
      console.error('Failed to start scanner:', e);
      const err = e as Error;
      setError(err.message || 'Access to camera denied or hardware not found.');
      setEnvyScore(null);
      setLandmarks(null);
      setBlinkCount(0);
      setBlinkRate(0);
      setConfidence(0);
      setComponents(null);
      setIsCalibrated(false);
      setCalibrationProgress(0);
      setIsCameraActive(false);
      stopScanner();
    } finally {
      setIsLoadingModel(false);
      setModelProgress('');
    }
  }, [stopScanner]);

  // Safe visibility change listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Turn off hardware immediately if tab is unfocused/minimized
      if (document.hidden) {
        stopScanner();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [stopScanner]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (activeLoopRef.current) {
        cancelAnimationFrame(activeLoopRef.current);
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // Framerate control loop throttled to 15 FPS
  useEffect(() => {
    if (!isCameraActive || !stream) {
      return;
    }

    const video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;
    video.playsInline = true;
    video.muted = true;
    videoElementRef.current = video;

    const engine = EnvyEngine.getInstance();
    const intervalMs = 1000 / 15; // 15 FPS throttling (~66.67ms)

    const processFrame = () => {
      if (!isCameraActive) return;

      const now = performance.now();
      if (now - lastProcessedTimeRef.current >= intervalMs) {
        // ReadyState 2 is HAVE_CURRENT_DATA, meaning frame data is available
        if (video.readyState >= 2) {
          const result = engine.calculateEnvy(video, now);

          if (result.score !== null) {
            if (sessionPeakRef.current === null) {
              sessionPeakRef.current = result.score;
            } else {
              sessionPeakRef.current = Math.max(sessionPeakRef.current, result.score);
            }
            setEnvyScore(sessionPeakRef.current);
          }
          setLandmarks(result.landmarks);
          setBlinkCount(result.blinkCount);
          setBlinkRate(result.blinkRate);
          setConfidence(result.confidence);
          setComponents(result.components);
          setIsCalibrated(result.isCalibrated);
          setCalibrationProgress(result.calibrationProgress);
        }
        lastProcessedTimeRef.current = now;
      }

      activeLoopRef.current = requestAnimationFrame(processFrame);
    };

    video.play()
      .then(() => {
        activeLoopRef.current = requestAnimationFrame(processFrame);
      })
      .catch((err) => {
        console.error('Error starting HTMLVideoElement playback:', err);
        setError('Video initialization failed.');
        setEnvyScore(null);
        setLandmarks(null);
      });

    return () => {
      if (activeLoopRef.current) {
        cancelAnimationFrame(activeLoopRef.current);
        activeLoopRef.current = null;
      }
    };
  }, [isCameraActive, stream]);

  return {
    stream,
    envyScore,
    landmarks,
    blinkCount,
    blinkRate,
    confidence,
    components,
    isCalibrated,
    calibrationProgress,
    isLoadingModel,
    modelProgress,
    isCameraActive,
    error,
    startScanner,
    stopScanner,
  };
}
