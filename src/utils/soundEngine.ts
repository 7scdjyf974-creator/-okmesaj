// Web Audio API sound engine for voice notes, message cues, and call ringtones

let sharedCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedCtx) {
    sharedCtx = new AudioCtx();
  }
  if (sharedCtx.state === 'suspended') {
    sharedCtx.resume().catch(() => {});
  }
  return sharedCtx;
}

export function playMessageSentSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(860, now + 0.08);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.11);
  } catch {
    // Ignore audio errors in restricted environments
  }
}

export function playMessageReceivedSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    // Two-note pleasant incoming chime
    [660, 880].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + idx * 0.075;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.14, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.15);
    });
  } catch {
    // Ignore
  }
}

export function startCallRingbackTone(): () => void {
  const ctx = getAudioContext();
  if (!ctx) return () => {};

  let stopped = false;
  let timer: number | null = null;

  const playBurst = () => {
    if (stopped) return;
    try {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(425, now);
      osc2.frequency.setValueAtTime(450, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.04);
      gain.gain.setValueAtTime(0.08, now + 0.85);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.96);
      osc2.stop(now + 0.96);
    } catch {
      // Ignore
    }
  };

  playBurst();
  timer = window.setInterval(playBurst, 2200);

  return () => {
    stopped = true;
    if (timer !== null) window.clearInterval(timer);
  };
}

export function playCallConnectedChime(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now);
    osc.frequency.setValueAtTime(783.99, now + 0.09);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.11, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  } catch {
    // Ignore
  }
}

/**
 * Synthesizes audible cadence synced to a voice note's waveform bars
 * when no recorded microphone audioUrl is present.
 */
export class SynthesizedVoiceTrack {
  private timer: number | null = null;
  private activeOsc: OscillatorNode | null = null;
  private stopped = false;

  start(waveform: number[], durationSec: number, startProgress: number, speed: number): void {
    this.stop();
    this.stopped = false;
    const ctx = getAudioContext();
    if (!ctx || waveform.length === 0) return;

    const stepMs = Math.max(80, ((durationSec * 1000) / waveform.length) / speed);
    let idx = Math.min(waveform.length - 1, Math.floor(startProgress * waveform.length));

    const playSyllable = () => {
      if (this.stopped || idx >= waveform.length) {
        this.stop();
        return;
      }
      const amp = waveform[idx] ?? 0.4;
      idx += 1;

      if (amp < 0.22) return; // natural breath/pause

      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        // Warm vocal-register formant sweep modulated by waveform amplitude
        const baseFreq = 165 + amp * 130 + ((idx % 5) - 2) * 14;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.linearRampToValueAtTime(baseFreq * (idx % 2 === 0 ? 1.06 : 0.94), now + stepMs / 1000);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(950 + amp * 700, now);

        const dur = Math.min(0.24, (stepMs / 1000) * 0.85);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.08 + amp * 0.1, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + dur + 0.01);
        this.activeOsc = osc;
      } catch {
        // Ignore
      }
    };

    playSyllable();
    this.timer = window.setInterval(playSyllable, stepMs);
  }

  stop(): void {
    this.stopped = true;
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
    if (this.activeOsc) {
      try {
        this.activeOsc.stop();
      } catch {
        // Already stopped
      }
      this.activeOsc = null;
    }
  }
}
