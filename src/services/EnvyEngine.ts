import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export interface NormalizedLandmark {
  x: number;
  y: number;
  z: number;
}

/**
 * Per-channel breakdown of the envy signal. Each value is normalized 0..1 and
 * represents the EXCESS over the user's calibrated resting face (baseline).
 * Exposed to the UI so the biometric HUD can render live component bars.
 */
export interface EnvyComponents {
  frustration: number; // B_down  — brow furrow / frustration
  contempt: number; // M_dimp  — mouth dimple (classic contempt)
  disapproval: number; // M_frown — mouth corners down
  fakeSmile: number; // F_smile — smile without eye engagement (Duchenne-negative)
  sneer: number; // nose sneer — disgust signal
  leanIn: number; // head leaning toward the screen (attention/intensity)
  genuineSmile: number; // G_smile — Duchenne smile (REDUCES envy)
}

export interface EnvyEngineResult {
  score: number | null;
  landmarks: NormalizedLandmark[] | null;
  blinkCount: number;
  blinkRate: number; // blinks/min, rolling 10s window
  confidence: number; // 0..1 — detector self-trust
  components: EnvyComponents | null;
  isCalibrated: boolean;
  calibrationProgress: number; // 0..1
}

// ─── Tunable parameters ───────────────────────────────────────────────────────
const CALIB_FRAMES = 45; // ~3s @ 15fps to learn the resting face
const BLINK_WINDOW_MS = 10_000; // rolling window for blink-rate telemetry

// Weighted envy contribution per channel. Sums to 1.0 so the raw envy signal
// lives in [0,1]. Genuine smile is subtracted afterwards (it is the opposite
// of envy), so it is tracked separately.
const W = {
  frustration: 0.22,
  contempt: 0.28,
  disapproval: 0.12,
  fakeSmile: 0.18,
  sneer: 0.10,
  leanIn: 0.10,
} as const;
const GENUINE_SMILE_OFFSET = 0.20; // how much a Duchenne smile pulls the score down

// Baseline buckets accumulated during calibration. After CALIB_FRAMES these
// become the per-user "resting face" subtracted from live signals.
interface Baseline {
  frustration: number;
  contempt: number;
  disapproval: number;
  fakeSmile: number;
  sneer: number;
  genuineSmile: number;
  faceHeight: number; // normalized forehead→chin distance, reference for lean-in
}

export class EnvyEngine {
  private static instance: EnvyEngine | null = null;
  private faceLandmarker: FaceLandmarker | null = null;
  private isInitializing = false;

  // Smoothing state
  private prevSmoothed = 0.0;
  private hasFirstScore = false;

  // Attention tracking state
  private attentionTimeAccumulator = 0;
  private lastTimestamp = 0;
  private attentionScoreBoost = 0;

  // Calibration state
  private calibFrameCount = 0;
  private calibAccum: Baseline = emptyBaseline();
  private baseline: Baseline | null = null;

  // Blink tracking state
  private blinkCount = 0;
  private isEyesClosed = false;
  private blinkTimestamps: number[] = [];
  private lastBlinkTimestamp = 0;

  // Sensitivity state (scale 1 to 10)
  private sensitivity = 5;

  private constructor() {}

  public static getInstance(): EnvyEngine {
    if (!EnvyEngine.instance) {
      EnvyEngine.instance = new EnvyEngine();
    }
    return EnvyEngine.instance;
  }

  public setSensitivity(s: number): void {
    this.sensitivity = Math.min(10, Math.max(1, s));
  }

  public getSensitivity(): number {
    return this.sensitivity;
  }

