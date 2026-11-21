"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "gm-studio-sound-v1";
const MASTER_VOLUME = 0.22;

type SoundListener = (enabled: boolean) => void;

interface WindowWithWebkitAudio extends Window {
  webkitAudioContext?: typeof AudioContext;
}

let audioCtx: AudioContext | null = null;
let noiseBuffer: AudioBuffer | null = null;
let soundEnabled = true;
let hasLoadedPref = false;
let isUnlocked = false;
let unlockListenersBound = false;

const listeners = new Set<SoundListener>();

// Throttle timestamps (ms) to keep rapid interactions pleasant and clean
let lastHoverAt = 0;
let lastClickAt = 0;
let lastTimelineTickAt = 0;
let lastColorPulseAt = 0;
let lastScaleTickAt = 0;

function loadPreferenceOnce(): boolean {
  if (hasLoadedPref || typeof window === "undefined") return soundEnabled;
  hasLoadedPref = true;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "off" || saved === "false") {
      soundEnabled = false;
    } else if (saved === "on" || saved === "true") {
      soundEnabled = true;
    }
  } catch {
    // Ignore storage errors in private browsing
  }
  return soundEnabled;
}

function notifyListeners() {
  listeners.forEach((listener) => listener(soundEnabled));
}

function getOrCreateContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (audioCtx) return audioCtx;

  const AudioCtor =
    window.AudioContext ||
    (window as WindowWithWebkitAudio).webkitAudioContext;
  if (!AudioCtor) return null;

  try {
    audioCtx = new AudioCtor();
    return audioCtx;
  } catch {
    return null;
  }
}

function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (noiseBuffer && noiseBuffer.sampleRate === ctx.sampleRate) {
    return noiseBuffer;
  }
  const length = Math.floor(ctx.sampleRate * 0.45);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  noiseBuffer = buffer;
  return buffer;
}

/**
 * Desbloqueia o AudioContext no primeiro gesto do usuário (Safari, Chrome, iOS).
 */
export function unlockStudioAudio(): void {
  if (typeof window === "undefined") return;
  loadPreferenceOnce();

  const ctx = getOrCreateContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    void ctx.resume().then(() => {
      isUnlocked = true;
    }).catch(() => {
      // Ignore autoplay block until next gesture
    });
  } else {
    isUnlocked = true;
  }
}

/**
 * Registra listeners globais passivos uma única vez para desbloquear o áudio na 1ª interação.
 */
export function bindStudioAudioUnlock(): () => void {
  if (typeof window === "undefined" || unlockListenersBound) {
    return () => {};
  }
  loadPreferenceOnce();
  unlockListenersBound = true;

  const onFirstGesture = () => {
    unlockStudioAudio();
    window.removeEventListener("pointerdown", onFirstGesture);
    window.removeEventListener("touchstart", onFirstGesture);
    window.removeEventListener("keydown", onFirstGesture);
  };

  window.addEventListener("pointerdown", onFirstGesture, { passive: true });
  window.addEventListener("touchstart", onFirstGesture, { passive: true });
  window.addEventListener("keydown", onFirstGesture, { passive: true });

  return () => {
    window.removeEventListener("pointerdown", onFirstGesture);
    window.removeEventListener("touchstart", onFirstGesture);
    window.removeEventListener("keydown", onFirstGesture);
    unlockListenersBound = false;
  };
}

function getPlayableContext(allowImplicitUnlock: boolean): AudioContext | null {
  if (typeof window === "undefined") return null;
  loadPreferenceOnce();
  if (!soundEnabled) return null;

  if (!allowImplicitUnlock && !isUnlocked) {
    // Avoid browser autoplay warnings on passive hover before first click/tap
    return null;
  }

  const ctx = getOrCreateContext();
  if (!ctx) return null;

  if (ctx.state === "suspended") {
    if (!allowImplicitUnlock) return null;
    void ctx.resume().then(() => {
      isUnlocked = true;
    }).catch(() => {});
  } else {
    isUnlocked = true;
  }

  return ctx;
}

export function isStudioSoundEnabled(): boolean {
  return loadPreferenceOnce();
}

export function setStudioSoundEnabled(next: boolean): void {
  loadPreferenceOnce();
  soundEnabled = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
  } catch {
    // Ignore storage errors
  }
  notifyListeners();
  if (next) {
    unlockStudioAudio();
    playClick();
  }
}

export function toggleStudioSound(): boolean {
  const next = !loadPreferenceOnce();
  setStudioSoundEnabled(next);
  return next;
}

