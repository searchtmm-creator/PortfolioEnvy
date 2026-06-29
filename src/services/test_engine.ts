/* eslint-disable @typescript-eslint/no-explicit-any */
import { EnvyEngine } from './EnvyEngine';

// Stub the HTMLVideoElement class on globalThis so the engine compiles safely for both browsers and Node
(globalThis as any).HTMLVideoElement = class {};

const engine = EnvyEngine.getInstance();

const PASS = '\x1b[32mPASS\x1b[0m';
const FAIL = '\x1b[31mFAIL\x1b[0m';
let failures = 0;

function approx(a: number | null, b: number, eps = 0.01): boolean {
  return a !== null && Math.abs(a - b) < eps;
}

// Mock injection helper to swap the MediaPipe detector with stub blendshapes + landmarks
function setMockDetectResult(
  categories: { categoryName: string; score: number }[],
  landmarkCount = 478,
) {
  // Fabricate enough normalized landmarks so the confidence + geometry paths run.
  const landmarks = Array.from({ length: landmarkCount }, () => ({ x: 0.5, y: 0.5, z: 0 }));
  (engine as any).faceLandmarker = {
    detectForVideo: () => ({
      faceBlendshapes: [{ categories }],
      faceLandmarks: [landmarks],
    }),
  };
}

function assert(label: string, expected: number, got: number | null) {
  const ok = approx(got, expected);
  if (!ok) failures++;
  console.log(`[${ok ? PASS : FAIL}] ${label}`);
  console.log(`   - Expected: ${expected.toFixed(2)}`);
  console.log(`   - Got:      ${got !== null ? got.toFixed(4) : 'null'}\n`);
}

console.log('==========================================');
console.log('🧪 ENVY ENGINE v2: ALGORITHMIC TEST RUNNER');
console.log('==========================================\n');

// --- TEST CASE 1: Pure Indifference (no signal → floor) ---
setMockDetectResult([
  { categoryName: 'browDownLeft', score: 0.0 },
  { categoryName: 'browDownRight', score: 0.0 },
  { categoryName: 'mouthDimpleLeft', score: 0.0 },
  { categoryName: 'mouthDimpleRight', score: 0.0 },
  { categoryName: 'mouthFrownLeft', score: 0.0 },
  { categoryName: 'mouthFrownRight', score: 0.0 },
  { categoryName: 'mouthSmileLeft', score: 0.0 },
  { categoryName: 'mouthSmileRight', score: 0.0 },
  { categoryName: 'eyeSquintLeft', score: 0.0 },
  { categoryName: 'eyeSquintRight', score: 0.0 },
  { categoryName: 'noseSneerLeft', score: 0.0 },
  { categoryName: 'noseSneerRight', score: 0.0 },
]);
engine.reset();
assert(
  'Test 1: Pure Indifference (all-zero signal)',
  1.0,
  engine.calculateEnvy({} as any, 100).score,
);

// --- TEST CASE 2: Forced Fake Smile (smile without eye engagement) ---
setMockDetectResult([
  { categoryName: 'browDownLeft', score: 0.0 },
  { categoryName: 'browDownRight', score: 0.0 },
  { categoryName: 'mouthDimpleLeft', score: 0.0 },
  { categoryName: 'mouthDimpleRight', score: 0.0 },
  { categoryName: 'mouthFrownLeft', score: 0.0 },
  { categoryName: 'mouthFrownRight', score: 0.0 },
  { categoryName: 'mouthSmileLeft', score: 1.0 },
  { categoryName: 'mouthSmileRight', score: 1.0 },
  { categoryName: 'eyeSquintLeft', score: 0.0 },
  { categoryName: 'eyeSquintRight', score: 0.0 },
  { categoryName: 'noseSneerLeft', score: 0.0 },
  { categoryName: 'noseSneerRight', score: 0.0 },
]);
engine.reset();
assert(
  'Test 2: Forced Fake Smile (M_smile=1.0, E_squint=0.0)',
  3.80,
  engine.calculateEnvy({} as any, 200).score,
);

