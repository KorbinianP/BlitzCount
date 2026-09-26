// Procedural Web Audio API sound synthesizer for BlitzCount
// Generates joyful, zero-latency sounds directly in code with NO external audio files.

let audioCtx = null;
let isMuted = false;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setMuted(muted) {
  isMuted = muted;
}

export function getMuted() {
  return isMuted;
}

export function toggleMuted() {
  isMuted = !isMuted;
  return isMuted;
}

// Gentle bubbly pop sound on tapping any button
export function playTap() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch (e) {
    console.warn('Audio playback error', e);
  }
}

// Joyful glockenspiel / marimba arpeggio (C5, E5, G5, C6) with sparkle overtone
export function playCorrect() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const startTime = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const noteTime = startTime + idx * 0.07;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(0.25, noteTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(noteTime);
      osc.stop(noteTime + 0.36);

      const sparkle = ctx.createOscillator();
      const sGain = ctx.createGain();
      sparkle.type = 'sine';
      sparkle.frequency.setValueAtTime(freq * 2, noteTime);
      sGain.gain.setValueAtTime(0.06, noteTime);
      sGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.2);

      sparkle.connect(sGain);
      sGain.connect(ctx.destination);
      sparkle.start(noteTime);
      sparkle.stop(noteTime + 0.22);
    });
  } catch (e) {
    console.warn('Audio playback error', e);
  }
}

// Gentle descending cartoon "uh-oh" cue for missed answers (warm, clear, never scary)
export function playWrong() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Two descending soft tones: Eb4 (311Hz) -> B3 (247Hz)
    const tones = [
      { freq: 311.13, start: now, dur: 0.16 },
      { freq: 233.08, start: now + 0.14, dur: 0.28 }
    ];

    tones.forEach((tone) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(tone.freq, tone.start);
      osc.frequency.exponentialRampToValueAtTime(tone.freq * 0.94, tone.start + tone.dur);

      gain.gain.setValueAtTime(0.001, tone.start);
      gain.gain.linearRampToValueAtTime(0.24, tone.start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, tone.start + tone.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(tone.start);
      osc.stop(tone.start + tone.dur + 0.02);
    });
  } catch (e) {
    console.warn('Audio playback error', e);
  }
}

// Victory fanfare for winning medals / completing the round
export function playFanfare() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const chords = [
      { time: 0.0, notes: [261.63, 329.63, 392.00], duration: 0.2 },       // C4
      { time: 0.22, notes: [261.63, 349.23, 440.00], duration: 0.2 },      // F4
      { time: 0.44, notes: [293.66, 392.00, 493.88], duration: 0.25 },     // G4
      { time: 0.72, notes: [523.25, 659.25, 783.99, 1046.50], duration: 0.8 } // High C major
    ];

    chords.forEach(({ time, notes, duration }) => {
      const chordStart = now + time;
      notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, chordStart);

        gain.gain.setValueAtTime(0.001, chordStart);
        gain.gain.linearRampToValueAtTime(0.15, chordStart + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, chordStart + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(chordStart);
        osc.stop(chordStart + duration + 0.05);
      });
    });
  } catch (e) {
    console.warn('Audio playback error', e);
  }
}

// Soft countdown / ready chime
export function playDing() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, now); // E5

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  } catch (e) {
    console.warn('Audio playback error', e);
  }
}
