/**
 * Procedural Audio Engine for Pharaoh's Legacy
 * Synthesizes Egyptian musical chimes, stone grinding, scanner beeps, and UI effects using Web Audio API.
 * Includes Web Speech API integration for museum & guide narration.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private sfxVol: number = 0.8;
  private musicVol: number = 0.5;
  private ambientOscs: OscillatorNode[] = [];
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolumes(masterMuted: boolean, sfxVolume: number, musicVolume: number) {
    this.isMuted = masterMuted;
    this.sfxVol = sfxVolume;
    this.musicVol = musicVolume;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : this.musicVol * 0.15, this.ctx.currentTime);
    }
  }

  // UI Click sound (soft stone tap)
  public playClick() {
    if (this.isMuted || this.sfxVol <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(this.sfxVol * 0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  // Futuristic Archaeological Scanner beep
  public playScanBeep() {
    if (this.isMuted || this.sfxVol <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.setValueAtTime(1320, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(this.sfxVol * 0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  // Hieroglyphic symbol illuminated chime
  public playGlyphChime(pitchMultiplier: number = 1) {
    if (this.isMuted || this.sfxVol <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [440, 493.88, 554.37, 659.25, 739.99]; // Pentatonic scale
    const baseFreq = notes[Math.min(notes.length - 1, Math.floor(pitchMultiplier * notes.length))] || 523.25;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);

    gain.gain.setValueAtTime(this.sfxVol * 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.4);
  }

  // Ancient Chamber Door Unlocking Rumble
  public playDoorOpen() {
    if (this.isMuted || this.sfxVol <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Low frequency stone grinding noise
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(65, now);
    osc.frequency.linearRampToValueAtTime(45, now + 1.2);

    gain.gain.setValueAtTime(this.sfxVol * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 1.2);

    // Harmonic release
    setTimeout(() => {
      this.playSuccessChime();
    }, 400);
  }

  // Puzzle success fanfare
  public playSuccessChime() {
    if (this.isMuted || this.sfxVol <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chord = [392.00, 493.88, 587.33, 783.99, 987.77]; // G major 7th / Egyptian golden arpeggio

    chord.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now);
      gain.gain.setValueAtTime(this.sfxVol * 0.2, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.6);
    });
  }

  // Warning / Trap trigger sound
  public playTrapWarning() {
    if (this.isMuted || this.sfxVol <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.setValueAtTime(140, now + 0.1);

    gain.gain.setValueAtTime(this.sfxVol * 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.35);
  }

  // Collect Scarab Token / Coin sound
  public playTokenCollect() {
    if (this.isMuted || this.sfxVol <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.07); // E6

    gain.gain.setValueAtTime(this.sfxVol * 0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.3);
  }

  // Ambient desert wind / Nile drone (gentle, harmonic)
  public startAmbient() {
    if (this.isAmbientPlaying) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : this.musicVol * 0.08, this.ctx.currentTime);
      this.ambientGain.connect(this.ctx.destination);

      // 2 subtle drone oscillators (D2 and A2)
      const drone1 = this.ctx.createOscillator();
      drone1.type = 'sine';
      drone1.frequency.setValueAtTime(73.42, this.ctx.currentTime); // D2
      drone1.connect(this.ambientGain);
      drone1.start();

      const drone2 = this.ctx.createOscillator();
      drone2.type = 'triangle';
      drone2.frequency.setValueAtTime(110.0, this.ctx.currentTime); // A2
      drone2.connect(this.ambientGain);
      drone2.start();

      this.ambientOscs = [drone1, drone2];
      this.isAmbientPlaying = true;
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  public stopAmbient() {
    this.ambientOscs.forEach(o => {
      try {
        o.stop();
        o.disconnect();
      } catch {
        // ignore
      }
    });
    this.ambientOscs = [];
    this.isAmbientPlaying = false;
  }

  // Voice narration using Web Speech API
  public speak(text: string, onEnd?: () => void) {
    if (this.isMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    if (onEnd) utterance.onend = onEnd;
    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const sound = new SoundEngine();
