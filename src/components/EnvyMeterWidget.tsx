import React, { useEffect, useRef, useState } from 'react';
import { useSpring, useMotionValue, motion, AnimatePresence } from 'framer-motion';
import { Camera, Eye, EyeOff, Loader2, AlertTriangle } from 'lucide-react';
import { useEnvyScanner } from '../hooks/useEnvyScanner';

import { playSound } from '../services/sound';
import { EnvyEngine } from '../services/EnvyEngine';

interface EnvyMeterWidgetProps {
  onScoreChange?: (score: number | null) => void;
  onActiveChange?: (isActive: boolean) => void;
  onInfoToggle?: (isOpen: boolean) => void;
  displayScoreOverride?: number | null;
  projectId?: number | null;
}

export const EnvyMeterWidget: React.FC<EnvyMeterWidgetProps> = ({
  onScoreChange,
  onActiveChange,
  onInfoToggle,
  displayScoreOverride,
  projectId,
}) => {
  const [showInfo, setShowInfo] = useState(false);

  const [sensitivity] = useState(4);

  useEffect(() => {
    EnvyEngine.getInstance().setSensitivity(sensitivity);
  }, [sensitivity]);

  const {
    stream,
    envyScore,
    landmarks,
    blinkCount,
    blinkRate,

    components,
    isCalibrated,
    calibrationProgress,
    isLoadingModel,
    modelProgress,
    isCameraActive,
    error,
    startScanner,
    stopScanner,
  } = useEnvyScanner(projectId);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  // Framer Motion spring setup for decimal rendering
  const motionScore = useMotionValue(1.0);
  const springScore = useSpring(motionScore, { stiffness: 80, damping: 15 });

  // Track the last peak so we can fire the success chime once on threshold cross.
  const peakedRef = useRef(false);

  // Sync internal/external scores
  useEffect(() => {
    const activeScore = displayScoreOverride !== undefined && displayScoreOverride !== null 
      ? displayScoreOverride 
      : envyScore;
      
    if (activeScore !== null) {
      motionScore.set(activeScore);
    }
    if (onScoreChange) {
      onScoreChange(envyScore);
    }
  }, [envyScore, displayScoreOverride, motionScore, onScoreChange]);

  // Sync camera active state to parent
  useEffect(() => {
    if (onActiveChange) {
      onActiveChange(isCameraActive);
    }
  }, [isCameraActive, onActiveChange]);

  // Sync info panel open state to parent
  useEffect(() => {
    if (onInfoToggle) {
      onInfoToggle(showInfo);
    }
  }, [showInfo, onInfoToggle]);

  // Track peak threshold cross without success chime.
  useEffect(() => {
    if (!isCameraActive || envyScore === null) {
      peakedRef.current = false;
      return;
    }
    if (envyScore >= 8.0 && !peakedRef.current) {
      peakedRef.current = true;
    } else if (envyScore < 7.0) {
      peakedRef.current = false;
    }
  }, [envyScore, isCameraActive]);

  // Auto-activate camera peripheral if developer query parameter is present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autoActivateScanner') === 'true') {
      const timer = setTimeout(() => {
        startScanner();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [startScanner]);

  useEffect(() => {
    const unsubscribe = springScore.on('change', (latest) => {
      const activeScore = displayScoreOverride !== undefined && displayScoreOverride !== null 
        ? displayScoreOverride 
        : envyScore;
        
      if (spanRef.current && activeScore !== null) {
        spanRef.current.textContent = latest.toFixed(1);
      }
    });
    return () => unsubscribe();
  }, [springScore, envyScore, displayScoreOverride]);

  // Feed the camera stream into the local preview video element
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Draw FaceMesh vector overlay on the canvas element in real-time
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!landmarks || landmarks.length === 0) {
      return;
    }

    // Color tier matching the current score
    let strokeColor = '#10b981'; // emerald
    if (envyScore !== null) {
      if (envyScore >= 5.5 && envyScore < 8.0) {
        strokeColor = '#f59e0b'; // amber
      } else if (envyScore >= 8.0) {
        strokeColor = '#dc2626'; // red
      }
    }

    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = strokeColor;
    ctx.lineWidth = 0.5;

    const drawPath = (indices: number[]) => {
      ctx.beginPath();
      indices.forEach((index, idx) => {
        const pt = landmarks[index];
        if (pt) {
          const x = pt.x * canvas.width;
          const y = pt.y * canvas.height;
          if (idx === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
      });
      ctx.stroke();
    };

    const leftEye = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246, 33];
    const rightEye = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398, 362];
    const lipsOuter = [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 415, 310, 311, 312, 13, 82, 81, 80, 191, 78];
    const leftEyebrow = [70, 63, 105, 66, 107];
    const rightEyebrow = [300, 293, 334, 296, 336];
    const noseBridge = [168, 6, 197, 195];

    drawPath(leftEye);
    drawPath(rightEye);
    drawPath(lipsOuter);
    drawPath(leftEyebrow);
    drawPath(rightEyebrow);
    drawPath(noseBridge);

    const structurePoints = [4, 152, 10, 234, 454];
    structurePoints.forEach((index) => {
      const pt = landmarks[index];
      if (pt) {
        ctx.beginPath();
        ctx.arc(pt.x * canvas.width, pt.y * canvas.height, 0.8, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
  }, [landmarks, envyScore]);

  // Map scores to specific UI triggers and sarcastic micro-copies
  const getMetrics = () => {
    if (error) {
      return {
        status: 'Status: SYSTEM ERROR / ACCESS DENIED',
        copy: "Hardware blocked. Let's assume you're green with envy.",
        ledClass: 'bg-red-500',
        vibrate: false,
      };
    }
    if (isLoadingModel) {
      return {
        status: 'Status: SYSTEM BOOTING...',
        copy: modelProgress || 'Calibrating micro-expression vectors...',
        ledClass: 'bg-zinc-600 animate-pulse',
        vibrate: false,
      };
    }
    if (!isCameraActive) {
      return {
        status: 'Status: OFFLINE',
        copy: 'Camera dormant. Activate to calculate professional jealousy.',
        ledClass: 'bg-zinc-800',
        vibrate: false,
      };
    }
    if (envyScore === null) {
      return {
        status: 'Status: ALIGNING LENS...',
        copy: 'Scan in progress... Face the camera.',
        ledClass: 'bg-cyan-500 animate-pulse',
        vibrate: false,
      };
    }
    if (!isCalibrated) {
      return {
        status: 'Status: BASELINE CALIBRATION',
        copy: 'Hold a neutral face — learning your resting expression...',
        ledClass: 'bg-cyan-500 animate-pulse',
        vibrate: false,
      };
    }

    if (envyScore >= 1.0 && envyScore < 5.5) {
      return {
        status: 'Status: Indifference',
        copy: 'Copy genérico. Sin impacto.',
        ledClass: 'bg-emerald-500',
        vibrate: false,
      };
    }
    if (envyScore >= 5.5 && envyScore < 8.0) {
      return {
        status: 'Status: Critical Scan / Looking for flaws',
        copy: 'Mirada fija... Buscando errores en el código.',
        ledClass: 'bg-amber-500',
        vibrate: false,
      };
    }
    // 8.0 - 10.0
    return {
      status: 'Status: Ego Crisis / Plagiarism Imminent',
      copy: 'Llamando a RRHH. Cerrando pestaña por salud mental.',
      ledClass: 'bg-red-600 animate-pulse',
      vibrate: false,
    };
  };

  const { ledClass, vibrate } = getMetrics();

  const getMemoryUsage = () => {
    interface ExtendedPerformance extends Performance {
      memory?: {
        usedJSHeapSize: number;
      };
    }
    const memory = (performance as ExtendedPerformance).memory;
    if (memory) {
      return `${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`;
    }
    return '14.2MB';
  };

  return (
    <div className="relative w-full font-mono text-xs text-white bg-black border border-zinc-800 p-3 select-none shadow-[3px_3px_0px_#27272a] hover:shadow-[4px_4px_0px_var(--color-brand-orange)] transition-all duration-300">
      {/* Info Floating Overlay */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/95 z-50 p-4 flex flex-col justify-between border border-brand-orange/40 font-mono text-[9px] leading-relaxed text-zinc-300"
          >
            <div>
              <div className="flex items-center justify-between border-b border-brand-orange/30 pb-1 mb-2">
                <span className="text-brand-orange font-bold uppercase tracking-wider text-[10px]">
                  // ENVY ENGINE PROTOCOL
                </span>
                <button
                  onClick={() => {
                    playSound('click', false);
                    setShowInfo(false);
                  }}
                  className="text-zinc-500 hover:text-brand-orange font-black text-xs px-1 cursor-pointer"
                >
                  ×
                </button>
              </div>
              <div className="space-y-2 text-zinc-400 overflow-y-auto max-h-[220px]">
                <p>
                  <strong className="text-white">1. FACIAL SCANNING:</strong> Using your local webcam, we analyze 468 facial vector points securely without storing or transmitting images.
                </p>
                <p>
                  <strong className="text-white">2. FACS METRIC:</strong> We detect signs of professional jealousy: brow furrowing (Frustration), tense smiling (Fake Smile), corner depression (Disapproval), and physical proximity (Leaning).
                </p>
                <p>
                  <strong className="text-white">3. DAMPENING:</strong> Genuine joy (Genuine Smile) instantly lowers the calculated envy level.
                </p>
                <p>
                  <strong className="text-white">4. SESSION METHOD:</strong> The envy-meter maintains your highest achieved score as the session baseline.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                playSound('click', false);
                setShowInfo(false);
              }}
              className="w-full mt-3 py-1 bg-brand-orange text-black font-bold uppercase tracking-widest text-[8px] border border-brand-orange hover:bg-black hover:text-brand-orange transition-colors cursor-pointer"
            >
              [ Understood ]
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {isCameraActive && <div className="radar-pulse-glow" />}
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-bold tracking-wider text-[10px] text-zinc-500 truncate">
            //ENVY INDEX
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              playSound('click', false);
              setShowInfo((prev) => !prev);
            }}
            className="w-5.5 h-4.5 rounded-full border border-zinc-850 hover:border-brand-orange hover:text-brand-orange flex items-center justify-center font-mono text-[9px] font-bold text-zinc-500 transition-colors shrink-0 cursor-pointer"
            title="Algorithm Info"
          >
            ii
          </button>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`w-2 h-2 rounded-full ${ledClass}`} />
          <span className="text-[10px] text-zinc-400 uppercase tracking-widest">
            {isCameraActive ? 'LIVE_SCAN' : 'STBY'}
          </span>
        </div>
      </div>

      <div className="flex items-start justify-between min-h-[60px] mb-4">
        {/* Left Side: Diagnostics, Scores and Sensitivity */}
        <div className="flex-1 pr-4">
          <div
            className={`font-black text-2xl mb-1 tracking-tight text-white ${
              vibrate ? 'vibrate-text' : ''
            }`}
          >
            {displayScoreOverride !== undefined && displayScoreOverride !== null ? (
              <>
                <span ref={spanRef}>{displayScoreOverride.toFixed(1)}</span>
                <span className="text-zinc-650 text-lg font-normal">/10.0</span>
              </>
            ) : envyScore === null ? (
              '--'
            ) : (
              <>
                <span ref={spanRef}>{envyScore.toFixed(1)}</span>
                <span className="text-zinc-650 text-lg font-normal">/10.0</span>
              </>
            )}
          </div>
        </div>

        {/* Right Side: Mirrored Webcam Preview with Canvas FaceMesh Overlay */}
        <div className="relative flex-shrink-0">
          {isCameraActive && stream ? (
            <div className="w-[150px] h-[112px] bg-zinc-950 border border-zinc-800 overflow-hidden relative scanner-crt">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1] brightness-90 contrast-125 grayscale"
              />
              <canvas
                ref={canvasRef}
                width={150}
                height={112}
                className="absolute inset-0 w-full h-full object-cover scale-x-[-1] pointer-events-none"
              />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] pointer-events-none" />
              <div className="absolute inset-x-0 top-0 h-[1px] bg-brand-orange/40 animate-[scan_2s_linear_infinite]" />
              <div className="absolute top-1 right-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
                <span className="text-[7px] text-brand-orange font-bold font-mono">REC</span>
              </div>
            </div>
          ) : (
            <div className="w-[150px] h-[112px] bg-zinc-900/50 border border-zinc-800 flex flex-col items-center justify-center text-zinc-600 relative">
              {isLoadingModel ? (
                <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
              ) : error ? (
                <AlertTriangle className="w-5 h-5 text-red-500" />
              ) : (
                <Camera className="w-5 h-5 opacity-40" />
              )}
              <span className="text-[8px] mt-1 text-center font-bold tracking-widest uppercase opacity-40">
                {isLoadingModel ? 'BOOTING' : error ? 'BLOCKED' : 'MUTED'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Calibration progress bar (visible only while learning the baseline) */}
      {isCameraActive && !isCalibrated && (
        <div className="mb-3">
          <div className="flex justify-between text-[8px] text-zinc-500 uppercase tracking-widest mb-1">
            <span>Calibrating baseline</span>
            <span className="text-cyan-400">{Math.round(calibrationProgress * 100)}%</span>
          </div>
          <div className="w-full h-[2px] bg-zinc-900 overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-100"
              style={{ width: `${calibrationProgress * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Two Bars: Attention and Algorithm */}
      {isCameraActive && isCalibrated && components && (
        <div className="mb-3 space-y-2">
          {/* Algorithm Bar */}
          <div>
            <div className="flex justify-between text-[8px] text-zinc-400 uppercase tracking-widest mb-1 font-bold">
              <span>{displayScoreOverride !== undefined && displayScoreOverride !== null ? 'Average Envy Index' : 'Envy Algorithm'}</span>
              <span className="text-brand-orange">
                {displayScoreOverride !== undefined && displayScoreOverride !== null 
                  ? `${displayScoreOverride.toFixed(1)}/10.0` 
                  : envyScore !== null 
                    ? `${envyScore.toFixed(1)}/10.0` 
                    : '--'}
              </span>
            </div>
            <div className="w-full h-1.5 bg-zinc-900 border border-zinc-800 overflow-hidden">
              {(() => {
                const activeVal = displayScoreOverride !== undefined && displayScoreOverride !== null 
                  ? displayScoreOverride 
                  : envyScore;
                return (
                  <div
                    className="h-full bg-brand-orange transition-all duration-150"
                    style={{ width: activeVal !== null ? `${Math.min(100, Math.max(0, (activeVal / 10) * 100))}%` : '0%' }}
                  />
                );
              })()}
            </div>
          </div>

          {/* Attention Bar */}
          <div>
            <div className="flex justify-between text-[8px] text-zinc-400 uppercase tracking-widest mb-1 font-bold">
              <span>Attention Level</span>
              <span className="text-emerald-500">{Math.round(Math.min(100, Math.max(0, (components.leanIn ?? 0) * 100)))}%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-900 border border-zinc-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-150"
                style={{ width: `${Math.min(100, Math.max(0, (components.leanIn ?? 0) * 100))}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Control Action Button */}
      {isCameraActive ? (
        <button
          onClick={() => {
            playSound('click', false);
            stopScanner();
          }}
          className="w-full py-1.5 bg-zinc-900 border border-zinc-800 hover:bg-brand-orange hover:text-black hover:border-brand-orange transition-all duration-300 font-bold tracking-widest uppercase text-[9px] flex items-center justify-center gap-2 active:translate-y-[1px]"
        >
          <EyeOff className="w-3.5 h-3.5" />
          [ Deactivate Scanner ]
        </button>
      ) : (
        <button
          onClick={() => {
            playSound('click', false);
            startScanner();
          }}
          disabled={isLoadingModel}
          className="w-full py-1.5 bg-white text-black border border-white hover:bg-brand-orange hover:text-black hover:border-brand-orange transition-all duration-300 font-bold tracking-widest uppercase text-[9px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none active:translate-y-[1px]"
        >
          {isLoadingModel ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Loading Model...
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              [ Activate Envy Scanner ]
            </>
          )}
        </button>
      )}

      {/* Technical Log Console with Telemetry Data */}
      {(isLoadingModel || isCameraActive) && (
        <div className="mt-2 text-[8px] text-zinc-500 bg-zinc-950 p-2 border border-zinc-900 h-16 overflow-y-auto leading-normal">
          <div>&gt; _envy_engine_daemon_v2.0 initialized...</div>
          {isLoadingModel && <div>&gt; downloading assets: {modelProgress}</div>}
          {isCameraActive && (
            <>
              <div>&gt; WASM Threads: 4 | GPU Delegate: ACTIVE</div>
              <div>&gt; JS Memory Heap: {getMemoryUsage()}</div>
              <div>
                &gt; Eye Blinks: {blinkCount} | Rate: {blinkRate}/min
              </div>
              {envyScore === null ? (
                <div>&gt; scanning video pipeline for face markers...</div>
              ) : (
                <div>
                  &gt; {isCalibrated ? 'baseline locked' : 'calibrating'}. score ={' '}
                  {envyScore.toFixed(2)}
                </div>
              )}
            </>
          )}
          {error && <div className="text-red-500">&gt; error: {error}</div>}
        </div>
      )}
    </div>
  );
};


