/**
 * Procedural Web Audio API sound synthesizer for arcade sounds.
 * Zero external audio files required, zero latency, works across all browsers.
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private masterGain: GainNode | null = null;

  constructor() {
    // Read muted preference
    const saved = localStorage.getItem('flappy_muted');
    if (saved !== null) {
      this.muted = saved === 'true';
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.muted ? 0 : 0.3;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    localStorage.setItem('flappy_muted', String(this.muted));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.3, this.ctx.currentTime);
    }
    return this.muted;
  }

  /**
   * Sound on wing flap (quick pitch sweep up)
   */
  public playFlap() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(580, now + 0.12);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // Ignore audio interruptions
    }
  }

  /**
   * Sound on passing a pipe (two-tone chime / coin sound)
   */
  public playScore() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;

      // Note 1: High crisp ding
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(987.77, now); // B5
      gain1.gain.setValueAtTime(0.28, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc1.connect(gain1);
      gain1.connect(this.masterGain);
      osc1.start(now);
      osc1.stop(now + 0.16);

      // Note 2: Higher sparkle
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      gain2.gain.setValueAtTime(0, now);
      gain2.gain.setValueAtTime(0.32, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
      osc2.connect(gain2);
      gain2.connect(this.masterGain);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.29);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Sound on collision impact (crunch / thump)
   */
  public playHit() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;

      // Low pitch drop
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.18);

      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.19);

      // Noise burst for crunch
      const bufferSize = this.ctx.sampleRate * 0.12;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(800, now);
      noiseFilter.frequency.linearRampToValueAtTime(100, now + 0.12);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.3, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterGain);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.13);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Sound on falling / death finish
   */
  public playDie() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.linearRampToValueAtTime(120, now + 0.35);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Fanfare chime when achieving high score / medal
   */
  public playMedal() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const time = now + idx * 0.1;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0, time);
        gain.gain.setValueAtTime(0.28, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.28);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(time);
        osc.stop(time + 0.3);
      });
    } catch {
      // Audio fallback
    }
  }

  /**
   * Subtle UI click tap
   */
  public playClick() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Audio fallback
    }
  }
}

export const sounds = new SoundController();
