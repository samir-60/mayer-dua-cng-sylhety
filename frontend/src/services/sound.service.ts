// Web Audio API Procedural Sound Synthesizer for Mayer Duya CNG
// Complies strictly with Master Build Prompt Part 11:
// All sound generated live with oscillators, filtered noise and envelopes.
// No external audio files. Ducking, mute persistence, and zero religious audio.

class SoundService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private engineMasterGain: GainNode | null = null;

  // CNG Engine state: two detuned sawtooth oscillators + lowpass filter + flutter LFO
  private engineOsc1: OscillatorNode | null = null;
  private engineOsc2: OscillatorNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;
  private engineFlutterLfo: OscillatorNode | null = null;
  private engineFlutterGain: GainNode | null = null;
  private isEngineRunning: boolean = false;

  // Rain continuous ambient state
  private rainNoiseNode: AudioBufferSourceNode | null = null;
  private rainGain: GainNode | null = null;

  // Low gas beep interval
  private lowGasInterval: number | null = null;

  // Mute state
  private isMuted: boolean = false;

  // Google Voice Speech Synthesis
  private googleVoice: SpeechSynthesisVoice | null = null;
  private lastViralShoutTime: number = 0;

  constructor() {
    try {
      const savedMute = localStorage.getItem('mayer_dua_muted');
      if (savedMute !== null) {
        this.isMuted = savedMute === 'true';
      }
    } catch {}
    this.initVoices();
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const updateVoices = () => {
      try {
        const voices = window.speechSynthesis.getVoices();
        this.googleVoice =
          voices.find(
            (v) =>
              (v.name.includes('Google') || v.name.includes('Bangla') || v.name.includes('বাংলা') || v.name.includes('Bengali')) &&
              (v.lang.startsWith('bn') || v.lang.startsWith('bd'))
          ) ||
          voices.find((v) => v.lang.startsWith('bn')) ||
          voices.find((v) => v.lang.includes('bn')) ||
          null;
      } catch {}
    };

    updateVoices();
    try {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    } catch {}
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();
        this.engineMasterGain = this.ctx.createGain();

        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.75, this.ctx.currentTime);
        this.sfxGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
        this.engineMasterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);

        this.sfxGain.connect(this.masterGain);
        this.engineMasterGain.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem('mayer_dua_muted', String(muted));
    } catch {}

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.75, this.ctx.currentTime, 0.05);
    }
  }

  public toggleMute(): boolean {
    this.setMute(!this.isMuted);
    return this.isMuted;
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(vol, 1)), this.ctx.currentTime);
    }
  }

  // --- 1. CNG ENGINE SYNTHESIZER ---
  // Two detuned sawtooth oscillators through lowpass filter, flutter LFO (20-30Hz), cough on low health
  public startEngine() {
    this.initContext();
    if (!this.ctx || this.isEngineRunning) return;

    try {
      const now = this.ctx.currentTime;
      this.engineOsc1 = this.ctx.createOscillator();
      this.engineOsc2 = this.ctx.createOscillator();
      this.engineFilter = this.ctx.createBiquadFilter();

      // Flutter LFO (24 Hz) for rough mechanical engine rumble
      this.engineFlutterLfo = this.ctx.createOscillator();
      this.engineFlutterGain = this.ctx.createGain();
      this.engineFlutterLfo.frequency.setValueAtTime(24, now);
      this.engineFlutterGain.gain.setValueAtTime(0.08, now);

      this.engineOsc1.type = 'sawtooth';
      this.engineOsc2.type = 'sawtooth';

      // Idle frequencies
      this.engineOsc1.frequency.setValueAtTime(46, now);
      this.engineOsc2.frequency.setValueAtTime(47.8, now); // slight detune

      this.engineFilter.type = 'lowpass';
      this.engineFilter.frequency.setValueAtTime(320, now);

      // Connect
      this.engineOsc1.connect(this.engineFilter);
      this.engineOsc2.connect(this.engineFilter);
      this.engineFlutterLfo.connect(this.engineFlutterGain);
      this.engineFlutterGain.connect(this.engineMasterGain!.gain);

      this.engineFilter.connect(this.engineMasterGain!);

      this.engineOsc1.start();
      this.engineOsc2.start();
      this.engineFlutterLfo.start();
      this.isEngineRunning = true;
    } catch (e) {
      console.warn('Could not start audio engine:', e);
    }
  }

  public updateEnginePitch(speedRatio: number, isAccelerating: boolean, healthPercent: number = 100) {
    if (!this.ctx || !this.engineOsc1 || !this.engineOsc2 || !this.engineFilter || !this.isEngineRunning) return;

    const now = this.ctx.currentTime;
    const baseFreq = 46;
    const maxFreq = 160;
    const accelBonus = isAccelerating ? 20 : 0;

    let targetFreq = baseFreq + speedRatio * (maxFreq - baseFreq) + accelBonus;
    let targetFilter = 300 + speedRatio * 900;

    // Engine cough at low health (< 25%)
    if (healthPercent < 25 && Math.random() < 0.15) {
      targetFreq *= 0.6;
      targetFilter *= 0.5;
    }

    this.engineOsc1.frequency.setTargetAtTime(targetFreq, now, 0.08);
    this.engineOsc2.frequency.setTargetAtTime(targetFreq * 1.035, now, 0.08);
    this.engineFilter.frequency.setTargetAtTime(targetFilter, now, 0.08);

    const targetGain = 0.15 + speedRatio * 0.22 + (isAccelerating ? 0.08 : 0);
    this.engineMasterGain?.gain.setTargetAtTime(targetGain, now, 0.08);
  }

  public stopEngine() {
    if (this.engineOsc1) {
      try {
        this.engineOsc1.stop();
        this.engineOsc2?.stop();
        this.engineFlutterLfo?.stop();
        this.engineOsc1.disconnect();
        this.engineOsc2?.disconnect();
        this.engineFlutterLfo?.disconnect();
      } catch {}
      this.engineOsc1 = null;
      this.engineOsc2 = null;
      this.engineFlutterLfo = null;
    }
    this.isEngineRunning = false;
  }

  // --- 2. DUCKING HELPER ---
  // Lowers engine volume by 30% when horn or loud external sound plays
  private duckEngine(durationSec: number = 0.35) {
    if (!this.engineMasterGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    const currentGain = this.engineMasterGain.gain.value;
    this.engineMasterGain.gain.setValueAtTime(currentGain * 0.7, now);
    this.engineMasterGain.gain.setTargetAtTime(currentGain, now + durationSec, 0.1);
  }

  // --- 3. CNG HORN (Short nasal square wave pair, 0.25s) ---
  public playHorn(isCustom: boolean = false) {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    this.duckEngine(0.3);
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const hornGain = this.ctx.createGain();

    osc1.type = 'square';
    osc2.type = 'square';

    if (isCustom) {
      // Deeper double tone
      osc1.frequency.setValueAtTime(320, now);
      osc2.frequency.setValueAtTime(440, now);
    } else {
      // Classic nasal CNG twin-honk
      const slightVariation = (Math.random() - 0.5) * 30;
      osc1.frequency.setValueAtTime(740 + slightVariation, now);
      osc2.frequency.setValueAtTime(885 + slightVariation, now);
    }

    hornGain.gain.setValueAtTime(0.3, now);
    hornGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc1.connect(hornGain);
    osc2.connect(hornGain);
    hornGain.connect(this.sfxGain!);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.26);
    osc2.stop(now + 0.26);
  }

  // --- 4. BUS AND TRUCK HORN (Low double square wave with long tail) ---
  public playBusHorn() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    this.duckEngine(0.8);
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'square';
    osc2.type = 'sawtooth';
    osc1.frequency.setValueAtTime(175, now);
    osc2.frequency.setValueAtTime(220, now);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain!);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.8);
    osc2.stop(now + 0.8);
  }

  // --- 5. RICKSHAW BELL (Two sine tones with fast decay) ---
  public playRickshawBell() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    [0, 0.12].forEach((offset) => {
      const now = this.ctx!.currentTime + offset;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(2150, now);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.002, now + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now);
      osc.stop(now + 0.2);
    });
  }

  // --- 6. BOOST SOUND (Fades in higher oscillator + filtered noise) ---
  public playBoostSound() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.35);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.4);

    osc.connect(gain);
    gain.connect(this.sfxGain!);

    osc.start(now);
    osc.stop(now + 0.42);
  }

  // --- 7. PICKUP CHIME (Two soft sine notes going up on passenger boarding) ---
  public playPickupChime() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const notes = [587.33, 880.0]; // D5 -> A5
    notes.forEach((freq, idx) => {
      const now = this.ctx!.currentTime + idx * 0.14;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.002, now + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now);
      osc.stop(now + 0.32);
    });
  }

  // --- 8. PAY SOUND (Rapid soft ticks like counting paper notes on drop-off) ---
  public playPaySound() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const ticks = 5;
    for (let i = 0; i < ticks; i++) {
      const now = this.ctx.currentTime + i * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400 + i * 150, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.04);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now);
      osc.stop(now + 0.05);
    }
  }

  // --- 9. COLLISION THUD & METAL RATTLE ---
  public playCollision(isHeavy: boolean = false) {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    // Low thud
    const thudOsc = this.ctx.createOscillator();
    const thudGain = this.ctx.createGain();
    thudOsc.type = 'sine';
    thudOsc.frequency.setValueAtTime(isHeavy ? 90 : 130, now);
    thudOsc.frequency.exponentialRampToValueAtTime(30, now + (isHeavy ? 0.35 : 0.2));

    thudGain.gain.setValueAtTime(isHeavy ? 0.5 : 0.3, now);
    thudGain.gain.exponentialRampToValueAtTime(0.01, now + (isHeavy ? 0.35 : 0.2));

    thudOsc.connect(thudGain);
    thudGain.connect(this.sfxGain!);
    thudOsc.start(now);
    thudOsc.stop(now + 0.4);

    // Metal rattle noise
    const rattleBuffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.25), this.ctx.sampleRate);
    const data = rattleBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.08));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = rattleBuffer;
    const rattleFilter = this.ctx.createBiquadFilter();
    rattleFilter.type = 'highpass';
    rattleFilter.frequency.setValueAtTime(1800, now);

    const rattleGain = this.ctx.createGain();
    rattleGain.gain.setValueAtTime(isHeavy ? 0.3 : 0.15, now);

    noise.connect(rattleFilter);
    rattleFilter.connect(rattleGain);
    rattleGain.connect(this.sfxGain!);
    noise.start(now);
  }

  // --- 10. POLICE WHISTLE (Sine with fast vibrato) ---
  public playPoliceWhistle() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2850, now);

    vibrato.type = 'sine';
    vibrato.frequency.setValueAtTime(25, now); // fast vibrato
    vibratoGain.gain.setValueAtTime(180, now);

    vibrato.connect(osc.frequency);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.4);

    osc.connect(gain);
    gain.connect(this.sfxGain!);

    vibrato.start(now);
    osc.start(now);
    osc.stop(now + 0.42);
    vibrato.stop(now + 0.42);
  }

  // --- 10B. ANGRY MOB & PUBLIC COMMOTION (Rumbling square/saw with shouting frequency shifts) ---
  // --- 10B. ANGRY MOB & VIRAL PUBLIC BEATING (গণধোলাই, লাঠি/জুতার বাড়ি ও ভাইরাল ডায়লগ) ---
  public playAngryMob() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    // Raucous angry crowd shouting oscillators
    for (let i = 0; i < 4; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = i % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(130 + i * 45 + Math.random() * 30, now);
      osc.frequency.linearRampToValueAtTime(220 + i * 35, now + 0.8);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.85);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now);
      osc.stop(now + 0.9);
    }

    // Slap / bamboo stick thud ("ঠাস ঠাস বাড়ি")
    this.playSlapThuds();

    // Trigger high-volume viral dialogue speech via Web Speech API (Google tone)
    this.speakViralPublicShout();
  }

  // --- 10C. PUBLIC COLLISION & BEATING ("বারি খাইলে পাবলিক মারের শব্দ ও চামড়া লাল করার গুগল টোন") ---
  public playPublicCollisionHit() {
    this.playCollision(false);
    this.playSlapThuds();

    // Debounce the vocal viral shout so speech doesn't overlap on rapid collisions
    const now = Date.now();
    if (now - this.lastViralShoutTime > 4500) {
      this.lastViralShoutTime = now;
      this.speakViralPublicShout();
    }
  }

  // Slap / cane / shoe hits impact sounds (Layered flesh impact + sharp snap crack)
  public playSlapThuds() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // 4 successive rapid slap/cane hits: "ঠাস! ধাপ! ঠাস! ঠাস!"
    [0, 0.11, 0.24, 0.4].forEach((delay, idx) => {
      const t = now + delay;

      // Heavy body/flesh thud
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320 + idx * 35, t);
      osc.frequency.exponentialRampToValueAtTime(35, t + 0.12);

      gain.gain.setValueAtTime(0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.12);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(t);
      osc.stop(t + 0.13);

      // Sharp snap / slap crack noise burst
      try {
        const snapLen = Math.floor(this.ctx!.sampleRate * 0.04);
        const snapBuf = this.ctx!.createBuffer(1, snapLen, this.ctx!.sampleRate);
        const snapData = snapBuf.getChannelData(0);
        for (let i = 0; i < snapLen; i++) {
          snapData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx!.sampleRate * 0.009));
        }
        const noise = this.ctx!.createBufferSource();
        noise.buffer = snapBuf;
        const noiseFilter = this.ctx!.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.setValueAtTime(1400, t);

        const noiseGain = this.ctx!.createGain();
        noiseGain.gain.setValueAtTime(0.35, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.04);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.sfxGain!);
        noise.start(t);
      } catch {}
    });
  }

  // Speaks the viral public mob anger line requested by user with Google Bengali Tone
  public speakViralPublicShout(forceVoiceText?: string) {
    if (this.isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const phrases = [
        'ঐ ব্যাটা! সিএনজি থামা! তোরে পিটাইয়া পিঠের চামড়া লাল করে দিবো, সব নগরামি বের করবো! ধর ব্যাটারে!',
        'ঐ ড্রাইভার! গাড়ি থামা কইতাছি! পিটাইয়া চামড়া লাল করমু, তোর সব নগরামি আইজ ছুডামু!',
        'ধর ধর! সিএনজি খাঁচা ঘেরাও কর! জুতা দিয়া পিটাইয়া সব রংবাজি আর নগরামি বাইর করমু!',
        'রাস্তা কি তোর বাপের নাকি রে?! আইজ পিটাইয়া চামড়া লাল করমু, সব নগরামি বের করবো!',
      ];
      const selected = forceVoiceText || phrases[Math.floor(Math.random() * phrases.length)];
      const utterance = new SpeechSynthesisUtterance(selected);
      utterance.lang = 'bn-BD';

      // Attach Google tone voice
      if (!this.googleVoice) {
        const voices = window.speechSynthesis.getVoices();
        this.googleVoice =
          voices.find(
            (v) =>
              (v.name.includes('Google') || v.name.includes('Bangla') || v.name.includes('বাংলা') || v.name.includes('Bengali')) &&
              (v.lang.startsWith('bn') || v.lang.startsWith('bd'))
          ) ||
          voices.find((v) => v.lang.startsWith('bn')) ||
          null;
      }
      if (this.googleVoice) {
        utterance.voice = this.googleVoice;
      }

      utterance.rate = 1.15; // fast, urgent angry speech
      utterance.pitch = 0.95; // deep commanding mob tone
      utterance.volume = 1.0; // full loud volume
      window.speechSynthesis.speak(utterance);
    } catch {}
  }

  // --- 11. LOW GAS BEEP (Slow beep at 2 Hz below 15%) ---
  public setLowGasBeep(active: boolean) {
    if (!active) {
      if (this.lowGasInterval !== null) {
        clearInterval(this.lowGasInterval);
        this.lowGasInterval = null;
      }
      return;
    }

    if (this.lowGasInterval !== null) return;
    this.lowGasInterval = window.setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(950, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.12);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now);
      osc.stop(now + 0.14);
    }, 500); // 2 Hz
  }

  // --- 12. RAIN AMBIENT (Layered filtered noise) ---
  public setRain(active: boolean) {
    this.initContext();
    if (!this.ctx) return;

    if (!active) {
      if (this.rainNoiseNode) {
        try {
          this.rainNoiseNode.stop();
          this.rainNoiseNode.disconnect();
        } catch {}
        this.rainNoiseNode = null;
      }
      return;
    }

    if (this.rainNoiseNode) return;

    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      this.rainNoiseNode = this.ctx.createBufferSource();
      this.rainNoiseNode.buffer = buffer;
      this.rainNoiseNode.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

      this.rainNoiseNode.connect(filter);
      filter.connect(this.rainGain);
      this.rainGain.connect(this.masterGain!);

      this.rainNoiseNode.start();
    } catch (e) {
      console.warn('Rain audio error:', e);
    }
  }

  // --- 13. THUNDER BURST ---
  public playThunder() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(70, now);
    osc.frequency.exponentialRampToValueAtTime(20, now + 1.2);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 1.5);

    osc.connect(gain);
    gain.connect(this.sfxGain!);

    osc.start(now);
    osc.stop(now + 1.6);
  }

  // --- 14. BRIDGE RUMBLE (Low pulse on deck) ---
  public playBridgeRumble() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(55, now);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain!);

    osc.start(now);
    osc.stop(now + 0.28);
  }

  // --- 15. UI CLICK ---
  public playClick() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, now);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain!);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // --- 16. CASH / TAKA REGISTER SOUND ---
  public playCashRegister() {
    this.playPaySound();
  }

  // --- 17. GOAT BLEAT ---
  public playGoatBleat() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.linearRampToValueAtTime(340, now + 0.2);
    osc.frequency.linearRampToValueAtTime(240, now + 0.55);

    vibrato.type = 'sine';
    vibrato.frequency.setValueAtTime(14, now);
    vibratoGain.gain.setValueAtTime(35, now);
    vibrato.connect(osc.frequency);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.sfxGain!);

    vibrato.start(now);
    osc.start(now);
    osc.stop(now + 0.62);
    vibrato.stop(now + 0.62);
  }

  // --- 18. EXHAUST POP ---
  public playExhaustPop() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.08);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

    osc.connect(gain);
    gain.connect(this.sfxGain!);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // --- 19. TYRE DRIFT ---
  public playTyreDrift() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.35);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, now);
    filter.Q.setValueAtTime(6, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.33);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain!);

    noise.start(now);
    noise.stop(now + 0.35);
  }

  // --- 20. BUMP / POTHOLE THUD ---
  public playBump() {
    this.playCollision(false);
  }

  // Speech helper (retains spoken Sylheti lines without external audio files)
  public speakSylheti(text: string, speakerName?: string, isUrgent: boolean = false) {
    if (this.isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'bn-BD';
      utterance.rate = isUrgent ? 1.25 : 1.1;
      utterance.pitch = speakerName && speakerName.includes('পুলিশ') ? 0.9 : 1.05;
      utterance.volume = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch {}
  }
}

export const soundService = new SoundService();