  /**
   * Initializes the FaceLandmarker model and WebAssembly dependencies.
   * Uses browser Cache Storage to avoid re-downloading model assets.
   */
  public async initialize(onProgress?: (progress: string) => void): Promise<void> {
    if (this.faceLandmarker) return;

    if (this.isInitializing) {
      while (this.isInitializing) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return;
    }

    this.isInitializing = true;

    try {
      if (onProgress) onProgress('Initializing system WASM resolver...');
      const filesetResolver = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm',
      );

      const modelUrl =
        'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';
      let modelAssetSource = modelUrl;

      if ('caches' in window) {
        try {
          if (onProgress) onProgress('Checking local biometric cache storage...');
          const cache = await caches.open('envy-engine-cache');
          let cachedResponse = await cache.match(modelUrl);

          if (!cachedResponse) {
            if (onProgress) onProgress('Downloading & caching facial landmarker model...');
            await cache.add(modelUrl);
            cachedResponse = await cache.match(modelUrl);
          } else if (onProgress) {
            onProgress('Retrieving facial landmarker from local cache...');
          }

          if (cachedResponse) {
            const blob = await cachedResponse.blob();
            modelAssetSource = URL.createObjectURL(blob);
          }
        } catch (cacheError) {
          console.warn('Local cache storage failed. Falling back to direct URL resolver:', cacheError);
        }
      }

      if (onProgress) onProgress('Loading facial landmarker model assets...');
      this.faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: modelAssetSource,
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        outputFaceBlendshapes: true,
        outputFacialTransformationMatrixes: false,
        numFaces: 1,
      });

      if (onProgress) onProgress('Engine diagnostic: OK.');
    } catch (error) {
      console.error('EnvyEngine initialization failed:', error);
      this.isInitializing = false;
      throw error;
    } finally {
      this.isInitializing = false;
    }
  }

  /**
   * Processes a video frame: extracts FACS micro-expressions + head geometry,
   * subtracts the calibrated baseline, blends them into a raw envy signal,
   * smooths it, normalizes perceptually to [1,10] and returns the full result.
   */
  public calculateEnvy(videoElement: HTMLVideoElement, timestamp: number): EnvyEngineResult {
    if (!this.faceLandmarker) {
      return this.emptyResult();
    }

    try {
      const result = this.faceLandmarker.detectForVideo(videoElement, timestamp);

      const landmarks =
        result.faceLandmarks && result.faceLandmarks.length > 0 ? result.faceLandmarks[0] : null;

      if (!result.faceBlendshapes || result.faceBlendshapes.length === 0) {
        return { ...this.emptyResult(), landmarks };
      }

      const blendshapes: Record<string, number> = {};
      for (const item of result.faceBlendshapes[0].categories) {
        blendshapes[item.categoryName] = item.score;
      }

      // Calculate dynamic parameters based on sensitivity scale (1 to 10)
      let emaAlpha = 0.02;
      if (this.sensitivity < 5) {
        // S: 1..5 => 0.005..0.02
        emaAlpha = 0.005 + (this.sensitivity - 1) * (0.015 / 4);
      } else {
        // S: 5..10 => 0.02..0.30
        emaAlpha = 0.02 + (this.sensitivity - 5) * (0.28 / 5);
      }

      let sensitivityBoostVal = 1.1;
      if (this.sensitivity < 5) {
        // S: 1..5 => 0.2..1.1
        sensitivityBoostVal = 0.2 + (this.sensitivity - 1) * (0.9 / 4);
        if (this.sensitivity === 4) {
          sensitivityBoostVal = 0.65; // Dampen expression impact for S=4
        }
      } else {
        // S: 5..10 => 1.1..4.5
        sensitivityBoostVal = 1.1 + (this.sensitivity - 5) * (3.4 / 5);
      }

      let normGamma = 0.70;
      if (this.sensitivity < 5) {
        // S: 1..5 => 1.5..0.70
        normGamma = 1.5 - (this.sensitivity - 1) * (0.8 / 4);
      } else {
        // S: 5..10 => 0.70..0.25
        normGamma = 0.70 - (this.sensitivity - 5) * (0.45 / 5);
      }

      let attentionBoostFactor = 0.00015;
      if (this.sensitivity < 5) {
        // S: 1..5 => 0.00001..0.00015
        attentionBoostFactor = 0.00001 + (this.sensitivity - 1) * (0.00014 / 4);
        if (this.sensitivity === 4) {
          attentionBoostFactor = 0.00006; // Slower attention build-up for S=4
        }
      } else {
        // S: 5..10 => 0.00015..0.001
        attentionBoostFactor = 0.00015 + (this.sensitivity - 5) * (0.00085 / 5);
      }

      // ── Extract raw FACS channels ──────────────────────────────────────────
      const browDownLeft = blendshapes['browDownLeft'] ?? 0;
      const browDownRight = blendshapes['browDownRight'] ?? 0;
      const frustration = (browDownLeft + browDownRight) / 2;

      const mouthDimpleLeft = blendshapes['mouthDimpleLeft'] ?? 0;
      const mouthDimpleRight = blendshapes['mouthDimpleRight'] ?? 0;
      const contempt = Math.max(mouthDimpleLeft, mouthDimpleRight);

      const mouthFrownLeft = blendshapes['mouthFrownLeft'] ?? 0;
      const mouthFrownRight = blendshapes['mouthFrownRight'] ?? 0;
      const disapproval = (mouthFrownLeft + mouthFrownRight) / 2;

      const mouthSmileLeft = blendshapes['mouthSmileLeft'] ?? 0;
      const mouthSmileRight = blendshapes['mouthSmileRight'] ?? 0;
      const smile = (mouthSmileLeft + mouthSmileRight) / 2;

      const eyeSquintLeft = blendshapes['eyeSquintLeft'] ?? 0;
      const eyeSquintRight = blendshapes['eyeSquintRight'] ?? 0;
      const squint = (eyeSquintLeft + eyeSquintRight) / 2;

      const noseSneerLeft = blendshapes['noseSneerLeft'] ?? 0;
      const noseSneerRight = blendshapes['noseSneerRight'] ?? 0;
      const sneer = (noseSneerLeft + noseSneerRight) / 2;

      // Duchenne distinction: a fake smile engages the mouth but not the eyes;
      // a genuine one engages both. They pull the envy score in opposite ways.
      const fakeSmile = Math.max(0, smile - squint);
      const genuineSmile = Math.min(smile, squint);

      // ── Head geometry: lean-in (forehead→chin growth vs baseline) ───────────
      const faceHeight = normalizedFaceHeight(landmarks);
      const leanIn = computeLeanIn(faceHeight, this.baseline?.faceHeight ?? null);

      // Track attention duration and calculate boost
      const elapsed = this.lastTimestamp > 0 ? Math.max(0, timestamp - this.lastTimestamp) : 0;
      this.lastTimestamp = timestamp;

      // When calibrated, track attention (leanIn > 0.11 represents active focus, or staring fixedly)
      if (this.calibFrameCount >= CALIB_FRAMES) {
        if (this.lastBlinkTimestamp === 0) {
          this.lastBlinkTimestamp = timestamp;
        }
        const isStaringFixedly = (timestamp - this.lastBlinkTimestamp > 3000) && !this.isEyesClosed;

        if (leanIn > 0.11 || isStaringFixedly) {
          this.attentionTimeAccumulator += elapsed;
          const multiplier = isStaringFixedly ? 1.8 : 1.0;
          this.attentionScoreBoost = Math.min(4.0, this.attentionScoreBoost + elapsed * attentionBoostFactor * multiplier);
        } else {
          // Cool down slowly: decay by 0.1 points per second (0.0001 per ms)
          this.attentionScoreBoost = Math.max(0, this.attentionScoreBoost - elapsed * 0.0001);
          this.attentionTimeAccumulator = Math.max(0, this.attentionTimeAccumulator - elapsed);
        }
      }

      // ── Blink detection (closed→open transition) + rolling rate ────────────
      const eyeBlinkLeft = blendshapes['eyeBlinkLeft'] ?? 0;
      const eyeBlinkRight = blendshapes['eyeBlinkRight'] ?? 0;
      if (eyeBlinkLeft > 0.6 && eyeBlinkRight > 0.6) {
        this.isEyesClosed = true;
      } else if (eyeBlinkLeft < 0.2 && eyeBlinkRight < 0.2) {
        if (this.isEyesClosed) {
          this.blinkCount++;
          this.isEyesClosed = false;
          this.blinkTimestamps.push(timestamp);
          this.lastBlinkTimestamp = timestamp; // Reset staring on blink
        }
      }
      const blinkRate = this.computeBlinkRate(timestamp);

      // ── Calibration: learn the resting face during the first second ────────
      const isCalibrated = this.calibFrameCount >= CALIB_FRAMES;
      const calibrationProgress = Math.min(1, this.calibFrameCount / CALIB_FRAMES);
      if (!isCalibrated) {
        this.calibAccum.frustration += frustration;
        this.calibAccum.contempt += contempt;
        this.calibAccum.disapproval += disapproval;
        this.calibAccum.fakeSmile += fakeSmile;
        this.calibAccum.sneer += sneer;
        this.calibAccum.genuineSmile += genuineSmile;
        this.calibAccum.faceHeight += faceHeight;
        this.calibFrameCount++;
        if (this.calibFrameCount === CALIB_FRAMES) {
          const n = CALIB_FRAMES;
          this.baseline = {
            frustration: this.calibAccum.frustration / n,
            contempt: this.calibAccum.contempt / n,
            disapproval: this.calibAccum.disapproval / n,
            fakeSmile: this.calibAccum.fakeSmile / n,
            sneer: this.calibAccum.sneer / n,
            genuineSmile: this.calibAccum.genuineSmile / n,
            faceHeight: this.calibAccum.faceHeight / n || DEFAULT_FACE_HEIGHT,
          };
        }
      }
      const b = this.baseline; // null until calibrated → baseline treated as 0

      // ── Excess-over-baseline (envy is the deviation from rest) ─────────────
      // Apply a small noise gate/deadzone to filter out camera micro-jitter/involuntary twitches
      const applyDeadzone = (val: number) => val < 0.035 ? 0.0 : val;

      const eFrustration = applyDeadzone(Math.max(0, frustration - (b?.frustration ?? 0)));
      const eContempt = applyDeadzone(Math.max(0, contempt - (b?.contempt ?? 0)));
      const eDisapproval = applyDeadzone(Math.max(0, disapproval - (b?.disapproval ?? 0)));
      const eFakeSmile = applyDeadzone(Math.max(0, fakeSmile - (b?.fakeSmile ?? 0)));
      const eSneer = applyDeadzone(Math.max(0, sneer - (b?.sneer ?? 0)));
      const eGenuineSmile = applyDeadzone(Math.max(0, genuineSmile - (b?.genuineSmile ?? 0)));

      // ── Weighted blend → raw envy ∈ [0,1] ──────────────────────────────────
      let raw =
        (W.frustration * eFrustration +
        W.contempt * eContempt +
        W.disapproval * eDisapproval +
        W.fakeSmile * eFakeSmile +
        W.sneer * eSneer +
        W.leanIn * leanIn -
        GENUINE_SMILE_OFFSET * eGenuineSmile) * sensitivityBoostVal;
      raw = clamp(raw, 0, 1);

      // Global noise gate for total signal stability
      if (raw < 0.015) {
        raw = 0;
      }

      // ── EMA smoothing ──────────────────────────────────────────────────────
      let smoothed: number;
      if (!this.hasFirstScore) {
        smoothed = raw;
        this.hasFirstScore = true;
      } else {
        // Asymmetric response: make the upward climb slower (dampened by 88% for extreme precision/smoothness)
        const currentAlpha = raw > this.prevSmoothed ? emaAlpha * 0.12 : emaAlpha;
        smoothed = this.prevSmoothed + currentAlpha * (raw - this.prevSmoothed);
      }
      this.prevSmoothed = smoothed;

      // ── Perceptual normalization to [3.8, 9.7] ────────────────────────────
      const normalized = Math.pow(smoothed, normGamma);
      const baseMin = 1.0 + 2.8 * calibrationProgress;
      const scoreRange = 9.7 - baseMin;
      const score = clamp(baseMin + scoreRange * normalized + this.attentionScoreBoost, 1.0, 9.7);

      // ── Confidence: detector self-trust from landmark count ───────────────
      const lmCount = landmarks ? landmarks.length : 0;
      const confidence = lmCount === 0 ? 0 : clamp(lmCount / 460, 0, 1);

      const components: EnvyComponents = {
        frustration: eFrustration,
        contempt: eContempt,
        disapproval: eDisapproval,
        fakeSmile: eFakeSmile,
        sneer: eSneer,
        leanIn,
        genuineSmile: eGenuineSmile,
      };

      return {
        score,
        landmarks,
        blinkCount: this.blinkCount,
        blinkRate,
        confidence,
        components,
        isCalibrated,
        calibrationProgress,
      };
    } catch (e) {
      console.error('Biometric extraction error:', e);
      return this.emptyResult();
    }
  }

  private computeBlinkRate(now: number): number {
    // Drop timestamps outside the rolling window, then extrapolate to blinks/min.
    this.blinkTimestamps = this.blinkTimestamps.filter((t) => now - t <= BLINK_WINDOW_MS);
    const recent = this.blinkTimestamps.length;
    // blinks/min ≈ (blinks in window / window minutes)
    return Math.round((recent / BLINK_WINDOW_MS) * 60_000);
  }

  private emptyResult(): EnvyEngineResult {
    return {
      score: null,
      landmarks: null,
      blinkCount: this.blinkCount,
      blinkRate: 0,
      confidence: 0,
      components: null,
      isCalibrated: this.calibFrameCount >= CALIB_FRAMES,
      calibrationProgress: Math.min(1, this.calibFrameCount / CALIB_FRAMES),
    };
  }

  /** Resets the moving average, calibration and blink state. */
  public reset(): void {
    this.prevSmoothed = 0.0;
    this.hasFirstScore = false;
    this.calibFrameCount = 0;
    this.calibAccum = emptyBaseline();
    this.baseline = null;
    this.blinkCount = 0;
    this.isEyesClosed = false;
    this.blinkTimestamps = [];
    this.attentionTimeAccumulator = 0;
    this.lastTimestamp = 0;
    this.attentionScoreBoost = 0;
    this.lastBlinkTimestamp = 0;
  }

  /** Boosts the attention score when scrolling stops. */
  public triggerScrollStopBoost(): void {
    if (this.baseline) {
      // Add 0.4 points of attention boost, capped at 4.0 points total boost
      this.attentionScoreBoost = Math.min(4.0, this.attentionScoreBoost + 0.4);
    }
  }
}

