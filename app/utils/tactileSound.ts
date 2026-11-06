"use client";

/**
 * Shared zero-latency Web Audio API & Haptic feedback engine for Navbar, FullScreenNav, and UI menus.
 */

let sharedAudioCtx: AudioContext | null = null;
let lastHoverTickTime = 0;

function getSharedAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!sharedAudioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioContextClass) return null;
      sharedAudioCtx = new AudioContextClass();
    }
    if (sharedAudioCtx.state === "suspended") {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

export function triggerHapticPulse(pattern: number | number[]) {
  try {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.vibrate === "function"
    ) {
      navigator.vibrate(pattern);
    }
  } catch {
    // Ignore on unsupported devices
  }
}

/**
 * Velocity-reactive tactile "tuk" sound for hovering across nav items.
 * Fast movement -> tight, rapid, brighter "tuk tuk"
 * Slow movement -> deeper, fuller woody "tuk...   tuk"
 */
export function playNavHoverTuk(itemIndex = 0) {
  const nowPerf =
    typeof performance !== "undefined" ? performance.now() : Date.now();
  const dt = Math.max(12, nowPerf - lastHoverTickTime);
  lastHoverTickTime = nowPerf;

  // 0 = slow (>220ms), 1 = fast (<35ms)
  const speedFactor = Math.min(1, Math.max(0, (220 - dt) / 185));

  triggerHapticPulse(speedFactor > 0.5 ? 4 : 8);

  const ctx = getSharedAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const pitchStep = itemIndex * 18;
    const startFreq = 250 + speedFactor * 90 + pitchStep;
    const endFreq = 75 + speedFactor * 25;
    const duration = 0.03 - speedFactor * 0.012;

    // 1. Woody low-mid resonant body ("tuk")
    const bodyOsc = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    bodyOsc.type = "triangle";
    bodyOsc.frequency.setValueAtTime(startFreq, now);
    bodyOsc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

    const peakGain = 0.22 - speedFactor * 0.04;
    bodyGain.gain.setValueAtTime(0.0001, now);
    bodyGain.gain.linearRampToValueAtTime(peakGain, now + 0.002);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    bodyOsc.connect(bodyGain);
    bodyGain.connect(ctx.destination);
    bodyOsc.start(now);
    bodyOsc.stop(now + duration + 0.004);

    // 2. Crisp mechanical click transient
    const clickOsc = ctx.createOscillator();
    const clickFilter = ctx.createBiquadFilter();
    const clickGain = ctx.createGain();

    clickOsc.type = "sine";
    clickOsc.frequency.setValueAtTime(1180 + speedFactor * 380 + pitchStep, now);
    clickOsc.frequency.exponentialRampToValueAtTime(280, now + 0.0075);

    clickFilter.type = "bandpass";
    clickFilter.frequency.setValueAtTime(1150 + speedFactor * 280, now);
    clickFilter.Q.setValueAtTime(2.0, now);

    clickGain.gain.setValueAtTime(0.0001, now);
    clickGain.gain.linearRampToValueAtTime(0.11, now + 0.0008);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.008);

    clickOsc.connect(clickFilter);
    clickFilter.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickOsc.start(now);
    clickOsc.stop(now + 0.009);
  } catch {
    // Ignore audio errors
  }
}

/**
 * Lighter micro-tick for secondary navbar elements (hamburger hover, resume, email, mascot).
 */
export function playNavSubtleTick() {
  triggerHapticPulse(3);
  const ctx = getSharedAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.016);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.11, now + 0.0012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.017);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.02);
  } catch {
    // Ignore
  }
}

/**
 * Satisfying two-stage confirmation sound when clicking a navigation link.
 */
export function playNavSelectClick() {
  triggerHapticPulse([10, 20, 14]);
  const ctx = getSharedAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Initial tactile press thock
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(250, now);
    osc1.frequency.exponentialRampToValueAtTime(90, now + 0.025);
    gain1.gain.setValueAtTime(0.0001, now);
    gain1.gain.linearRampToValueAtTime(0.22, now + 0.002);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.026);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.03);

    // Secondary affirmative harmonic pop
    const t2 = now + 0.024;
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(480, t2);
    osc2.frequency.exponentialRampToValueAtTime(740, t2 + 0.038);
    gain2.gain.setValueAtTime(0.0001, t2);
    gain2.gain.linearRampToValueAtTime(0.15, t2 + 0.003);
    gain2.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.04);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(t2);
    osc2.stop(t2 + 0.044);
  } catch {
    // Ignore
  }
}

/**
 * Staggered cascade "tuk-tuk-tuk" + rising harmonic whoosh when opening the FullScreenNav.
 */
export function playNavToggleSound(opening: boolean) {
  triggerHapticPulse(opening ? [8, 18, 8] : [6, 12]);
  const ctx = getSharedAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    if (opening) {
      // 3 rapid staggered stair ticks matching the column cascade
      for (let i = 0; i < 3; i++) {
        const t = now + i * 0.042;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(210 + i * 55, t);
        osc.frequency.exponentialRampToValueAtTime(85 + i * 20, t + 0.024);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.16 - i * 0.02, t + 0.002);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.028);
      }
    } else {
      // Crisp descending double-tock when closing the menu
      for (let i = 0; i < 2; i++) {
        const t = now + i * 0.038;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(290 - i * 80, t);
        osc.frequency.exponentialRampToValueAtTime(75, t + 0.024);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.17, t + 0.002);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.028);
      }
    }
  } catch {
    // Ignore
  }
}

