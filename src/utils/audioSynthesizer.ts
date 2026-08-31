/**
 * Production Web Audio API Synthesizer & Audio Mixer Engine
 * Provides realistic background music, sound effects, and voice ducking.
 */

class AudioSynthesizerEngine {
  private ctx: AudioContext | null = null;
  private musicGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;
  private isPlayingMusic = false;
  private activeMusicTimers: number[] = [];
  private currentTrackType: string = 'lofi_ambient';
  private duckingAmount: number = 0.25; // 75% reduction during voiceover

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public init() {
    try {
      const ctx = this.getContext();
      if (!this.musicGainNode) {
        this.musicGainNode = ctx.createGain();
        this.musicGainNode.gain.setValueAtTime(0.4, ctx.currentTime);
        this.musicGainNode.connect(ctx.destination);
      }
      if (!this.sfxGainNode) {
        this.sfxGainNode = ctx.createGain();
        this.sfxGainNode.gain.setValueAtTime(0.6, ctx.currentTime);
        this.sfxGainNode.connect(ctx.destination);
      }
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  /**
   * Apply dynamic audio ducking
   * Lowers background music volume when speech is active, smooth ramp up when finished
   */
  public setDucking(isSpeaking: boolean) {
    if (!this.musicGainNode || !this.ctx) return;
    const now = this.ctx.currentTime;
    const targetGain = isSpeaking ? 0.12 : 0.45;
    this.musicGainNode.gain.cancelScheduledValues(now);
    this.musicGainNode.gain.linearRampToValueAtTime(targetGain, now + 0.15);
  }

  public setMusicVolume(volume: number) {
    if (!this.musicGainNode || !this.ctx) return;
    this.musicGainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime);
  }

  /**
   * Play procedural sound effects
   */
  public playSFX(type: 'whoosh' | 'pop' | 'ding' | 'bass_drop' | 'riser' | 'camera_shutter') {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const gain = ctx.createGain();
      gain.connect(this.sfxGainNode || ctx.destination);

      if (type === 'whoosh') {
        // White noise sweep
        const bufferSize = ctx.sampleRate * 0.3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(300, now);
        filter.frequency.exponentialRampToValueAtTime(3200, now + 0.25);
        noise.connect(filter);
        filter.connect(gain);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        noise.start(now);
      } else if (type === 'pop') {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);
        gain.gain.setValueAtTime(0.7, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.connect(gain);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'ding') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'triangle';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(1480, now);
        osc2.frequency.setValueAtTime(2960, now);
        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc1.connect(gain);
        osc2.connect(gain);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.8);
        osc2.stop(now + 0.8);
      } else if (type === 'bass_drop') {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.6);
        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        osc.connect(gain);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === 'riser') {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.5);
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, now);
        filter.frequency.exponentialRampToValueAtTime(4000, now + 0.5);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.4, now + 0.45);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
        osc.connect(filter);
        filter.connect(gain);
        osc.start(now);
        osc.stop(now + 0.55);
      } else if (type === 'camera_shutter') {
        const osc = ctx.createOscillator();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1200, now);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch {
      // Ignore user gesture constraints
    }
  }

  /**
   * Start procedural rhythmic backing tracks
   */
  public startMusic(trackType: string = 'lofi_ambient') {
    this.stopMusic();
    this.init();
    this.currentTrackType = trackType;
    this.isPlayingMusic = true;

    try {
      const ctx = this.getContext();
      const bpm = trackType === 'synthesized_phonk' ? 140 : trackType === 'synthwave_energy' ? 128 : trackType === 'trap_viral' ? 135 : 88;
      const stepDuration = 60 / bpm / 2; // Eighth note interval

      let step = 0;

      const playStep = () => {
        if (!this.isPlayingMusic) return;

        const now = ctx.currentTime;
        const subGain = ctx.createGain();
        subGain.connect(this.musicGainNode || ctx.destination);

        // Bass/Kick on beats 0, 4
        if (step % 4 === 0) {
          const kick = ctx.createOscillator();
          kick.type = 'sine';
          kick.frequency.setValueAtTime(trackType === 'synthesized_phonk' ? 120 : 90, now);
          kick.frequency.exponentialRampToValueAtTime(30, now + 0.2);
          subGain.gain.setValueAtTime(0.5, now);
          subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          kick.connect(subGain);
          kick.start(now);
          kick.stop(now + 0.2);
        }

        // Snare / Clap on beat 2, 6
        if (step % 4 === 2) {
          const snareOsc = ctx.createOscillator();
          snareOsc.type = 'triangle';
          snareOsc.frequency.setValueAtTime(220, now);
          subGain.gain.setValueAtTime(0.3, now);
          subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          snareOsc.connect(subGain);
          snareOsc.start(now);
          snareOsc.stop(now + 0.15);
        }

        // Melodic Chords or Arp
        const notes = trackType === 'synthesized_phonk' 
          ? [220, 261.63, 329.63, 392.0] // A minor
          : trackType === 'synthwave_energy'
          ? [196, 246.94, 293.66, 369.99] // G major 7
          : [261.63, 329.63, 392.0, 523.25]; // C major 7

        const note = notes[step % notes.length];
        const chordOsc = ctx.createOscillator();
        chordOsc.type = trackType === 'synthesized_phonk' ? 'sawtooth' : 'sine';
        chordOsc.frequency.setValueAtTime(note, now);

        const chordGain = ctx.createGain();
        chordGain.gain.setValueAtTime(0.15, now);
        chordGain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 1.8);
        chordOsc.connect(chordGain);
        chordGain.connect(this.musicGainNode || ctx.destination);

        chordOsc.start(now);
        chordOsc.stop(now + stepDuration * 1.8);

        step++;
        const timer = window.setTimeout(playStep, stepDuration * 1000);
        this.activeMusicTimers.push(timer);
      };

      playStep();
    } catch {
      // Audio not permitted yet
    }
  }

  public stopMusic() {
    this.isPlayingMusic = false;
    this.activeMusicTimers.forEach((t) => clearTimeout(t));
    this.activeMusicTimers = [];
  }
}

