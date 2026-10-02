import { useState, useEffect, useRef, useCallback } from 'react';
import type { NormalizedLandmark, EnvyComponents } from '../services/EnvyEngine';
import { getLoadedEngine, loadEngine } from '../services/scannerLoader';

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

export function useEnvyScanner(projectId?: number | null, sensitivity = 4): UseEnvyScannerReturn {
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

  const streamRef = useRef<MediaStream | null>(null);
  const requestVersion = useRef(0);
  const starting = useRef(false);

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
    getLoadedEngine()?.reset();
    return () => cancelAnimationFrame(frameId);
  }, [projectId]);

  // Stop camera tracks safely and clean up state
  const stopScanner = useCallback(() => {
    requestVersion.current += 1;
    starting.current = false;
    setIsLoadingModel(false);
    setModelProgress('');
    if (activeLoopRef.current) {
      cancelAnimationFrame(activeLoopRef.current);
      activeLoopRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
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
    getLoadedEngine()?.reset();
  }, []);

  // Start model initialization and camera stream
  const startScanner = useCallback(async () => {
    if (starting.current || streamRef.current) return;
    starting.current = true;
    const version = ++requestVersion.current;
    setIsLoadingModel(true);
    setError(null);
    setModelProgress('Awakening bio-sensors...');

    try {
      // 1. Initialize Envy Engine (Loads WASM on-demand)
      const engine = await loadEngine();
      if (version !== requestVersion.current) return;
      engine.setSensitivity(sensitivity);
      await engine.initialize((progress) => {
        if (version === requestVersion.current) setModelProgress(progress);
      });

      if (version !== requestVersion.current) return;
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera access is unavailable. Use a browser with camera support over HTTPS.');
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

      if (version !== requestVersion.current || document.hidden) {
        mediaStream.getTracks().forEach(track => track.stop());
        return;
      }
      streamRef.current = mediaStream;
      setStream(mediaStream);
      setIsCameraActive(true);
    } catch (e: unknown) {
      if (version !== requestVersion.current) return;
      const err = e as Error;
      const message = err.name === 'NotAllowedError' ? 'Camera permission was denied. Allow camera access in your browser to retry.'
        : err.name === 'NotFoundError' ? 'No camera was found. Connect a camera and retry.'
        : err.name === 'NotReadableError' ? 'The camera is unavailable or in use by another application.'
        : 'The scanner could not start. Check your connection and camera settings, then retry.';
      setError(message);
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
      if (version === requestVersion.current) {
        starting.current = false;
        setIsLoadingModel(false);
        setModelProgress('');
      }
    }
  }, [stopScanner, sensitivity]);

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

  // Cancel pending initialization as well as active hardware on unmount.
  useEffect(() => () => {
    requestVersion.current += 1;
    if (activeLoopRef.current) cancelAnimationFrame(activeLoopRef.current);
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    starting.current = false;
  }, []);

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

    const engine = getLoadedEngine();
    if (!engine) return;
    const intervalMs = 1000 / 15; // 15 FPS throttling (~66.67ms)

    let cancelled = false;
    const processFrame = () => {
      if (cancelled) return;

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
        if (cancelled) return;
        activeLoopRef.current = requestAnimationFrame(processFrame);
      })
      .catch((err) => {
        console.error('Error starting HTMLVideoElement playback:', err);
        if (cancelled) return;
        setError('The camera preview could not start. Retry the scanner.');
        stopScanner();
        setEnvyScore(null);
        setLandmarks(null);
      });

    return () => {
      cancelled = true;
      if (activeLoopRef.current) {
        cancelAnimationFrame(activeLoopRef.current);
        activeLoopRef.current = null;
      }
    };
  }, [isCameraActive, stream, stopScanner]);

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