export function useStudioSound() {
  const [enabled, setEnabled] = useState<boolean>(true);

  useEffect(() => {
    const initial = loadPreferenceOnce();
    const syncId = window.setTimeout(() => setEnabled(initial), 0);

    const listener: SoundListener = (val) => setEnabled(val);
    listeners.add(listener);

    return () => {
      window.clearTimeout(syncId);
      listeners.delete(listener);
    };
  }, []);

  return {
    soundEnabled: enabled,
    toggleSound: toggleStudioSound,
    setSoundEnabled: setStudioSoundEnabled,
  };
}

// ============================================================================
// SYNTHESIZED UI SOUND DESIGN (100% Native Web Audio API — Zero External Files)
// ============================================================================

/**
 * 1. Micro-tick tátil ultra-sutil no hover (com throttle de 85ms).
 */
export function playHoverTick(): void {
  const nowMs = performance.now();
  if (nowMs - lastHoverAt < 85) return;

  const ctx = getPlayableContext(false);
  if (!ctx) return;
  lastHoverAt = nowMs;

  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(1280, t);
  osc.frequency.exponentialRampToValueAtTime(920, t + 0.028);

  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.linearRampToValueAtTime(MASTER_VOLUME * 0.12, t + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.032);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.036);
}

/**
 * 2. Micro-clique tátil limpo e agradável para botões e teclas da interface.
 */
export function playClick(): void {
  const nowMs = performance.now();
  if (nowMs - lastClickAt < 35) return;

  const ctx = getPlayableContext(true);
  if (!ctx) return;
  lastClickAt = nowMs;

  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(640, t);
  osc.frequency.exponentialRampToValueAtTime(320, t + 0.038);

  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.linearRampToValueAtTime(MASTER_VOLUME * 0.24, t + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.044);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.048);
}

/**
 * 3. Tick delicado de passagem de frame na Timeline (clique em clipes ou agulha).
 */
export function playTimelineTick(): void {
  const nowMs = performance.now();
  if (nowMs - lastTimelineTickAt < 42) return;

  const ctx = getPlayableContext(true);
  if (!ctx) return;
  lastTimelineTickAt = nowMs;

  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(1520, t);
  osc.frequency.exponentialRampToValueAtTime(980, t + 0.022);

  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.linearRampToValueAtTime(MASTER_VOLUME * 0.2, t + 0.003);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.026);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.03);
}

/**
 * 4a. Cut — Som rápido e nítido de tesoura/corte (snip curto com ruído filtrado).
 */
export function playCutSnip(): void {
  const ctx = getPlayableContext(true);
  if (!ctx) return;

  const t = ctx.currentTime;

  // Filtered crisp noise snip
  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer(ctx);

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(5200, t);
  filter.frequency.exponentialRampToValueAtTime(1750, t + 0.095);
  filter.Q.setValueAtTime(3.2, t);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.0001, t);
  noiseGain.gain.linearRampToValueAtTime(MASTER_VOLUME * 0.42, t + 0.008);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.105);

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(t);
  noise.stop(t + 0.115);

  // Subtle metallic blade transient
  const blade = ctx.createOscillator();
  const bladeGain = ctx.createGain();
  blade.type = "sine";
  blade.frequency.setValueAtTime(2650, t);
  blade.frequency.exponentialRampToValueAtTime(1240, t + 0.048);

  bladeGain.gain.setValueAtTime(0.0001, t);
  bladeGain.gain.linearRampToValueAtTime(MASTER_VOLUME * 0.16, t + 0.004);
  bladeGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.052);

  blade.connect(bladeGain);
  bladeGain.connect(ctx.destination);
  blade.start(t);
  blade.stop(t + 0.056);
}

/**
 * 4b. Cut — Snap magnético suave quando os blocos se reencaixam.
 */
export function playCutSnap(): void {
  const ctx = getPlayableContext(true);
  if (!ctx) return;

  const t = ctx.currentTime;

  const body = ctx.createOscillator();
  const bodyGain = ctx.createGain();
  body.type = "sine";
  body.frequency.setValueAtTime(220, t);
  body.frequency.exponentialRampToValueAtTime(510, t + 0.085);

  bodyGain.gain.setValueAtTime(0.0001, t);
  bodyGain.gain.linearRampToValueAtTime(MASTER_VOLUME * 0.28, t + 0.012);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.115);

  body.connect(bodyGain);
  bodyGain.connect(ctx.destination);
  body.start(t);
  body.stop(t + 0.12);

  // Tiny crisp lock confirmation tick
  const lock = ctx.createOscillator();
  const lockGain = ctx.createGain();
  lock.type = "triangle";
  lock.frequency.setValueAtTime(1040, t + 0.045);
  lock.frequency.exponentialRampToValueAtTime(760, t + 0.09);

  lockGain.gain.setValueAtTime(0.0001, t + 0.045);
  lockGain.gain.linearRampToValueAtTime(MASTER_VOLUME * 0.15, t + 0.052);
  lockGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.095);

  lock.connect(lockGain);
  lockGain.connect(ctx.destination);
  lock.start(t + 0.045);
  lock.stop(t + 0.1);
}

