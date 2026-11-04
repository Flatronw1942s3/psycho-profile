/**
 * PSYCHO-PROFILE // ANALYZER
 * Core Game Engine, Finite State Machine (FSM), JSON Schema Validator & Web Audio Synth (engine.js)
 */
(function (global) {
  'use strict';

  const PROFILE_STORAGE_KEY = 'psycho_profile_player_save_v1';

  /**
   * Canonical Finite State Machine States
   */
  const FSM_STATES = Object.freeze({
    LOADING: 'LOADING',
    MENU_IDLE: 'MENU_IDLE',
    TUTORIAL_READ: 'TUTORIAL_READ',
    DIALOGUE_TYPE: 'DIALOGUE_TYPE',
    CHOICE_IDLE: 'CHOICE_IDLE',
    VERDICT_ANIM: 'VERDICT_ANIM',
    SUMMARY_READ: 'SUMMARY_READ'
  });

  /**
   * Strict FSM Transition Graph
   */
  const VALID_TRANSITIONS = Object.freeze({
    [FSM_STATES.LOADING]: [FSM_STATES.MENU_IDLE, FSM_STATES.DIALOGUE_TYPE],
    [FSM_STATES.MENU_IDLE]: [FSM_STATES.DIALOGUE_TYPE, FSM_STATES.TUTORIAL_READ],
    [FSM_STATES.TUTORIAL_READ]: [FSM_STATES.MENU_IDLE, FSM_STATES.DIALOGUE_TYPE],
    [FSM_STATES.DIALOGUE_TYPE]: [FSM_STATES.CHOICE_IDLE, FSM_STATES.VERDICT_ANIM, FSM_STATES.MENU_IDLE],
    [FSM_STATES.CHOICE_IDLE]: [FSM_STATES.VERDICT_ANIM, FSM_STATES.MENU_IDLE],
    [FSM_STATES.VERDICT_ANIM]: [FSM_STATES.SUMMARY_READ, FSM_STATES.MENU_IDLE],
    [FSM_STATES.SUMMARY_READ]: [FSM_STATES.DIALOGUE_TYPE, FSM_STATES.MENU_IDLE]
  });

  /**
   * Declarative JSON Schema Specification for `assets/data/scenarios.json`
   */
  const SCENARIOS_SCHEMA = Object.freeze({
    $id: 'psycho-profile://schemas/scenarios-v1.1.json',
    type: 'object',
    required: ['schema_version', 'supported_locales', 'difficulty_modes', 'scenarios'],
    requiredLocales: ['ru', 'en'],
    scenarioRequired: [
      'id',
      'case_number',
      'time_limit_sec',
      'sprite',
      'background',
      'case_title',
      'character_name',
      'dialogue',
      'timeout_verdict',
      'options'
    ],
    optionRequired: ['id', 'function_code', 'is_correct', 'text', 'axes', 'breakdown', 'explanation', 'hint']
  });

  /**
   * Strict Runtime JSON Schema Validator for Database Scaling Protocol
   */
  class ScenariosSchemaValidator {
    static isLocalizedObject(val, requiredLocales) {
      if (!val || typeof val !== 'object' || Array.isArray(val)) return false;
      return requiredLocales.every((loc) => typeof val[loc] === 'string' && val[loc].trim().length > 0);
    }

    static validateScenarioBlock(scenario, requiredLocales, idx = 0) {
      const errors = [];
      const prefix = `scenarios[${idx}] (${scenario && scenario.id ? scenario.id : 'unknown'})`;

      if (!scenario || typeof scenario !== 'object') {
        return [`${prefix}: Scenario block must be an object.`];
      }

      for (const field of SCENARIOS_SCHEMA.scenarioRequired) {
        if (!(field in scenario)) {
          errors.push(`${prefix}: Missing required field "${field}".`);
        }
      }

      const validCaseNumber =
        (typeof scenario.case_number === 'string' && scenario.case_number.trim().length > 0) ||
        this.isLocalizedObject(scenario.case_number, requiredLocales);
      if (!validCaseNumber) {
        errors.push(`${prefix}: "case_number" must be a localized object or non-empty string.`);
      }

      if (typeof scenario.time_limit_sec !== 'number' || scenario.time_limit_sec <= 0) {
        errors.push(`${prefix}: "time_limit_sec" must be a positive number.`);
      }

      if (typeof scenario.sprite !== 'string' || !scenario.sprite.trim()) {
        errors.push(`${prefix}: "sprite" must be a non-empty asset path string (e.g. assets/media/sprites/name.png).`);
      }

      if (typeof scenario.background !== 'string' || !scenario.background.trim()) {
        errors.push(`${prefix}: "background" must be a non-empty asset path string (e.g. assets/media/backgrounds/case_01.png).`);
      }

      if (!this.isLocalizedObject(scenario.case_title, requiredLocales)) {
        errors.push(`${prefix}: "case_title" must contain non-empty strings for [${requiredLocales.join(', ')}].`);
      }

      if (!this.isLocalizedObject(scenario.character_name, requiredLocales)) {
        errors.push(`${prefix}: "character_name" must contain non-empty strings for [${requiredLocales.join(', ')}].`);
      }

      if (scenario.sprites !== undefined && (!scenario.sprites || typeof scenario.sprites !== 'object')) {
        errors.push(`${prefix}: Optional fallback "sprites" must be an object when provided.`);
      }

      if (!Array.isArray(scenario.dialogue) || scenario.dialogue.length === 0) {
        errors.push(`${prefix}: "dialogue" must be a non-empty array.`);
      } else {
        scenario.dialogue.forEach((line, dIdx) => {
          if (!line.id || typeof line.id !== 'string') {
            errors.push(`${prefix}.dialogue[${dIdx}]: Missing string "id".`);
          }
          if (!line.emotion || typeof line.emotion !== 'string') {
            errors.push(`${prefix}.dialogue[${dIdx}]: Missing string "emotion".`);
          }
          if (!this.isLocalizedObject(line.speaker, requiredLocales)) {
            errors.push(`${prefix}.dialogue[${dIdx}]: "speaker" missing required locales.`);
          }
          if (!this.isLocalizedObject(line.text, requiredLocales)) {
            errors.push(`${prefix}.dialogue[${dIdx}]: "text" missing required locales.`);
          }
        });
      }

      if (!Array.isArray(scenario.options) || scenario.options.length !== 4) {
        errors.push(`${prefix}: "options" must contain exactly 4 verdict choices.`);
      } else {
        let correctCount = 0;
        scenario.options.forEach((opt, oIdx) => {
          const optPrefix = `${prefix}.options[${oIdx}]`;
          for (const reqKey of SCENARIOS_SCHEMA.optionRequired) {
            if (!(reqKey in opt)) {
              errors.push(`${optPrefix}: Missing required key "${reqKey}".`);
            }
          }
          if (typeof opt.function_code !== 'string' || !opt.function_code.trim()) {
            errors.push(`${optPrefix}: Invalid "function_code".`);
          }
          if (opt.is_correct === true) {
            correctCount += 1;
          }
          for (const i18nKey of ['text', 'axes', 'breakdown', 'explanation', 'hint']) {
            const val = opt[i18nKey];
            const validStrOrObj =
              (typeof val === 'string' && val.trim().length > 0) || this.isLocalizedObject(val, requiredLocales);
            if (!validStrOrObj) {
              errors.push(`${optPrefix}: "${i18nKey}" must be a valid localized dictionary or non-empty string.`);
            }
          }
        });

        if (correctCount !== 1) {
          errors.push(`${prefix}: Exactly 1 option must have "is_correct: true" (found ${correctCount}).`);
        }
      }

      return errors;
    }

    static validateDatabase(db) {
      const errors = [];
      if (!db || typeof db !== 'object') {
        return { valid: false, errors: ['Root JSON payload is not an object.'] };
      }

      for (const req of SCENARIOS_SCHEMA.required) {
        if (!(req in db)) {
          errors.push(`Root: Missing required property "${req}".`);
        }
      }

      const locales = SCENARIOS_SCHEMA.requiredLocales;
      if (!Array.isArray(db.scenarios) || db.scenarios.length === 0) {
        errors.push('Root: "scenarios" must be a non-empty array.');
      } else {
        const seenIds = new Set();
        db.scenarios.forEach((sc, i) => {
          if (sc && sc.id) {
            if (seenIds.has(sc.id)) {
              errors.push(`Duplicate scenario id "${sc.id}" at index ${i}.`);
            }
            seenIds.add(sc.id);
          }
          errors.push(...this.validateScenarioBlock(sc, locales, i));
        });
      }

      return {
        valid: errors.length === 0,
        schemaId: SCENARIOS_SCHEMA.$id,
        scenarioCount: Array.isArray(db.scenarios) ? db.scenarios.length : 0,
        errors
      };
    }
  }

  /**
   * Procedural Web Audio API Synthesizer — Neo-Noir Ambient BGM, Interface/Timer SFX & Sink Routing
   * (100% Autonomous / Zero External Assets)
   */
  class ProceduralAudioSynth {
    constructor() {
      this._ctx = null;
      this._masterGain = null;
      this._bgmGain = null;
      this._sfxGain = null;
      this._streamDest = null;
      this._sinkAudioEl = null;
      this._usingStreamBridge = false;
      this._bridgeStarting = false;

      this._masterVolume = 0.8;
      this._bgmEnabled = true;
      this._sfxEnabled = true;
      this._sinkId = '';

      this._lastBlipTime = 0;
      this._bgmDroneStarted = false;
      this._bgmInterval = null;
      this._bgmStep = 0;
    }

    attachSinkElement(audioEl) {
      if (!audioEl) return;
      this._sinkAudioEl = audioEl;
      this._sinkAudioEl.playsInline = true;
    }

    setMasterVolume(vol) {
      const clamped = Math.max(0, Math.min(1, Number.isFinite(Number(vol)) ? Number(vol) : 0.8));
      this._masterVolume = clamped;
      if (this._ctx && this._masterGain) {
        const now = this._ctx.currentTime;
        this._masterGain.gain.cancelScheduledValues(now);
        this._masterGain.gain.setTargetAtTime(clamped, now, 0.02);
        this._syncBgmPlayback();
      }
    }

    getMasterVolume() {
      return this._masterVolume;
    }

    setBgmEnabled(flag) {
      this._bgmEnabled = Boolean(flag);
      if (this._ctx && this._bgmGain) {
        this._syncBgmPlayback();
      }
    }

    isBgmEnabled() {
      return this._bgmEnabled;
    }

    setSfxEnabled(flag) {
      this._sfxEnabled = Boolean(flag);
      if (this._ctx && this._sfxGain) {
        const now = this._ctx.currentTime;
        this._sfxGain.gain.cancelScheduledValues(now);
        this._sfxGain.gain.setTargetAtTime(this._sfxEnabled ? 1.0 : 0.0, now, 0.015);
      }
    }

    isSfxEnabled() {
      return this._sfxEnabled;
    }

    setEnabled(flag) {
      const val = Boolean(flag);
      this.setBgmEnabled(val);
      this.setSfxEnabled(val);
    }

    isEnabled() {
      return this._bgmEnabled || this._sfxEnabled;
    }

    getSinkId() {
      return this._sinkId;
    }

    async setSinkId(deviceId) {
      const normalized = typeof deviceId === 'string' ? deviceId : '';
      this._sinkId = normalized;

      if (this._ctx) {
        await this._activateSinkBridge();
      }

      if (this._sinkAudioEl && typeof this._sinkAudioEl.setSinkId === 'function') {
        try {
          await this._sinkAudioEl.setSinkId(this._sinkId);
          if (this._usingStreamBridge && this._sinkAudioEl.paused) {
            this._sinkAudioEl.play().catch(() => {});
          }
        } catch (_) {
          this._sinkId = '';
          try {
            await this._sinkAudioEl.setSinkId('');
          } catch (__) {
            // Ignore fallback error
          }
        }
      } else if (this._ctx && typeof this._ctx.setSinkId === 'function') {
        try {
          await this._ctx.setSinkId(this._sinkId);
        } catch (_) {
          this._sinkId = '';
        }
      }

      return this._sinkId;
    }

    /**
     * Unlock AudioContext, activate <audio> sinkId bridge, and sync ambient BGM on user gesture
     */
    unlockAndSync() {
      const ctx = this._ensureContext(true);
      if (!ctx) return;
      this._activateSinkBridge();
      this._syncBgmPlayback();
    }

    _ensureContext(forceInit = false) {
      if (!forceInit && !this._sfxEnabled && !this._bgmEnabled) return null;
      const AudioCtx = global.AudioContext || global.webkitAudioContext;
      if (!AudioCtx) return null;

      if (!this._ctx) {
        try {
          this._ctx = new AudioCtx();
          this._masterGain = this._ctx.createGain();
          this._bgmGain = this._ctx.createGain();
          this._sfxGain = this._ctx.createGain();

          this._masterGain.gain.value = this._masterVolume;
          this._bgmGain.gain.value = this._bgmEnabled ? 1.0 : 0.0;
          this._sfxGain.gain.value = this._sfxEnabled ? 1.0 : 0.0;

          this._bgmGain.connect(this._masterGain);
          this._sfxGain.connect(this._masterGain);
          this._masterGain.connect(this._ctx.destination);
        } catch (_) {
          this._ctx = null;
          return null;
        }
      }

      if (this._ctx.state === 'suspended') {
        this._ctx.resume().catch(() => {});
      }

      this._activateSinkBridge();
      this._syncBgmPlayback();
      return this._ctx;
    }

    async _activateSinkBridge() {
      if (!this._ctx || !this._masterGain) return;
      if (
        !this._sinkAudioEl ||
        typeof this._sinkAudioEl.setSinkId !== 'function' ||
        typeof this._ctx.createMediaStreamDestination !== 'function'
      ) {
        return;
      }

      if (this._usingStreamBridge) {
        if (this._sinkAudioEl.paused) {
          this._sinkAudioEl.play().catch(() => {});
        }
        return;
      }

      if (this._bridgeStarting) return;
      this._bridgeStarting = true;

      try {
        if (!this._streamDest) {
          this._streamDest = this._ctx.createMediaStreamDestination();
        }
        if (this._sinkAudioEl.srcObject !== this._streamDest.stream) {
          this._sinkAudioEl.srcObject = this._streamDest.stream;
        }
        if (this._sinkId) {
          try {
            await this._sinkAudioEl.setSinkId(this._sinkId);
          } catch (_) {
            this._sinkId = '';
          }
        }
        await this._sinkAudioEl.play();

        if (!this._usingStreamBridge) {
          try {
            this._masterGain.disconnect(this._ctx.destination);
          } catch (_) {
            // Ignore if already disconnected
          }
          this._masterGain.connect(this._streamDest);
          this._usingStreamBridge = true;
        }
      } catch (_) {
        // Autoplay not yet unlocked; stays connected to ctx.destination until next user gesture
      } finally {
        this._bridgeStarting = false;
      }
    }

    _startBgmDrone() {
      if (this._bgmDroneStarted || !this._ctx || !this._bgmGain) return;
      this._bgmDroneStarted = true;

      const ctx = this._ctx;
      const now = ctx.currentTime;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, now);
      filter.Q.setValueAtTime(1.4, now);

      const droneGain = ctx.createGain();
      droneGain.gain.setValueAtTime(0.052, now);

      const oscSub = ctx.createOscillator();
      oscSub.type = 'triangle';
      oscSub.frequency.setValueAtTime(55.0, now); // A1

      const oscFifth = ctx.createOscillator();
      oscFifth.type = 'sine';
      oscFifth.frequency.setValueAtTime(82.41, now); // E2
      oscFifth.detune.setValueAtTime(4, now);

      // Slow breathing LFO on filter cutoff
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.11, now);
      lfoGain.gain.setValueAtTime(75, now);

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      oscSub.connect(filter);
      oscFifth.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(this._bgmGain);

      oscSub.start(now);
      oscFifth.start(now);
      lfo.start(now);
    }

    _triggerBgmChordPulse() {
      if (!this._ctx || !this._bgmGain || !this._bgmEnabled || this._masterVolume <= 0.001) return;
      if (this._ctx.state !== 'running') return;

      const chords = [
        [220.0, 261.63, 329.63],   // Am
        [174.61, 220.0, 261.63],   // Fmaj7
        [146.83, 220.0, 329.63],   // Dm9
        [164.81, 246.94, 293.66]   // Em7
      ];
      const chord = chords[this._bgmStep % chords.length];
      this._bgmStep += 1;

      const now = this._ctx.currentTime;
      const filter = this._ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(640, now);
      filter.connect(this._bgmGain);

      chord.forEach((freq, idx) => {
        const osc = this._ctx.createOscillator();
        const gain = this._ctx.createGain();
        const t0 = now + idx * 0.14;

        osc.type = idx === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, t0);

        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.linearRampToValueAtTime(0.022, t0 + 0.85);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 3.0);

        osc.connect(gain);
        gain.connect(filter);
        osc.start(t0);
        osc.stop(t0 + 3.1);
      });
    }

    _syncBgmPlayback() {
      if (!this._ctx || !this._bgmGain) return;
      const now = this._ctx.currentTime;
      const shouldPlay = this._bgmEnabled && this._masterVolume > 0.001;

      this._bgmGain.gain.cancelScheduledValues(now);
      this._bgmGain.gain.setTargetAtTime(this._bgmEnabled ? 1.0 : 0.0, now, 0.08);

      if (shouldPlay) {
        this._startBgmDrone();
        if (this._bgmInterval === null) {
          this._triggerBgmChordPulse();
          this._bgmInterval = global.setInterval(() => {
            this._triggerBgmChordPulse();
          }, 3400);
        }
      } else if (this._bgmInterval !== null) {
        global.clearInterval(this._bgmInterval);
        this._bgmInterval = null;
      }
    }

    /**
     * Synthesized terminal blip during typewriter reveal
     */
    playTypeBlip(charIndex = 0) {
      if (!this._sfxEnabled || this._masterVolume <= 0.001) return;
      const ctx = this._ensureContext();
      if (!ctx || !this._sfxGain) return;

      const now = ctx.currentTime;
      if (now - this._lastBlipTime < 0.036) return;
      this._lastBlipTime = now;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const baseFreq = 690 + (charIndex % 5) * 28;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.12, now + 0.026);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.045, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.032);

      osc.connect(gain);
      gain.connect(this._sfxGain);
      osc.start(now);
      osc.stop(now + 0.035);
    }

    /**
     * Subtle cursor tick when navigating verdict plates via Arrows
     */
    playHoverTick() {
      if (!this._sfxEnabled || this._masterVolume <= 0.001) return;
      const ctx = this._ensureContext();
      if (!ctx || !this._sfxGain) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1180, now);
      osc.frequency.exponentialRampToValueAtTime(760, now + 0.025);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.028);

      osc.connect(gain);
      gain.connect(this._sfxGain);
      osc.start(now);
      osc.stop(now + 0.03);
    }

    /**
     * Tactile electromagnetic relay click on choice selection
     */
    playRelayClick() {
      if (!this._sfxEnabled || this._masterVolume <= 0.001) return;
      const ctx = this._ensureContext();
      if (!ctx || !this._sfxGain) return;
      const now = ctx.currentTime;

      // Transient noise burst for mechanical latch feel
      const bufferSize = Math.floor(ctx.sampleRate * 0.035);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1850, now);
      filter.Q.setValueAtTime(2.4, now);

      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.16, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.034);

      noise.connect(filter);
      filter.connect(nGain);
      nGain.connect(this._sfxGain);
      noise.start(now);

      // Solenoid body thump
      const osc = ctx.createOscillator();
      const oGain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(78, now + 0.045);

      oGain.gain.setValueAtTime(0.075, now);
      oGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.048);

      osc.connect(oGain);
      oGain.connect(this._sfxGain);
      osc.start(now);
      osc.stop(now + 0.05);
    }

    /**
     * Low ominous Crisis Timer pulse (intensifies in last 5 seconds)
     */
    playTimerPulse(isCritical = false) {
      if (!this._sfxEnabled || this._masterVolume <= 0.001) return;
      const ctx = this._ensureContext();
      if (!ctx || !this._sfxGain) return;
      const now = ctx.currentTime;

      const triggerBeat = (offset, startHz, peakGain) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = isCritical ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(startHz, now + offset);
        osc.frequency.exponentialRampToValueAtTime(36, now + offset + 0.19);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(isCritical ? 320 : 160, now + offset);

        gain.gain.setValueAtTime(0.0001, now + offset);
        gain.gain.linearRampToValueAtTime(peakGain, now + offset + 0.018);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.21);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this._sfxGain);
        osc.start(now + offset);
        osc.stop(now + offset + 0.22);
      };

      triggerBeat(0, isCritical ? 88 : 66, isCritical ? 0.14 : 0.09);
      if (isCritical) {
        triggerBeat(0.16, 104, 0.11);
      }
    }

    /**
     * Breakthrough harmonic chord sweep on accurate profiling
     */
    playBreakthrough() {
      if (!this._sfxEnabled || this._masterVolume <= 0.001) return;
      const ctx = this._ensureContext();
      if (!ctx || !this._sfxGain) return;
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t0 = now + idx * 0.035;

        osc.type = idx % 2 === 0 ? 'triangle' : 'sawtooth';
        osc.frequency.setValueAtTime(freq * 0.98, t0);
        osc.frequency.exponentialRampToValueAtTime(freq, t0 + 0.05);

        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.linearRampToValueAtTime(0.065, t0 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.48);

        osc.connect(gain);
        gain.connect(this._sfxGain);
        osc.start(t0);
        osc.stop(t0 + 0.5);
      });
    }

    /**
     * Dissonant shock sound on wrong answer or Will Stupor timeout
     */
    playErrorShock() {
      if (!this._sfxEnabled || this._masterVolume <= 0.001) return;
      const ctx = this._ensureContext();
      if (!ctx || !this._sfxGain) return;
      const now = ctx.currentTime;

      [98, 138.59].forEach((freq) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.linearRampToValueAtTime(freq * 0.68, now + 0.34);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(520, now);

        gain.gain.setValueAtTime(0.11, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this._sfxGain);
        osc.start(now);
        osc.stop(now + 0.38);
      });
    }
  }

  /**
   * Main Psycho-Profile Game Engine & State Machine
   */
  class PsychoEngine {
    constructor() {
      this._state = FSM_STATES.LOADING;
      this._listeners = new Map();
      this._db = null;
      this._schemaReport = null;

      this.audio = new ProceduralAudioSynth();
      this.i18n = global.PsychoI18n;
      this.achievements = global.PsychoAchievements;

      // Persistent Player Profile
      this._profile = {
        lang: 'ru',
        difficulty: 'scout', // 'scout' | 'mindhunter'
        masterVolume: 0.8,
        bgmEnabled: true,
        sfxEnabled: true,
        audioSinkId: '',
        screenShakeEnabled: true,
        crtEnabled: true,
        scoutUnlimitedTimer: false,
        solvedScenarioIds: [],
        highScore: 0
      };

      // Session Runtime Telemetry
      this._currentScenarioIndex = 0;
      this._currentDialogueIndex = 0;
      this._selectedOptionIndex = 0;
      this._isPaused = false;
      this._hintRevealed = false;

      // Score & Accuracy Tracking
      this._sessionScore = 0;
      this._totalAttempts = 0;
      this._correctAttempts = 0;

      // Crisis Timer Runtime
      this._timerDurationSec = 60;
      this._timerRemainingSec = 60;
      this._timerActive = false;
      this._timerUnlimited = false;
      this._rafId = null;
      this._lastFrameTs = 0;
      this._lastPulseWholeSec = -1;

      // Last Verdict Payload for VERDICT_ANIM & SUMMARY_READ
      this._lastVerdictResult = null;
    }

    get STATES() {
      return FSM_STATES;
    }

    getState() {
      return this._state;
    }

    getProfile() {
      return Object.assign({}, this._profile);
    }

    getSchemaReport() {
      return this._schemaReport;
    }

    validateScenarioBlock(block) {
      return ScenariosSchemaValidator.validateScenarioBlock(block, SCENARIOS_SCHEMA.requiredLocales, 0);
    }

    on(event, handler) {
      if (!this._listeners.has(event)) {
        this._listeners.set(event, new Set());
      }
      this._listeners.get(event).add(handler);
      return () => this._listeners.get(event).delete(handler);
    }

    _emit(event, detail) {
      const set = this._listeners.get(event);
      if (set) {
        set.forEach((fn) => {
          try {
            fn(detail);
          } catch (err) {
            console.error(`[PsychoEngine] Event listener error on "${event}":`, err);
          }
        });
      }
    }

    _loadProfile() {
      try {
        const raw = global.localStorage ? global.localStorage.getItem(PROFILE_STORAGE_KEY) : null;
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            if (typeof parsed.lang === 'string') this._profile.lang = parsed.lang;
            if (parsed.difficulty === 'scout' || parsed.difficulty === 'mindhunter') {
              this._profile.difficulty = parsed.difficulty;
            }
            if (typeof parsed.audioEnabled === 'boolean' && parsed.bgmEnabled === undefined) {
              this._profile.bgmEnabled = parsed.audioEnabled;
              this._profile.sfxEnabled = parsed.audioEnabled;
            }
            if (typeof parsed.masterVolume === 'number' && Number.isFinite(parsed.masterVolume)) {
              this._profile.masterVolume = Math.max(0, Math.min(1, parsed.masterVolume));
            }
            if (typeof parsed.bgmEnabled === 'boolean') this._profile.bgmEnabled = parsed.bgmEnabled;
            if (typeof parsed.sfxEnabled === 'boolean') this._profile.sfxEnabled = parsed.sfxEnabled;
            if (typeof parsed.audioSinkId === 'string') this._profile.audioSinkId = parsed.audioSinkId;
            if (typeof parsed.screenShakeEnabled === 'boolean') {
              this._profile.screenShakeEnabled = parsed.screenShakeEnabled;
            }
            if (typeof parsed.crtEnabled === 'boolean') this._profile.crtEnabled = parsed.crtEnabled;
            if (Array.isArray(parsed.solvedScenarioIds)) {
              this._profile.solvedScenarioIds = parsed.solvedScenarioIds;
            }
            if (typeof parsed.highScore === 'number') this._profile.highScore = parsed.highScore;
          }
        }
      } catch (_) {
        // Ignore storage read errors
      }

      this.i18n.setLang(this._profile.lang);
      this.audio.setMasterVolume(this._profile.masterVolume);
      this.audio.setBgmEnabled(this._profile.bgmEnabled);
      this.audio.setSfxEnabled(this._profile.sfxEnabled);
      if (this._profile.audioSinkId) {
        this.audio.setSinkId(this._profile.audioSinkId).catch(() => {});
      }
      this._emit('languageChanged', { lang: this.i18n.getLang() });
      this._emit('profileUpdated', this.getProfile());
    }

    _saveProfile() {
      try {
        if (global.localStorage) {
          global.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(this._profile));
        }
      } catch (_) {
        // Ignore storage write errors
      }
    }

    /**
     * Strict FSM transition enforcement
     */
    _transitionTo(nextState, payload = {}) {
      const prevState = this._state;
      if (prevState === nextState) {
        this._emit('stateChange', { prevState, state: nextState, payload });
        return true;
      }

      const allowed = VALID_TRANSITIONS[prevState] || [];
      if (!allowed.includes(nextState)) {
        console.error(`[FSM Violation] Illegal transition attempted: ${prevState} -> ${nextState}`);
        return false;
      }

      if (nextState !== FSM_STATES.DIALOGUE_TYPE && nextState !== FSM_STATES.CHOICE_IDLE) {
        this._stopCrisisTimer();
      }

      this._state = nextState;

      // In Scout (Cadet) mode, trigger timer loop countdown ONLY upon reaching CHOICE_IDLE
      if (nextState === FSM_STATES.CHOICE_IDLE) {
        if (this._profile.difficulty === 'scout' && !this._timerActive && !this._timerUnlimited) {
          this._startCrisisTimerLoop();
        }
      }

      this._emit('stateChange', { prevState, state: nextState, payload });
      return true;
    }

    /**
     * Boot engine: load profile, fetch scenarios.json, validate JSON Schema, enter MENU_IDLE
     */
    async boot(scenariosUrl = 'assets/data/scenarios.json') {
      this._loadProfile();
      this._emit('bootProgress', { status: this.i18n.t('loading_status') });

      const response = await fetch(scenariosUrl, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Failed to load ${scenariosUrl}: HTTP ${response.status}`);
      }

      const data = await response.json();
      const validation = ScenariosSchemaValidator.validateDatabase(data);
      this._schemaReport = validation;

      if (!validation.valid) {
        console.error('[SchemaValidator] scenarios.json failed validation:', validation.errors);
        throw new Error(`Schema validation failed:\n${validation.errors.join('\n')}`);
      }

      console.log(
        `[SchemaValidator] OK — Validated ${validation.scenarioCount} scenario(s) against ${validation.schemaId}`
      );

      this._db = data;
      this._transitionTo(FSM_STATES.MENU_IDLE);
      return validation;
    }

    setDifficulty(mode) {
      if (mode !== 'scout' && mode !== 'mindhunter') return;
      this._profile.difficulty = mode;
      this._saveProfile();
      this._emit('profileUpdated', this.getProfile());
    }

    setLanguage(langCode) {
      if (this.i18n.setLang(langCode)) {
        this._profile.lang = langCode;
        this._saveProfile();
        this._emit('languageChanged', { lang: langCode });
      }
    }

    setMasterVolume(vol) {
      const clamped = Math.max(0, Math.min(1, Number.isFinite(Number(vol)) ? Number(vol) : 0.8));
      this._profile.masterVolume = clamped;
      this.audio.setMasterVolume(clamped);
      this._saveProfile();
      this._emit('profileUpdated', this.getProfile());
    }

    setBgmEnabled(enabled) {
      this._profile.bgmEnabled = Boolean(enabled);
      this.audio.setBgmEnabled(this._profile.bgmEnabled);
      this._saveProfile();
      this._emit('profileUpdated', this.getProfile());
    }

    setSfxEnabled(enabled) {
      this._profile.sfxEnabled = Boolean(enabled);
      this.audio.setSfxEnabled(this._profile.sfxEnabled);
      this._saveProfile();
      this._emit('profileUpdated', this.getProfile());
    }

    async setAudioSinkId(sinkId) {
      const applied = await this.audio.setSinkId(sinkId);
      this._profile.audioSinkId = applied;
      this._saveProfile();
      this._emit('profileUpdated', this.getProfile());
      return applied;
    }

    setScreenShakeEnabled(enabled) {
      this._profile.screenShakeEnabled = Boolean(enabled);
      this._saveProfile();
      this._emit('profileUpdated', this.getProfile());
    }

    setCrtEnabled(enabled) {
      this._profile.crtEnabled = Boolean(enabled);
      this._saveProfile();
      this._emit('profileUpdated', this.getProfile());
    }

    setAudioEnabled(enabled) {
      const val = Boolean(enabled);
      this._profile.bgmEnabled = val;
      this._profile.sfxEnabled = val;
      this.audio.setEnabled(val);
      this._saveProfile();
      this._emit('profileUpdated', this.getProfile());
    }

    setScoutUnlimitedTimer(unlimited) {
      this._profile.scoutUnlimitedTimer = Boolean(unlimited);
      this._saveProfile();
      this._emit('profileUpdated', this.getProfile());
    }

    setPaused(paused) {
      this._isPaused = Boolean(paused);
      if (!this._isPaused) {
        this._lastFrameTs = performance.now();
      }
      this._emit('pauseChanged', { paused: this._isPaused });
    }

    isPaused() {
      return this._isPaused;
    }

    /**
     * Enter Optional Typology Tutorial Terminal (`TUTORIAL_READ`)
     */
    openTutorial() {
      if (this._state !== FSM_STATES.MENU_IDLE) return false;
      this.audio.playRelayClick();
      return this._transitionTo(FSM_STATES.TUTORIAL_READ);
    }

    /**
     * Return to Main Menu (`MENU_IDLE`) from any allowed state
     */
    returnToMenu() {
      this._stopCrisisTimer();
      this._isPaused = false;
      this.audio.playRelayClick();
      return this._transitionTo(FSM_STATES.MENU_IDLE);
    }

    /**
     * Start Investigation on Scenario index (defaults to 0 = Kaiji on the steel beam)
     */
    startScenario(scenarioIndex = 0) {
      if (!this._db || !this._db.scenarios[scenarioIndex]) return false;

      const sc = this._db.scenarios[scenarioIndex];
      this._currentScenarioIndex = scenarioIndex;
      this._currentDialogueIndex = 0;
      this._selectedOptionIndex = 0;
      this._hintRevealed = false;
      this._lastVerdictResult = null;
      this._isPaused = false;

      this.audio.playRelayClick();
      this._prepareCrisisTimer(sc);

      const ok = this._transitionTo(FSM_STATES.DIALOGUE_TYPE, {
        scenario: sc,
        dialogueIndex: 0
      });

      if (ok) {
        if (this._profile.difficulty === 'mindhunter') {
          this._startCrisisTimerLoop();
        } else {
          // Scout (Cadet) Mode: Freeze timer at 60.0s during dialogue cards (01, 02, 03)
          this._stopCrisisTimer();
          this._emit('timerTick', {
            remaining: this._timerRemainingSec,
            duration: this._timerDurationSec,
            ratio: 1,
            isCritical: false,
            isFrozen: true
          });
        }
        this._emitDialogueLine();
      }
      return ok;
    }

    retryCurrentScenario() {
      return this.startScenario(this._currentScenarioIndex);
    }

    hasNextScenario() {
      return Boolean(this._db && this._currentScenarioIndex + 1 < this._db.scenarios.length);
    }

    startNextScenario() {
      if (this.hasNextScenario()) {
        return this.startScenario(this._currentScenarioIndex + 1);
      }
      return false;
    }

    getCurrentScenario() {
      if (!this._db) return null;
      return this._db.scenarios[this._currentScenarioIndex] || null;
    }

    getMenuBackground() {
      if (this._db && typeof this._db.menu_background === 'string' && this._db.menu_background.trim()) {
        return this._db.menu_background.trim();
      }
      return 'assets/media/backgrounds/case_00.png';
    }

    getCurrentDialogueLine() {
      const sc = this.getCurrentScenario();
      if (!sc) return null;
      return sc.dialogue[this._currentDialogueIndex] || null;
    }

    getDifficultyConfig() {
      const mode = this._profile.difficulty;
      const modes = (this._db && this._db.difficulty_modes) || {};
      return modes[mode] || {
        id: mode,
        override_time_limit_sec: mode === 'scout' ? 60 : 30,
        show_axes_on_options: mode === 'scout',
        allow_evidence_hint: mode === 'scout',
        score_multiplier: mode === 'mindhunter' ? 1.5 : 1.0
      };
    }

    getTelemetry() {
      const sc = this.getCurrentScenario();
      const accuracy =
        this._totalAttempts === 0 ? 100 : Math.round((this._correctAttempts / this._totalAttempts) * 100);
      const isCadetFrozen = this._profile.difficulty === 'scout' && this._state === FSM_STATES.DIALOGUE_TYPE;
      return {
        caseTitle: sc ? this.i18n.localizeField(sc.case_title) : '—',
        caseNumber: sc ? this.i18n.localizeField(sc.case_number) : '—',
        characterName: sc ? this.i18n.localizeField(sc.character_name) : '—',
        accuracy,
        score: this._sessionScore,
        difficulty: this._profile.difficulty,
        isCadetFrozen,
        timerRemainingSec: this._timerRemainingSec,
        timerDurationSec: this._timerDurationSec,
        timerUnlimited: this._timerUnlimited,
        timerActive: this._timerActive
      };
    }

    /**
     * Collect all asset paths (backgrounds, sprites, cards) for preloading
     */
    collectScenarioAssetPaths(scenario) {
      if (!scenario) return [];
      const paths = new Set();
      if (scenario.background) paths.add(scenario.background);
      if (scenario.background_image) paths.add(scenario.background_image);
      if (scenario.sprite) paths.add(scenario.sprite);
      if (scenario.sprite_image) paths.add(scenario.sprite_image);
      if (Array.isArray(scenario.dialogue_cards)) {
        scenario.dialogue_cards.forEach((c) => {
          if (c.background) paths.add(c.background);
          if (c.background_image) paths.add(c.background_image);
          if (c.sprite) paths.add(c.sprite);
          if (c.sprite_image) paths.add(c.sprite_image);
        });
      }
      if (Array.isArray(scenario.dialogue)) {
        scenario.dialogue.forEach((d) => {
          if (d.background) paths.add(d.background);
          if (d.background_image) paths.add(d.background_image);
          if (d.sprite) paths.add(d.sprite);
          if (d.sprite_image) paths.add(d.sprite_image);
        });
      }
      return Array.from(paths).filter(Boolean);
    }

    _emitDialogueLine() {
      const sc = this.getCurrentScenario();
      const line = this.getCurrentDialogueLine();
      if (!sc || !line) return;

      this._emit('dialogueLine', {
        scenario: sc,
        line,
        index: this._currentDialogueIndex,
        total: sc.dialogue.length,
        isLast: this._currentDialogueIndex === sc.dialogue.length - 1
      });
    }

    /**
     * Advance to next dialogue line or transition `DIALOGUE_TYPE -> CHOICE_IDLE`
     * without resetting the continuous case timer.
     */
    advanceDialogue() {
      if (this._state !== FSM_STATES.DIALOGUE_TYPE || this._isPaused) return false;
      const sc = this.getCurrentScenario();
      if (!sc) return false;

      if (this._currentDialogueIndex + 1 < sc.dialogue.length) {
        this._currentDialogueIndex += 1;
        this.audio.playHoverTick();
        this._emitDialogueLine();
        return true;
      }

      // Final line completed -> Enter CHOICE_IDLE while keeping the continuous timer running
      this._selectedOptionIndex = 0;
      this._hintRevealed = false;
      this.audio.playHoverTick();
      this._transitionTo(FSM_STATES.CHOICE_IDLE, {
        scenario: sc,
        selectedOptionIndex: this._selectedOptionIndex
      });
      return true;
    }

    _prepareCrisisTimer(scenario) {
      this._stopCrisisTimer();
      const diffCfg = this.getDifficultyConfig();

      if (this._profile.difficulty === 'scout' && this._profile.scoutUnlimitedTimer) {
        this._timerUnlimited = true;
        this._timerDurationSec = 60;
        this._timerRemainingSec = 60;
        this._timerActive = false;
        return;
      }

      this._timerUnlimited = false;
      const limit =
        typeof diffCfg.override_time_limit_sec === 'number'
          ? diffCfg.override_time_limit_sec
          : scenario.time_limit_sec;

      this._timerDurationSec = limit;
      this._timerRemainingSec = limit;
      this._lastPulseWholeSec = Math.ceil(limit);
    }

    _startCrisisTimerLoop() {
      if (this._timerUnlimited) return;

      this._stopCrisisTimer();
      this._timerActive = true;
      this._lastFrameTs = performance.now();

      this._emit('timerTick', {
        remaining: this._timerRemainingSec,
        duration: this._timerDurationSec,
        ratio: this._timerDurationSec > 0 ? this._timerRemainingSec / this._timerDurationSec : 1,
        isCritical: this._timerRemainingSec <= 5
      });

      const tick = () => {
        if (
          !this._timerActive ||
          (this._state !== FSM_STATES.DIALOGUE_TYPE && this._state !== FSM_STATES.CHOICE_IDLE)
        ) {
          this._stopCrisisTimer();
          return;
        }

        const now = performance.now();
        if (!this._isPaused) {
          const dt = Math.min(0.25, Math.max(0, (now - this._lastFrameTs) / 1000));
          this._timerRemainingSec = Math.max(0, this._timerRemainingSec - dt);

          const wholeSec = Math.ceil(this._timerRemainingSec);
          if (wholeSec < this._lastPulseWholeSec && wholeSec > 0) {
            this._lastPulseWholeSec = wholeSec;
            this.audio.playTimerPulse(wholeSec <= 5);
          }

          this._emit('timerTick', {
            remaining: this._timerRemainingSec,
            duration: this._timerDurationSec,
            ratio: this._timerDurationSec > 0 ? this._timerRemainingSec / this._timerDurationSec : 0,
            isCritical: this._timerRemainingSec <= 5
          });

          if (this._timerRemainingSec <= 0) {
            this._lastFrameTs = now;
            this._handleCrisisTimeout();
            return;
          }
        }

        this._lastFrameTs = now;
      };

      this._rafId = global.setInterval(tick, 33);
    }

    _stopCrisisTimer() {
      this._timerActive = false;
      if (this._rafId !== null) {
        global.clearInterval(this._rafId);
        this._rafId = null;
      }
    }

    /**
     * Navigate verdict option cursor (`CHOICE_IDLE`)
     */
    moveChoiceCursor(delta) {
      if (this._state !== FSM_STATES.CHOICE_IDLE || this._isPaused) return;
      const sc = this.getCurrentScenario();
      if (!sc) return;

      const count = sc.options.length;
      this._selectedOptionIndex = (this._selectedOptionIndex + delta + count) % count;
      this.audio.playHoverTick();
      this._emit('choiceCursorChanged', { index: this._selectedOptionIndex });
    }

    setChoiceCursor(index) {
      if (this._state !== FSM_STATES.CHOICE_IDLE || this._isPaused) return;
      const sc = this.getCurrentScenario();
      if (!sc || index < 0 || index >= sc.options.length) return;
      if (this._selectedOptionIndex !== index) {
        this._selectedOptionIndex = index;
        this.audio.playHoverTick();
        this._emit('choiceCursorChanged', { index: this._selectedOptionIndex });
      }
    }

    getSelectedOptionIndex() {
      return this._selectedOptionIndex;
    }

    /**
     * Toggle Evidence Clue Drawer in Scout Mode (`CHOICE_IDLE`)
     */
    toggleEvidenceHint() {
      if (this._state !== FSM_STATES.CHOICE_IDLE || this._isPaused) return false;
      const diffCfg = this.getDifficultyConfig();
      if (!diffCfg.allow_evidence_hint) return false;

      this._hintRevealed = !this._hintRevealed;
      this.audio.playHoverTick();
      this._emit('hintToggled', { revealed: this._hintRevealed });
      return this._hintRevealed;
    }

    isHintRevealed() {
      return this._hintRevealed;
    }

    /**
     * Submit Verdict Selection (`CHOICE_IDLE -> VERDICT_ANIM`)
     */
    submitVerdict(optionIndex = this._selectedOptionIndex) {
      if (this._state !== FSM_STATES.CHOICE_IDLE || this._isPaused) return null;
      const sc = this.getCurrentScenario();
      if (!sc || !sc.options[optionIndex]) return null;

      this._stopCrisisTimer();
      this.audio.playRelayClick();

      const chosen = sc.options[optionIndex];
      const correctOption = sc.options.find((o) => o.is_correct);
      const isCorrect = Boolean(chosen.is_correct);
      const diffCfg = this.getDifficultyConfig();

      this._totalAttempts += 1;
      let pointsEarned = 0;

      if (isCorrect) {
        this._correctAttempts += 1;
        const timeBonus = this._timerUnlimited ? 250 : Math.round(this._timerRemainingSec * 45);
        pointsEarned = Math.round((1000 + timeBonus) * (diffCfg.score_multiplier || 1));
        this._sessionScore += pointsEarned;

        if (this._sessionScore > this._profile.highScore) {
          this._profile.highScore = this._sessionScore;
        }
        if (!this._profile.solvedScenarioIds.includes(sc.id)) {
          this._profile.solvedScenarioIds.push(sc.id);
        }
        this._saveProfile();

        this.audio.playBreakthrough();
        this.achievements.unlockAchievement('FIRST_BREAKTHROUGH');
        if (this._profile.difficulty === 'mindhunter') {
          this.achievements.unlockAchievement('MINDHUNTER_MASTERY');
        }
        if (this._db && this._profile.solvedScenarioIds.length >= this._db.scenarios.length) {
          this.achievements.unlockAchievement('FULL_DOSSIER_CLEAR');
        }
      } else {
        this.audio.playErrorShock();
      }

      this._lastVerdictResult = {
        outcome: isCorrect ? 'win' : 'lose',
        isCorrect,
        isTimeout: false,
        scenario: sc,
        chosenOption: chosen,
        correctOption,
        pointsEarned,
        remainingTimeSec: this._timerUnlimited ? null : Number(this._timerRemainingSec.toFixed(1))
      };

      this._transitionTo(FSM_STATES.VERDICT_ANIM, this._lastVerdictResult);
      return this._lastVerdictResult;
    }

    /**
     * Handle Crisis Timer Expiration ("Ступор Воли") (`CHOICE_IDLE -> VERDICT_ANIM`)
     */
    _handleCrisisTimeout() {
      this._stopCrisisTimer();
      const sc = this.getCurrentScenario();
      if (!sc) return;

      const correctOption = sc.options.find((o) => o.is_correct);
      this._totalAttempts += 1;

      this.audio.playErrorShock();
      this.achievements.unlockAchievement('WILL_STUPOR');

      this._lastVerdictResult = {
        outcome: 'timeout',
        isCorrect: false,
        isTimeout: true,
        scenario: sc,
        chosenOption: null,
        correctOption,
        timeoutData: sc.timeout_verdict,
        pointsEarned: 0,
        remainingTimeSec: 0
      };

      this._transitionTo(FSM_STATES.VERDICT_ANIM, this._lastVerdictResult);
    }

    getLastVerdictResult() {
      return this._lastVerdictResult;
    }

    /**
     * Advance from Psychological Autopsy Modal (`VERDICT_ANIM`) to Case Summary (`SUMMARY_READ`)
     */
    proceedToSummary() {
      if (this._state !== FSM_STATES.VERDICT_ANIM) return false;
      this.audio.playRelayClick();
      return this._transitionTo(FSM_STATES.SUMMARY_READ, {
        verdict: this._lastVerdictResult,
        telemetry: this.getTelemetry()
      });
    }
  }

  global.PsychoEngine = new PsychoEngine();
})(window);