// --- TEST CASE 3: Contempt + Frustration (classic envy) ---
setMockDetectResult([
  { categoryName: 'browDownLeft', score: 0.8 },
  { categoryName: 'browDownRight', score: 0.8 },
  { categoryName: 'mouthDimpleLeft', score: 0.9 },
  { categoryName: 'mouthDimpleRight', score: 0.4 },
  { categoryName: 'mouthFrownLeft', score: 0.7 },
  { categoryName: 'mouthFrownRight', score: 0.7 },
  { categoryName: 'mouthSmileLeft', score: 0.0 },
  { categoryName: 'mouthSmileRight', score: 0.0 },
  { categoryName: 'eyeSquintLeft', score: 0.0 },
  { categoryName: 'eyeSquintRight', score: 0.0 },
  { categoryName: 'noseSneerLeft', score: 0.0 },
  { categoryName: 'noseSneerRight', score: 0.0 },
]);
engine.reset();
assert(
  'Test 3: Contempt & Frustration (B_down=0.8, M_dimp=0.9, M_frown=0.7)',
  6.82,
  engine.calculateEnvy({} as any, 300).score,
);

// --- TEST CASE 4: EMA Smoothing (responsiveness vs. stability) ---
engine.reset();

// Frame 1: every envy channel maxed
setMockDetectResult([
  { categoryName: 'browDownLeft', score: 1.0 },
  { categoryName: 'browDownRight', score: 1.0 },
  { categoryName: 'mouthDimpleLeft', score: 1.0 },
  { categoryName: 'mouthDimpleRight', score: 1.0 },
  { categoryName: 'mouthFrownLeft', score: 1.0 },
  { categoryName: 'mouthFrownRight', score: 1.0 },
  { categoryName: 'mouthSmileLeft', score: 1.0 },
  { categoryName: 'mouthSmileRight', score: 1.0 },
  { categoryName: 'eyeSquintLeft', score: 0.0 },
  { categoryName: 'eyeSquintRight', score: 0.0 },
  { categoryName: 'noseSneerLeft', score: 1.0 },
  { categoryName: 'noseSneerRight', score: 1.0 },
]);
const r4f1 = engine.calculateEnvy({} as any, 400);
// Frame 2: everything relaxes to zero — score must decay, not collapse
setMockDetectResult([
  { categoryName: 'browDownLeft', score: 0.0 },
  { categoryName: 'browDownRight', score: 0.0 },
  { categoryName: 'mouthDimpleLeft', score: 0.0 },
  { categoryName: 'mouthDimpleRight', score: 0.0 },
  { categoryName: 'mouthFrownLeft', score: 0.0 },
  { categoryName: 'mouthFrownRight', score: 0.0 },
  { categoryName: 'mouthSmileLeft', score: 0.0 },
  { categoryName: 'mouthSmileRight', score: 0.0 },
  { categoryName: 'eyeSquintLeft', score: 0.0 },
  { categoryName: 'eyeSquintRight', score: 0.0 },
  { categoryName: 'noseSneerLeft', score: 0.0 },
  { categoryName: 'noseSneerRight', score: 0.0 },
]);
const r4f2 = engine.calculateEnvy({} as any, 500);
{
  const ok = approx(r4f1.score, 9.64) && approx(r4f2.score, 9.52);
  if (!ok) failures++;
  console.log(`[${ok ? PASS : FAIL}] Test 4: EMA Smoothing Filter`);
  console.log(`   - Frame 1: Expected: 9.64, Got: ${r4f1.score?.toFixed(4)}`);
  console.log(`   - Frame 2: Expected: 9.52, Got: ${r4f2.score?.toFixed(4)}\n`);
}

// --- TEST CASE 5: Calibration zeroes out the resting-face bias ---
// Seed the baseline with 15 frames of "resting contempt" (dimple 0.3). After
// calibration the SAME signal yields zero excess-over-baseline, so the score
// decays back toward the floor (3.8) — no longer falsely flagged as envious.
engine.reset();
setMockDetectResult([
  { categoryName: 'browDownLeft', score: 0.0 },
  { categoryName: 'browDownRight', score: 0.0 },
  { categoryName: 'mouthDimpleLeft', score: 0.3 },
  { categoryName: 'mouthDimpleRight', score: 0.3 },
  { categoryName: 'mouthFrownLeft', score: 0.0 },
  { categoryName: 'mouthFrownRight', score: 0.0 },
  { categoryName: 'mouthSmileLeft', score: 0.0 },
  { categoryName: 'mouthSmileRight', score: 0.0 },
  { categoryName: 'eyeSquintLeft', score: 0.0 },
  { categoryName: 'eyeSquintRight', score: 0.0 },
  { categoryName: 'noseSneerLeft', score: 0.0 },
  { categoryName: 'noseSneerRight', score: 0.0 },
]);
// Calibrate: 45 frames learn the resting face.
// We simulate blinks by updating lastBlinkTimestamp to prevent starting with staring boost.
for (let i = 0; i < 45; i++) {
  const ts = 1000 + i * 67;
  (engine as any).lastBlinkTimestamp = ts;
  engine.calculateEnvy({} as any, ts);
}
// Now keep feeding the SAME resting signal — excess over baseline is 0, so the
// EMA decays. After enough frames it must fall back near the floor (3.8).
let decayed = 10;
for (let i = 0; i < 300; i++) {
  const ts = 2500 + i * 67;
  (engine as any).lastBlinkTimestamp = ts; // Prevent staring boost
  decayed = engine.calculateEnvy({} as any, ts).score ?? 10;
}
{
  const ok = approx(decayed, 3.80, 0.05);
  if (!ok) failures++;
  console.log(`[${ok ? PASS : FAIL}] Test 5: Baseline Calibration removes resting-face bias`);
  console.log(`   - After calibration, identical resting signal decays to ~3.80`);
  console.log(`   - Got: ${decayed.toFixed(4)} (after 60 decay frames)\n`);
}