/**
 * 5a. Audio — Breve varredura suave de onda sonora no início do Audio Check.
 */
export function playAudioSweep(): void {
  const ctx = getPlayableContext(true);
  if (!ctx) return;

  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(240, t);
  osc.frequency.exponentialRampToValueAtTime(520, t + 0.34);
  osc.frequency.exponentialRampToValueAtTime(392, t + 0.62);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1100, t);

  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.linearRampToValueAtTime(MASTER_VOLUME * 0.22, t + 0.12);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.68);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.72);
}

/**
 * 5b. Audio — Acorde/chime limpo e agradável no momento de "SOM NORMALIZADO".
 */
export function playAudioNormalizedChime(): void {
  const ctx = getPlayableContext(true);
  if (!ctx) return;

  const t = ctx.currentTime;
  // Clean warm Cmaj9 studio chime (C5, E5, G5, D6)
  const notes = [523.25, 659.25, 783.99, 1174.66];

  notes.forEach((freq, index) => {
    const start = t + index * 0.036;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = index === 3 ? "sine" : "triangle";
    osc.frequency.setValueAtTime(freq, start);

    const peak =
      index === 3 ? MASTER_VOLUME * 0.12 : MASTER_VOLUME * 0.16;

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(peak, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.56);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.6);
  });
}

/**
 * 6. Color — Micro-pulso harmônico suave com throttle ao girar a roda de cores.
 */
export function playColorPulse(hue: number): void {
  const nowMs = performance.now();
  if (nowMs - lastColorPulseAt < 115) return;

  const ctx = getPlayableContext(true);
  if (!ctx) return;
  lastColorPulseAt = nowMs;

  const t = ctx.currentTime;
  const normalizedHue = ((hue % 360) + 360) % 360;
  // Smooth musical pitch mapping across a gentle pentatonic-like range (300Hz–620Hz)
  const freq = 300 + (normalizedHue / 360) * 320;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, t);
  osc.frequency.exponentialRampToValueAtTime(freq * 1.04, t + 0.075);

  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.linearRampToValueAtTime(MASTER_VOLUME * 0.14, t + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.096);
}

/**
 * 7a. Scale — Micro-tick tátil ao arrastar o slider de escala (60%–115%, com throttle).
 */
export function playScaleTick(scalePercent: number): void {
  const nowMs = performance.now();
  if (nowMs - lastScaleTickAt < 45) return;

  const ctx = getPlayableContext(true);
  if (!ctx) return;
  lastScaleTickAt = nowMs;

  const t = ctx.currentTime;
  const clamped = Math.max(60, Math.min(115, scalePercent));
  const ratio = (clamped - 60) / 55;
  // Subtle pitch glide following the scale value (720Hz -> 1320Hz)
  const freq = 720 + ratio * 600;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, t);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.88, t + 0.024);

  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.linearRampToValueAtTime(MASTER_VOLUME * 0.16, t + 0.003);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.028);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.032);
}

/**
 * 7b. Scale — Snap suave ao fechar/restaurar a escala de volta para 100%.
 */
export function playScaleSnap(): void {
  const ctx = getPlayableContext(true);
  if (!ctx) return;

  const t = ctx.currentTime;

  const body = ctx.createOscillator();
  const bodyGain = ctx.createGain();
  body.type = "sine";
  body.frequency.setValueAtTime(300, t);
  body.frequency.exponentialRampToValueAtTime(580, t + 0.075);

  bodyGain.gain.setValueAtTime(0.0001, t);
  bodyGain.gain.linearRampToValueAtTime(MASTER_VOLUME * 0.22, t + 0.01);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.095);

  body.connect(bodyGain);
  bodyGain.connect(ctx.destination);
  body.start(t);
  body.stop(t + 0.1);

  const click = ctx.createOscillator();
  const clickGain = ctx.createGain();
  click.type = "triangle";
  click.frequency.setValueAtTime(1180, t + 0.038);
  click.frequency.exponentialRampToValueAtTime(840, t + 0.078);

  clickGain.gain.setValueAtTime(0.0001, t + 0.038);
  clickGain.gain.linearRampToValueAtTime(MASTER_VOLUME * 0.14, t + 0.044);
  clickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.082);

  click.connect(clickGain);
  clickGain.connect(ctx.destination);
  click.start(t + 0.038);
  click.stop(t + 0.088);
}
