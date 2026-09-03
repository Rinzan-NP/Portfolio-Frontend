// High-fidelity Audio effects for pencil writing (using boosted MP3 + procedural fallback) and rubber eraser

let audioCtx: AudioContext | null = null;
let pencilAudioBuffer: AudioBuffer | null = null;
let activePencilSource: AudioBufferSourceNode | null = null;
let activePencilGain: GainNode | null = null;
let pencilHtmlAudio: HTMLAudioElement | null = null;
let isPreloading = false;
let isAudioUnlocked = false;

export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().then(() => {
      isAudioUnlocked = true;
    }).catch(() => {});
  } else if (audioCtx && audioCtx.state === "running") {
    isAudioUnlocked = true;
  }
  return audioCtx;
}

// Preload the pencil writing MP3 into AudioBuffer and HTML5 audio element
export async function preloadPencilAudio() {
  if (pencilAudioBuffer || isPreloading || typeof window === "undefined") return;
  isPreloading = true;

  try {
    if (!pencilHtmlAudio) {
      pencilHtmlAudio = new Audio("/sounds/pencil-writing.mp3");
      pencilHtmlAudio.loop = true;
      pencilHtmlAudio.volume = 0.85;
      pencilHtmlAudio.preload = "auto";
    }

    const ctx = getAudioContext();
    if (!ctx) return;

    const response = await fetch("/sounds/pencil-writing.mp3");
    const arrayBuf = await response.arrayBuffer();
    pencilAudioBuffer = await ctx.decodeAudioData(arrayBuf);
  } catch (err) {
    console.warn("Could not preload pencil audio buffer, will use procedural synthesis:", err);
  } finally {
    isPreloading = false;
  }
}

// Auto-unlock audio on any user gesture
export function unlockAudio() {
  const ctx = getAudioContext();
  if (ctx && ctx.state === "suspended") {
    ctx.resume().then(() => {
      isAudioUnlocked = true;
    }).catch(() => {});
  }
  if (pencilHtmlAudio) {
    // Play and immediately pause to unlock HTMLAudioElement in iOS/Safari/Chrome
    pencilHtmlAudio.play().then(() => {
      pencilHtmlAudio?.pause();
      isAudioUnlocked = true;
    }).catch(() => {});
  }
  preloadPencilAudio();
}

if (typeof window !== "undefined") {
  preloadPencilAudio();

  const events = ["click", "touchstart", "touchend", "pointerdown", "keydown", "scroll"];
  events.forEach((evt) => {
    window.addEventListener(evt, unlockAudio, { once: false, passive: true });
  });
}

/**
 * Procedural pencil scratch generator (runs if MP3 buffer is loading or Web Audio fallback needed)
 */
function createProceduralPencilSource(ctx: AudioContext, gainNode: GainNode) {
  const bufferSize = Math.floor(ctx.sampleRate * 2);
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  let lastOut = 0.0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    lastOut = (lastOut + 0.02 * white) / 1.02;
    output[i] = (white * 0.45 + (white - lastOut) * 0.55);
  }

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.setValueAtTime(2800, ctx.currentTime);
  bandpass.Q.setValueAtTime(1.8, ctx.currentTime);

  const highpass = ctx.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.setValueAtTime(1200, ctx.currentTime);

  noise.connect(bandpass);
  bandpass.connect(highpass);
  highpass.connect(gainNode);

  return noise;
}

/**
 * Start continuous pencil writing sound
 */
export function startPencilSound(volume: number = 0.85) {
  try {
    const ctx = getAudioContext();
    if (!ctx) {
      if (pencilHtmlAudio) {
        pencilHtmlAudio.volume = volume;
        pencilHtmlAudio.play().catch(() => {});
      }
      return;
    }

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    // Stop existing source if any
    stopPencilSound();

    const gainNode = ctx.createGain();
    const now = ctx.currentTime;
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + 0.02);
    gainNode.connect(ctx.destination);

    let source: AudioBufferSourceNode;

    if (pencilAudioBuffer) {
      source = ctx.createBufferSource();
      source.buffer = pencilAudioBuffer;
      source.loop = true;

      const randomOffset = Math.random() * Math.max(0, pencilAudioBuffer.duration - 10);
      source.connect(gainNode);
      source.start(now, randomOffset);
    } else {
      source = createProceduralPencilSource(ctx, gainNode);
      source.start(now);

      // Also try HTMLAudioElement
      if (pencilHtmlAudio) {
        pencilHtmlAudio.volume = volume;
        pencilHtmlAudio.play().catch(() => {});
      }
    }

    activePencilSource = source;
    activePencilGain = gainNode;
  } catch (err) {
    console.warn("Error starting pencil sound:", err);
  }
}

/**
 * Stop continuous pencil writing sound with smooth fade-out
 */
export function stopPencilSound() {
  try {
    if (pencilHtmlAudio && !pencilHtmlAudio.paused) {
      pencilHtmlAudio.pause();
    }

    if (activePencilGain && audioCtx) {
      const now = audioCtx.currentTime;
      activePencilGain.gain.setValueAtTime(activePencilGain.gain.value, now);
      activePencilGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
    }

    if (activePencilSource) {
      const src = activePencilSource;
      setTimeout(() => {
        try {
          src.stop();
          src.disconnect();
        } catch {}
      }, 40);
      activePencilSource = null;
      activePencilGain = null;
    }
  } catch {}
}

/**
 * Play rubber eraser scrubbing sound
 */
export function playEraserScrubSound(durationMs: number = 700, volume: number = 0.75) {
  try {
    stopPencilSound();

    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const durationSec = Math.max(0.15, durationMs / 1000);
    const bufferSize = Math.max(256, Math.floor(ctx.sampleRate * durationSec));
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      const pink = b0 + b1 + b2 + white * 0.5362;
      data[i] = pink * 0.55;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    // Resonant friction filter (~620Hz)
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(620, ctx.currentTime);
    bandpass.Q.setValueAtTime(1.8, ctx.currentTime);

    const gainNode = ctx.createGain();
    const now = ctx.currentTime;
    gainNode.gain.setValueAtTime(0.001, now);

    // 3 vigorous scrubbing sweeps
    const sweeps = 3;
    const sweepDuration = durationSec / sweeps;
    for (let i = 0; i < sweeps; i++) {
      const t = now + i * sweepDuration;
      gainNode.gain.setValueAtTime(0.02, t);
      gainNode.gain.linearRampToValueAtTime(volume, t + sweepDuration * 0.4);
      gainNode.gain.linearRampToValueAtTime(volume * 0.2, t + sweepDuration * 0.95);
    }
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

    noiseSource.connect(bandpass);
    bandpass.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + durationSec);
  } catch (err) {
    console.warn("Error playing eraser sound:", err);
  }
}