// --- TEST CASE 6: Confidence reflects landmark availability ---
engine.reset();
setMockDetectResult(
  [
    { categoryName: 'browDownLeft', score: 0 },
    { categoryName: 'browDownRight', score: 0 },
    { categoryName: 'mouthDimpleLeft', score: 0 },
    { categoryName: 'mouthDimpleRight', score: 0 },
    { categoryName: 'mouthFrownLeft', score: 0 },
    { categoryName: 'mouthFrownRight', score: 0 },
    { categoryName: 'mouthSmileLeft', score: 0 },
    { categoryName: 'mouthSmileRight', score: 0 },
    { categoryName: 'eyeSquintLeft', score: 0 },
    { categoryName: 'eyeSquintRight', score: 0 },
    { categoryName: 'noseSneerLeft', score: 0 },
    { categoryName: 'noseSneerRight', score: 0 },
  ],
  478,
);
const conf = engine.calculateEnvy({} as any, 3000).confidence;
{
  const ok = approx(conf, 1.0, 0.02);
  if (!ok) failures++;
  console.log(`[${ok ? PASS : FAIL}] Test 6: Confidence = landmarks/460`);
  console.log(`   - 478 landmarks → Expected: ~1.00`);
  console.log(`   - Got: ${conf.toFixed(4)}\n`);
}

// --- TEST CASE 7: Staring fixedly triggers attention boost ---
engine.reset();
setMockDetectResult([
  { categoryName: 'browDownLeft', score: 0.0 },
  { categoryName: 'browDownRight', score: 0.0 },
  { categoryName: 'mouthDimpleLeft', score: 0.0 },
  { categoryName: 'mouthDimpleRight', score: 0.0 },
  { categoryName: 'mouthFrownLeft', score: 0.0 },
  { categoryName: 'mouthFrownRight', score: 0.0 },
  { categoryName: 'mouthSmileLeft', score: 0.0 },
  { categoryName: 'mouthSmileRight', score: 0.0 },
  { categoryName: 'eyeSquintLeft', score: 0.0 },
  { categoryName: 'eyeSquintRight', score: 0.0 },
  { categoryName: 'noseSneerLeft', score: 0.0 },
  { categoryName: 'noseSneerRight', score: 0.0 },
]);
// Calibrate (45 frames) with simulated blinking to keep boost at 0
for (let i = 0; i < 45; i++) {
  const ts = 1000 + i * 67;
  (engine as any).lastBlinkTimestamp = ts;
  engine.calculateEnvy({} as any, ts);
}
// Now run frames without blinking for 4 seconds
let staringScore = 3.8;
for (let i = 0; i < 60; i++) {
  const ts = 5000 + i * 67; // 4020ms elapsed
  staringScore = engine.calculateEnvy({} as any, ts).score ?? 3.8;
}
{
  const ok = staringScore > 3.85; // Check that it rose above 3.8
  if (!ok) failures++;
  console.log(`[${ok ? PASS : FAIL}] Test 7: Staring fixedly triggers attention boost`);
  console.log(`   - Staring for 4s without blinking → Expected score > 3.85`);
  console.log(`   - Got: ${staringScore.toFixed(4)}\n`);
}

console.log('==========================================');
console.log(failures === 0 ? '✅ ALL ALGORITHMIC TESTS PASSED' : `❌ ${failures} TEST(S) FAILED`);
console.log('==========================================');