export const audioMixer = new AudioSynthesizerEngine();

/**
 * Text to Speech Helper (Uses Browser SpeechSynthesis with high-quality fallback)
 */
export function speakSentence(
  text: string,
  voiceConfig?: { pitch?: number; rate?: number; gender?: string; accent?: string },
  onStart?: () => void,
  onEnd?: () => void
): { cancel: () => void } {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onStart?.();
    const timer = setTimeout(() => onEnd?.(), 1500);
    return { cancel: () => clearTimeout(timer) };
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = voiceConfig?.rate || 1.05;
  utterance.pitch = voiceConfig?.pitch || 1.0;

  // Pick voice
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const englishVoices = voices.filter((v) => v.lang.startsWith('en'));
    if (voiceConfig?.gender === 'female') {
      const female = englishVoices.find((v) => /female|zira|samantha|karen|victoria|susan/i.test(v.name));
      if (female) utterance.voice = female;
    } else {
      const male = englishVoices.find((v) => /male|david|daniel|george|alex|james/i.test(v.name));
      if (male) utterance.voice = male;
    }
    if (!utterance.voice && englishVoices.length > 0) {
      utterance.voice = englishVoices[0];
    }
  }

  utterance.onstart = () => {
    audioMixer.setDucking(true);
    onStart?.();
  };

  utterance.onend = () => {
    audioMixer.setDucking(false);
    onEnd?.();
  };

  utterance.onerror = () => {
    audioMixer.setDucking(false);
    onEnd?.();
  };

  window.speechSynthesis.speak(utterance);

  return {
    cancel: () => {
      window.speechSynthesis.cancel();
      audioMixer.setDucking(false);
    },
  };
}
