let audioCtx: AudioContext | null = null;

export const playSound = (type: 'click' | 'tick' | 'success' | 'radar', isMuted: boolean) => {
  if (isMuted) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'tick') {
      // Tiny tick sound for storyboard hover
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      gainNode.gain.setValueAtTime(0.015, now); // Quiet
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'click') {
      // Clean UI click sound
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);
      gainNode.gain.setValueAtTime(0.06, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'success') {
      // Success lock notification chime (arpeggio)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'radar') {
      // Quiet radar beep/sonar ping
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(550, now + 0.2);
      gainNode.gain.setValueAtTime(0.01, now); // Very quiet background ping
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch (e) {
    console.warn('Web Audio API is not supported or blocked:', e);
  }
};
