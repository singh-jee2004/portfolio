/**
 * Pure Single-Source High Performance Voice Engine for 3D AI Avatar
 * Ensures Zero Dual-Audio Collisions & Instant 0ms Stop / Play Control
 */

export interface PlaySpeechOptions {
  text: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
  rate?: number;
  pitch?: number;
}

class InstantVoiceEngine {
  private synth: SpeechSynthesis | null = null;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private audioCtx: AudioContext | null = null;
  private currentOscillator: OscillatorNode | null = null;
  private currentGain: GainNode | null = null;
  private fallbackTimeout: any = null;
  private isPlaying: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  public initVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return;

    const preferred =
      voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('Daniel') ||
            v.name.includes('Guy') ||
            v.name.includes('David') ||
            v.name.includes('Alex') ||
            v.name.includes('Male'))
      ) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      voices[0];

    if (preferred) {
      this.selectedVoice = preferred;
    }
  }

  public speak(options: PlaySpeechOptions): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        options.onEnd?.();
        return resolve();
      }

      // Hard stop any ongoing speech/audio first to prevent audio overlap
      this.stop();
      this.isPlaying = true;

      const cleanText = options.text
        .replace(/https?:\/\/\S+/g, '')
        .replace(/[*_#`~]/g, '')
        .trim();

      if (!cleanText) {
        this.isPlaying = false;
        options.onEnd?.();
        return resolve();
      }

      // ── PATH 1: BROWSER NATIVE SPEECH SYNTHESIS ──
      if (this.synth) {
        if (!this.selectedVoice) {
          this.initVoices();
        }

        const utterance = new SpeechSynthesisUtterance(cleanText);
        this.activeUtterance = utterance;

        if (this.selectedVoice) {
          utterance.voice = this.selectedVoice;
        }

        utterance.volume = 1.0;
        utterance.rate = options.rate || 0.95;
        utterance.pitch = options.pitch || 1.0;

        let completed = false;

        const finish = () => {
          if (!completed) {
            completed = true;
            this.isPlaying = false;
            this.activeUtterance = null;
            options.onEnd?.();
            resolve();
          }
        };

        utterance.onstart = () => {
          this.isPlaying = true;
          options.onStart?.();
        };

        utterance.onend = () => {
          finish();
        };

        utterance.onerror = (e) => {
          console.warn('SpeechSynthesis utterance error:', e);
          finish();
        };

        try {
          if (this.synth.paused) {
            this.synth.resume();
          }
          this.synth.speak(utterance);
          return;
        } catch (e) {
          console.warn('SpeechSynthesis speak failed:', e);
        }
      }

      // ── PATH 2: WEB AUDIO FALLBACK (ONLY IF SPEECH SYNTHESIS IS NOT AVAILABLE) ──
      this.playWebAudioFallback(cleanText, options).then(resolve);
    });
  }

  private playWebAudioFallback(cleanText: string, options: PlaySpeechOptions): Promise<void> {
    return new Promise((resolve) => {
      try {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtxClass) {
          options.onEnd?.();
          return resolve();
        }

        if (!this.audioCtx || this.audioCtx.state === 'closed') {
          this.audioCtx = new AudioCtxClass();
        }
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }

        const ctx = this.audioCtx;
        const duration = Math.min(6, cleanText.length * 0.07);

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        this.currentOscillator = osc;
        this.currentGain = gain;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(130, ctx.currentTime);

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(0);
        osc.stop(ctx.currentTime + duration);

        options.onStart?.();

        this.fallbackTimeout = setTimeout(() => {
          this.cleanupWebAudio();
          options.onEnd?.();
          resolve();
        }, duration * 1000);
      } catch (e) {
        this.cleanupWebAudio();
        options.onEnd?.();
        resolve();
      }
    });
  }

  private cleanupWebAudio() {
    if (this.currentOscillator) {
      try {
        this.currentOscillator.stop(0);
        this.currentOscillator.disconnect();
      } catch (e) {}
      this.currentOscillator = null;
    }
    if (this.currentGain) {
      try {
        this.currentGain.disconnect();
      } catch (e) {}
      this.currentGain = null;
    }
    if (this.fallbackTimeout) {
      clearTimeout(this.fallbackTimeout);
      this.fallbackTimeout = null;
    }
  }

  public stop() {
    this.isPlaying = false;

    // 1. Instantly kill SpeechSynthesis audio
    if (this.synth) {
      try {
        if (this.activeUtterance) {
          this.activeUtterance.onstart = null;
          this.activeUtterance.onend = null;
          this.activeUtterance.onerror = null;
        }
        this.synth.cancel();
      } catch (e) {}
    }
    this.activeUtterance = null;

    // 2. Instantly kill Web Audio fallback nodes
    this.cleanupWebAudio();

    // 3. Suspend AudioContext
    if (this.audioCtx && this.audioCtx.state === 'running') {
      try {
        this.audioCtx.suspend();
      } catch (e) {}
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const voiceEngine = new InstantVoiceEngine();