// ─── Geometry helpers ─────────────────────────────────────────────────────────
const DEFAULT_FACE_HEIGHT = 0.32; // typical normalized forehead(10)→chin(152) distance

/** Vertical face extent (forehead top → chin) in normalized image coords. */
function normalizedFaceHeight(landmarks: NormalizedLandmark[] | null): number {
  if (!landmarks || landmarks.length < 200) return DEFAULT_FACE_HEIGHT;
  const top = landmarks[10];
  const chin = landmarks[152];
  if (!top || !chin) return DEFAULT_FACE_HEIGHT;
  const h = Math.abs(chin.y - top.y);
  return h > 0 ? h : DEFAULT_FACE_HEIGHT;
}

/**
 * Lean-in: how much larger the face is now vs the calibrated reference.
 * Leaning toward the screen makes the face occupy more frame → positive signal.
 */
function computeLeanIn(currentHeight: number, baselineHeight: number | null): number {
  const ref = baselineHeight && baselineHeight > 0 ? baselineHeight : currentHeight;
  if (ref <= 0) return 0;
  const growth = (currentHeight - ref) / ref;
  // A ~26% growth counts as "fully leaned in"; clamp to [0,1].
  return clamp(growth / 0.26, 0, 1);
}

function emptyBaseline(): Baseline {
  return {
    frustration: 0,
    contempt: 0,
    disapproval: 0,
    fakeSmile: 0,
    sneer: 0,
    genuineSmile: 0,
    faceHeight: 0,
  };
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}
