/**
 * PSYCHO-PROFILE // ANALYZER
 * Presentation Layer, 16:9 HiDPI Letterboxing, Hybrid Controls & ADV Stage Director (ui.js)
 */
(function (global) {
  'use strict';

  const BASE_WIDTH = 1920;
  const BASE_HEIGHT = 1080;

  class PsychoUIController {
    constructor(engine, i18n) {
      this.engine = engine;
      this.i18n = i18n;

      // Typewriter state
      this._twTimer = null;
      this._twFullText = '';
      this._twIndex = 0;
      this._twIsTyping = false;

      // Active sprite & background tracking with async race protection
      this._currentScenarioId = null;
      this._currentEmotionKey = null;
      this._currentBgPath = null;
      this._currentSpritePath = null;
      this._sceneRenderToken = 0;
      this._mediaAvailabilityCache = new Map();

      // Tutorial active tab & simulator state
      this._activeTutorialTab = 'aspects';
      this._simSelectedCode = null;

      // Overlay flags
      this._settingsOpen = false;

      this.els = {};
    }

    init() {
      this._bindOverlayProtection();
      this._cacheElements();
      this.engine.audio.attachSinkElement(this.els.audioSinkBridge);
      this._bindAudioUnlockAndDeviceWatcher();
      this._initViewportScaler();
      this._bindUIEvents();
      this._bindKeyboardControls();
      this._bindEngineEvents();
      this._bindAchievementToast();

      this.applyStaticTranslations();
      this.renderLanguageSelectors();
      this._applyVisualSettings();
      this.renderSettingsState();
      this._refreshAudioOutputDevices();

      this.engine.boot('assets/data/scenarios.json').catch((err) => {
        console.error('[Boot Error]:', err);
        if (this.els.bootStatus) {
          this.els.bootStatus.textContent = `CRITICAL SCHEMA / LOAD ERROR: ${err.message}`;
          this.els.bootStatus.style.color = '#ff1744';
        }
      });
    }

    /**
     * Unlock Web Audio + HTMLAudioElement sink bridge on first user interaction,
     * and watch hardware audio device & fullscreen transitions.
     */
    _bindAudioUnlockAndDeviceWatcher() {
      const unlockHandler = () => {
        this.engine.audio.unlockAndSync();
      };
      global.addEventListener('pointerdown', unlockHandler, { passive: true });
      global.addEventListener('keydown', unlockHandler, { passive: true });

      const syncFullscreenUI = () => {
        this.renderSettingsState();
      };
      document.addEventListener('fullscreenchange', syncFullscreenUI);
      document.addEventListener('webkitfullscreenchange', syncFullscreenUI);

      if (navigator.mediaDevices && typeof navigator.mediaDevices.addEventListener === 'function') {
        navigator.mediaDevices.addEventListener('devicechange', () => {
          this._refreshAudioOutputDevices();
        });
      }
    }

    /**
     * Steam Overlay & Kiosk Protection: block default right-click menu & drag
     */
    _bindOverlayProtection() {
      global.addEventListener('contextmenu', (event) => {
        event.preventDefault();
      });
      global.addEventListener('dragstart', (event) => {
        event.preventDefault();
      });
    }

    _cacheElements() {
      const byId = (id) => document.getElementById(id);
      this.els = {
        stage: byId('game-stage'),
        cameraRig: byId('camera-rig'),
        bgImage: byId('bg-image'),
        dangerOverlay: byId('danger-pulse-overlay'),
        charRig: byId('char-camera-rig'),
        charSprite: byId('char-sprite'),

        hud: byId('layer-hud'),
        hudCaseLabel: byId('hud-case-label'),
        hudCaseVal: byId('hud-case-val'),
        hudModeBadge: byId('hud-mode-badge'),
        hudTimerModule: byId('hud-timer-module'),
        hudTimerDigits: byId('hud-timer-digits'),
        hudTimerFill: byId('hud-timer-fill'),
        hudAccuracyVal: byId('hud-accuracy-val'),
        hudScoreVal: byId('hud-score-val'),
        btnHudMenu: byId('btn-hud-menu'),

        dialogueLayer: byId('layer-dialogue'),
        dialoguePanel: byId('dialogue-panel'),
        dlgHintDrawer: byId('dlg-hint-drawer'),
        dlgHintContent: byId('dlg-hint-content'),
        dlgSpeaker: byId('dlg-speaker-badge'),
        dlgClimaxBadge: byId('dlg-climax-badge'),
        dlgStepCounter: byId('dlg-step-counter'),
        dlgText: byId('dlg-text'),
        btnDlgAdvance: byId('btn-dlg-advance'),

        verdictLayer: byId('layer-verdict-panel'),
        verdictSubtitle: byId('verdict-panel-subtitle'),
        verdictCrisisWrap: byId('verdict-crisis-bar-wrap'),
        verdictCrisisFill: byId('verdict-crisis-bar-fill'),
        verdictOptionsList: byId('verdict-options-list'),
        btnEvidenceHint: byId('btn-evidence-hint'),

        screenLoading: byId('screen-loading'),
        bootStatus: byId('boot-status-text'),

        screenMenu: byId('screen-menu'),
        menuBgImage: byId('menu-bg-image'),
        cardModeScout: byId('card-mode-scout'),
        cardModePro: byId('card-mode-mindhunter'),
        btnMenuStart: byId('btn-menu-start'),
        btnMenuTutorial: byId('btn-menu-tutorial'),
        btnMenuSettings: byId('btn-menu-settings'),
        btnMenuTerminate: byId('btn-menu-terminate'),
        screenShutdown: byId('screen-shutdown'),
        btnShutdownRestart: byId('btn-shutdown-restart'),

        screenTutorial: byId('screen-tutorial'),
        tutHeaderTitle: byId('tut-header-title'),
        btnTutBack: byId('btn-tut-back'),
        btnTutStartGame: byId('btn-tut-start-game'),
        tabBtnAspects: byId('tab-btn-aspects'),
        tabBtnPositions: byId('tab-btn-positions'),
        tabBtnSimulator: byId('tab-btn-simulator'),
        tutorialBody: byId('tutorial-body-content'),

        screenSummary: byId('screen-summary'),
        summaryHeadline: byId('summary-status-headline'),
        sumValCase: byId('sum-val-case'),
        sumValProfile: byId('sum-val-profile'),
        sumValScore: byId('sum-val-score'),
        sumValAccuracy: byId('sum-val-accuracy'),
        sumValTime: byId('sum-val-time'),
        sumExplanation: byId('sum-explanation-note'),
        btnSumNext: byId('btn-sum-next'),
        btnSumRetry: byId('btn-sum-retry'),
        btnSumMenu: byId('btn-sum-menu'),

        modalVerdict: byId('modal-verdict'),
        verdictRibbon: byId('verdict-outcome-ribbon'),
        verdictChosenVal: byId('verdict-chosen-val'),
        verdictCorrectVal: byId('verdict-correct-val'),
        verdictAxesTags: byId('verdict-axes-tags'),
        verdictBreakdownText: byId('verdict-breakdown-text'),
        btnVerdictContinue: byId('btn-verdict-continue'),

        modalSettings: byId('modal-settings'),
        btnCloseSettings: byId('btn-close-settings'),
        settingsLangButtons: byId('settings-lang-buttons'),
        settingsSpeedButtons: byId('settings-speed-buttons'),
        settingsMasterVol: byId('settings-master-volume'),
        settingsMasterVolVal: byId('settings-master-volume-val'),
        btnBgmToggle: byId('btn-bgm-toggle'),
        btnSfxToggle: byId('btn-sfx-toggle'),
        settingsAudioDevice: byId('settings-audio-device'),
        btnShakeToggle: byId('btn-shake-toggle'),
        btnCrtToggle: byId('btn-crt-toggle'),
        btnFullscreenToggle: byId('btn-fullscreen-toggle'),
        btnSettingsResume: byId('btn-settings-resume'),
        btnSettingsQuitMenu: byId('btn-settings-quit-menu'),

        stageCrtOverlay: byId('stage-crt-overlay'),
        audioSinkBridge: byId('audio-sink-bridge'),
        breakthroughFlash: byId('breakthrough-flash'),
        toastRack: byId('achievement-toast-rack')
      };
    }

    /**
     * 16:9 Fixed Virtual Resolution (1920x1080) Letterboxing Scaler
     * Supports 1080p, 1440p, 4K, 16:10 laptops, and Steam Deck (1280x800)
     */
    _initViewportScaler() {
      const recalc = () => {
        const vw = Math.max(1, global.innerWidth);
        const vh = Math.max(1, global.innerHeight);
        const scale = Math.min(vw / BASE_WIDTH, vh / BASE_HEIGHT);
        if (this.els.stage) {
          this.els.stage.style.setProperty('--stage-scale', scale.toFixed(5));
        }
      };

      global.addEventListener('resize', recalc);
      global.addEventListener('orientationchange', recalc);
      recalc();
    }

    /**
     * Convert inline SVG markup or local asset URL to crisp `<img>` source
     */
    _resolveAssetSrc(asset) {
      if (!asset) return '';
      const trimmed = asset.trim();
      if (trimmed.startsWith('<svg')) {
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(trimmed);
      }
      return trimmed;
    }

    /**
     * Non-throwing probe for physical raster assets (`.png` / `.webp` / `.jpg`).
     * Caches availability per session so missing files seamlessly fall back without errors.
     */
    _probeImageAsset(assetPath) {
      if (!assetPath || typeof assetPath !== 'string') {
        return Promise.resolve(false);
      }
      const trimmed = assetPath.trim();
      if (!trimmed || trimmed.startsWith('<svg') || trimmed.startsWith('data:')) {
        return Promise.resolve(true);
      }
      if (this._mediaAvailabilityCache.has(trimmed)) {
        return Promise.resolve(this._mediaAvailabilityCache.get(trimmed));
      }

      return new Promise((resolve) => {
        const probe = new Image();
        probe.onload = () => {
          const ok = probe.naturalWidth > 0;
          this._mediaAvailabilityCache.set(trimmed, ok);
          resolve(ok);
        };
        probe.onerror = () => {
          this._mediaAvailabilityCache.set(trimmed, false);
          resolve(false);
        };
        probe.src = trimmed;
      });
    }

    /**
     * Asynchronously preload and GPU-decode all image assets for a given scenario
     * to eliminate micro-stutters during dialogue progression.
     */
    async preloadCaseAssets(scenario) {
      if (!scenario) return;
      const paths = typeof this.engine.collectScenarioAssetPaths === 'function'
        ? this.engine.collectScenarioAssetPaths(scenario)
        : [];

      const preloadTasks = paths.map(async (rawPath) => {
        if (!rawPath || typeof rawPath !== 'string') return;
        const resolved = this._resolveAssetSrc(rawPath);
        if (resolved.startsWith('data:') || resolved.startsWith('<svg')) return;

        try {
          const img = new Image();
          img.src = resolved;
          if (typeof img.decode === 'function') {
            await img.decode();
          } else {
            await new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
            });
          }
          this._mediaAvailabilityCache.set(rawPath.trim(), true);
          this._mediaAvailabilityCache.set(resolved, true);
        } catch (_) {
          // Graceful fallback to regular probing
        }
      });

      await Promise.allSettled(preloadTasks);
    }

    _getTextSpeed() {
      try {
        const stored = global.localStorage ? global.localStorage.getItem('psycho_text_speed') : null;
        if (stored !== null && !isNaN(Number(stored))) {
          const num = Number(stored);
          if ([0, 10, 25, 50].includes(num)) return num;
        }
      } catch (_) {}
      return 25; // default 25ms/char
    }

    _setTextSpeed(speed) {
      try {
        if (global.localStorage) {
          global.localStorage.setItem('psycho_text_speed', String(speed));
        }
      } catch (_) {}
      this.renderSettingsState();
    }

    /**
     * Universal procedural vector SVG silhouette fallback if neither physical PNG nor `scenario.sprites` exists
     */
    _buildDefaultProceduralSilhouette(scenario, emotionKey) {
      const stroke = emotionKey === 'resolve' ? '#00e5ff' : '#ff1744';
      const badge = (scenario && this.i18n.localizeField(scenario.case_number)) || 'SUBJECT';
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='720' height='920' viewBox='0 0 720 920' shape-rendering='geometricPrecision'><defs><linearGradient id='defSil' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stop-color='#152642'/><stop offset='100%' stop-color='#060b16'/></linearGradient><filter id='defGlow'><feDropShadow dx='0' dy='0' stdDeviation='12' flood-color='${stroke}' flood-opacity='0.65'/></filter></defs><g filter='url(#defGlow)'><path d='M145 900 L205 525 L300 470 L360 510 L420 470 L515 525 L575 900 Z' fill='url(#defSil)' stroke='${stroke}' stroke-width='3.5'/><path d='M268 205 L452 205 L438 362 L360 442 L282 362 Z' fill='#0e1a2f' stroke='${stroke}' stroke-width='3.5'/><line x1='292' y1='282' x2='342' y2='282' stroke='${stroke}' stroke-width='4'/><line x1='378' y1='282' x2='428' y2='282' stroke='${stroke}' stroke-width='4'/><text x='360' y='660' text-anchor='middle' fill='${stroke}' font-family='Consolas, monospace' font-size='22' font-weight='bold'>${badge}</text></g></svg>`;
      return this._resolveAssetSrc(svg);
    }

    _getFallbackSilhouetteSrc(scenario, emotionKey) {
      if (scenario && scenario.sprites && typeof scenario.sprites === 'object') {
        const raw = scenario.sprites[emotionKey] || scenario.sprites.panic || Object.values(scenario.sprites)[0];
        if (raw) {
          return this._resolveAssetSrc(raw);
        }
      }
      return this._buildDefaultProceduralSilhouette(scenario, emotionKey);
    }

    _bindUIEvents() {
      // Main menu difficulty mode cards
      this.els.cardModeScout.addEventListener('click', () => {
        this.engine.audio.playRelayClick();
        this.engine.setDifficulty('scout');
      });
      this.els.cardModePro.addEventListener('click', () => {
        this.engine.audio.playRelayClick();
        this.engine.setDifficulty('mindhunter');
      });

      // Main menu primary actions
      this.els.btnMenuStart.addEventListener('click', () => {
        const sc = this.engine.getCurrentScenario();
        this.preloadCaseAssets(sc);
        this.engine.startScenario(0);
      });
      this.els.btnMenuTutorial.addEventListener('click', () => {
        this.engine.openTutorial();
      });
      this.els.btnMenuSettings.addEventListener('click', () => {
        this.engine.audio.playRelayClick();
        this.openSettingsModal();
      });
      if (this.els.btnMenuTerminate) {
        this.els.btnMenuTerminate.addEventListener('click', () => {
          this.engine.audio.playRelayClick();
          try {
            window.close();
          } catch (e) {
            // direct tab closure prevented by browser security policy
          }
          setTimeout(() => {
            this._showShutdownScreen();
          }, 80);
        });
      }
      if (this.els.btnShutdownRestart) {
        this.els.btnShutdownRestart.addEventListener('click', () => {
          this.engine.audio.playRelayClick();
          if (this.els.screenShutdown) {
            this.els.screenShutdown.classList.add('hidden');
          }
          if (this.els.screenMenu) {
            this.els.screenMenu.classList.remove('hidden');
          }
        });
      }

      // Tutorial actions & tabs
      this.els.btnTutBack.addEventListener('click', () => {
        this.engine.returnToMenu();
      });
      this.els.btnTutStartGame.addEventListener('click', () => {
        this.engine.startScenario(0);
      });

      [this.els.tabBtnAspects, this.els.tabBtnPositions, this.els.tabBtnSimulator].forEach((btn) => {
        btn.addEventListener('click', () => {
          this.engine.audio.playHoverTick();
          this._activeTutorialTab = btn.getAttribute('data-tut-tab') || 'aspects';
          this.renderTutorialScreen();
        });
      });

      // Dialogue box click -> skip typewriter or advance
      this.els.dialoguePanel.addEventListener('click', () => {
        if (this.engine.getState() === this.engine.STATES.DIALOGUE_TYPE) {
          this.handleDialogueAdvanceInput();
        }
      });

      // HUD menu button
      this.els.btnHudMenu.addEventListener('click', () => {
        this.toggleSettingsModal();
      });

      // Scout Mode Evidence Hint toggle
      this.els.btnEvidenceHint.addEventListener('click', () => {
        this.engine.toggleEvidenceHint();
      });

      // Verdict modal continue -> SUMMARY_READ
      this.els.btnVerdictContinue.addEventListener('click', () => {
        this.engine.proceedToSummary();
      });

      // Summary screen buttons
      this.els.btnSumNext.addEventListener('click', () => {
        this.engine.startNextScenario();
        this.preloadCaseAssets(this.engine.getCurrentScenario());
      });
      this.els.btnSumRetry.addEventListener('click', () => {
        this.preloadCaseAssets(this.engine.getCurrentScenario());
        this.engine.retryCurrentScenario();
      });
      this.els.btnSumMenu.addEventListener('click', () => {
        this.engine.returnToMenu();
      });

      // Settings modal controls
      this.els.btnCloseSettings.addEventListener('click', () => this.closeSettingsModal());
      this.els.btnSettingsResume.addEventListener('click', () => this.closeSettingsModal());
      this.els.modalSettings.addEventListener('click', (e) => {
        if (e.target === this.els.modalSettings) this.closeSettingsModal();
      });

      if (this.els.settingsSpeedButtons) {
        this.els.settingsSpeedButtons.addEventListener('click', (e) => {
          const btn = e.target.closest('[data-speed]');
          if (!btn) return;
          const speed = Number(btn.getAttribute('data-speed'));
          this.engine.audio.playRelayClick();
          this._setTextSpeed(speed);
        });
      }

      this.els.settingsMasterVol.addEventListener('input', () => {
        const pct = Math.max(0, Math.min(100, Number(this.els.settingsMasterVol.value) || 0));
        this.engine.audio.unlockAndSync();
        this.engine.setMasterVolume(pct / 100);
      });

      this.els.btnBgmToggle.addEventListener('click', () => {
        this.engine.audio.unlockAndSync();
        const next = !this.engine.getProfile().bgmEnabled;
        this.engine.setBgmEnabled(next);
        this.engine.audio.playRelayClick();
      });

      this.els.btnSfxToggle.addEventListener('click', () => {
        this.engine.audio.unlockAndSync();
        const next = !this.engine.getProfile().sfxEnabled;
        this.engine.setSfxEnabled(next);
        if (next) this.engine.audio.playRelayClick();
      });

      this.els.settingsAudioDevice.addEventListener('change', async () => {
        this.engine.audio.unlockAndSync();
        await this.engine.setAudioSinkId(this.els.settingsAudioDevice.value);
        this.engine.audio.playRelayClick();
      });

      this.els.btnShakeToggle.addEventListener('click', () => {
        const next = !this.engine.getProfile().screenShakeEnabled;
        this.engine.setScreenShakeEnabled(next);
        this.engine.audio.playRelayClick();
        if (next) {
          this.triggerScreenShake();
        }
      });

      this.els.btnCrtToggle.addEventListener('click', () => {
        const next = !this.engine.getProfile().crtEnabled;
        this.engine.setCrtEnabled(next);
        this.engine.audio.playRelayClick();
      });

      this.els.btnFullscreenToggle.addEventListener('click', () => {
        this.engine.audio.playRelayClick();
        this.toggleFullscreen();
      });

      this.els.btnSettingsQuitMenu.addEventListener('click', () => {
        this.closeSettingsModal();
        this.engine.returnToMenu();
      });
    }

    /**
     * Hybrid Controls for Steam Desktop & Steam Deck:
     * Space/Enter, ArrowUp/ArrowDown, Digits 1-4, KeyH Hint, ESC Pause
     */
    _bindKeyboardControls() {
      global.addEventListener('keydown', (event) => {
        const code = event.code;
        const state = this.engine.getState();
        const S = this.engine.STATES;

        // ESC: close settings, leave tutorial, or toggle pause/settings
        if (code === 'Escape') {
          event.preventDefault();
          if (this._settingsOpen) {
            this.closeSettingsModal();
            return;
          }
          if (state === S.TUTORIAL_READ) {
            this.engine.returnToMenu();
            return;
          }
          if (state === S.DIALOGUE_TYPE || state === S.CHOICE_IDLE || state === S.SUMMARY_READ) {
            this.openSettingsModal();
          }
          return;
        }

        // Block gameplay hotkeys while modal overlays are open
        if (this._settingsOpen) {
          return;
        }

        // Space / Enter
        if (code === 'Space' || code === 'Enter' || code === 'NumpadEnter') {
          if (state === S.DIALOGUE_TYPE) {
            event.preventDefault();
            this.handleDialogueAdvanceInput();
            return;
          }
          if (state === S.CHOICE_IDLE) {
            event.preventDefault();
            this.engine.submitVerdict(this.engine.getSelectedOptionIndex());
            return;
          }
          if (state === S.VERDICT_ANIM) {
            event.preventDefault();
            this.engine.proceedToSummary();
            return;
          }
        }

        // Choice navigation & quick selection in CHOICE_IDLE
        if (state === S.CHOICE_IDLE) {
          if (code === 'ArrowUp' || code === 'KeyW') {
            event.preventDefault();
            this.engine.moveChoiceCursor(-1);
          } else if (code === 'ArrowDown' || code === 'KeyS') {
            event.preventDefault();
            this.engine.moveChoiceCursor(1);
          } else if (code === 'Digit1' || code === 'Numpad1') {
            event.preventDefault();
            this.engine.setChoiceCursor(0);
            this.engine.submitVerdict(0);
          } else if (code === 'Digit2' || code === 'Numpad2') {
            event.preventDefault();
            this.engine.setChoiceCursor(1);
            this.engine.submitVerdict(1);
          } else if (code === 'Digit3' || code === 'Numpad3') {
            event.preventDefault();
            this.engine.setChoiceCursor(2);
            this.engine.submitVerdict(2);
          } else if (code === 'Digit4' || code === 'Numpad4') {
            event.preventDefault();
            this.engine.setChoiceCursor(3);
            this.engine.submitVerdict(3);
          } else if (code === 'KeyH') {
            event.preventDefault();
            this.engine.toggleEvidenceHint();
          }
        }
      });
    }

    _bindEngineEvents() {
      this.engine.on('stateChange', ({ state, payload }) => {
        this._onStateChange(state, payload);
      });

      this.engine.on('dialogueLine', (detail) => {
        this._renderDialogueBeat(detail);
      });

      this.engine.on('timerTick', (tickData) => {
        this._updateTimerUI(tickData);
      });

      this.engine.on('choiceCursorChanged', ({ index }) => {
        this._highlightChoiceCursor(index);
      });

      this.engine.on('hintToggled', ({ revealed }) => {
        this._renderHintState(revealed);
      });

      this.engine.on('profileUpdated', () => {
        this._applyVisualSettings();
        this._syncDifficultyCards();
        this.renderSettingsState();
        if (this.engine.getState() === this.engine.STATES.CHOICE_IDLE) {
          this._renderVerdictPanel();
        }
      });

      this.engine.on('languageChanged', ({ lang }) => {
        document.documentElement.lang = lang;
        this.applyStaticTranslations();
        this.renderLanguageSelectors();
        this._refreshAudioOutputDevices();
        this.renderSettingsState();
        this._refreshActiveScreenForLanguage();
      });
    }

    _bindAchievementToast() {
      global.addEventListener('psycho:achievement-unlocked', (event) => {
        const detail = event.detail || {};
        this._showAchievementPopup(detail.id, detail.icon || '◆');
      });
    }

    _showAchievementPopup(id, icon) {
      if (!this.els.toastRack) return;
      const toast = document.createElement('div');
      toast.className = 'achievement-toast';

      const iconBox = document.createElement('div');
      iconBox.className = 'ach-icon-box';
      iconBox.textContent = icon;

      const textWrap = document.createElement('div');
      const kicker = document.createElement('div');
      kicker.className = 'ach-kicker';
      kicker.textContent = this.i18n.t('ach_unlocked_prefix');

      const title = document.createElement('div');
      title.className = 'ach-title';
      title.textContent = this.i18n.getAchievementTitle(id);

      textWrap.appendChild(kicker);
      textWrap.appendChild(title);
      toast.appendChild(iconBox);
      toast.appendChild(textWrap);
      this.els.toastRack.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.35s ease';
        setTimeout(() => toast.remove(), 380);
      }, 4000);
    }

    /**
     * Apply translations to all `[data-i18n]` elements
     */
    applyStaticTranslations() {
      const nodes = document.querySelectorAll('[data-i18n]');
      const tutObj = this.i18n.t('tutorial');

      nodes.forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (key === 'tutorial_back') {
          el.textContent = tutObj.back_btn;
        } else if (key === 'tutorial_start') {
          el.textContent = tutObj.start_case_btn;
        } else if (key === 'tut_tab_aspects') {
          el.textContent = tutObj.tab_aspects;
        } else if (key === 'tut_tab_positions') {
          el.textContent = tutObj.tab_positions;
        } else if (key === 'tut_tab_simulator') {
          el.textContent = tutObj.tab_simulator;
        } else {
          const val = this.i18n.t(key);
          if (typeof val === 'string') {
            el.textContent = val;
          }
        }
      });

      document.title = this.i18n.t('app_title');
      this._syncDifficultyCards();
    }

    renderLanguageSelectors() {
      const container = this.els.settingsLangButtons;
      if (!container) return;

      const langs = this.i18n.getSupportedLanguages();
      const names = this.i18n.getLanguageNames();
      const activeLang = this.i18n.getLang();

      container.innerHTML = '';
      langs.forEach((code) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `settings-pill-btn${code === activeLang ? ' active' : ''}`;
        btn.textContent = names[code] || code.toUpperCase();
        btn.addEventListener('click', () => {
          this.engine.audio.playRelayClick();
          this.engine.setLanguage(code);
        });
        container.appendChild(btn);
      });
    }

    _syncDifficultyCards() {
      const profile = this.engine.getProfile();
      this.els.cardModeScout.classList.toggle('active', profile.difficulty === 'scout');
      this.els.cardModePro.classList.toggle('active', profile.difficulty === 'mindhunter');
    }

    /**
     * FSM State Switch Director
     */
    _onStateChange(state, payload) {
      const S = this.engine.STATES;

      // Reset transient overlays
      this.els.screenLoading.classList.toggle('hidden', state !== S.LOADING);
      this.els.screenMenu.classList.toggle('hidden', state !== S.MENU_IDLE);
      if (this.els.screenShutdown && state === S.MENU_IDLE) {
        this.els.screenShutdown.classList.add('hidden');
      }
      this.els.screenTutorial.classList.toggle('hidden', state !== S.TUTORIAL_READ);
      this.els.screenSummary.classList.toggle('hidden', state !== S.SUMMARY_READ);
      this.els.modalVerdict.classList.toggle('hidden', state !== S.VERDICT_ANIM);

      const inAdvStage = state === S.DIALOGUE_TYPE || state === S.CHOICE_IDLE || state === S.VERDICT_ANIM;
      this.els.hud.classList.toggle('hidden', !inAdvStage);
      this.els.dialogueLayer.classList.toggle('hidden', !(state === S.DIALOGUE_TYPE || state === S.CHOICE_IDLE));
      this.els.verdictLayer.classList.toggle('hidden', state !== S.CHOICE_IDLE);
      this.els.stage.classList.toggle('choice-mode-layout', state === S.CHOICE_IDLE);

      const inTimerStage = state === S.DIALOGUE_TYPE || state === S.CHOICE_IDLE;
      if (!inTimerStage) {
        this.els.dangerOverlay.classList.remove('critical-active');
        this.els.hudTimerModule.classList.remove('timer-critical');
      }

      if (state !== S.DIALOGUE_TYPE) {
        this._stopTypewriter();
      }

      if (state === S.MENU_IDLE) {
        this._currentScenarioId = null;
        this._currentEmotionKey = null;
        this._currentBgPath = null;
        this._currentSpritePath = null;
        this.els.bgImage.classList.add('hidden');
        this.els.cameraRig.classList.remove('climax-zoom');
        this.els.charRig.classList.remove('climax-zoom');
        this._applyMenuBackground();
      } else if (state === S.TUTORIAL_READ) {
        this.renderTutorialScreen();
      } else if (state === S.DIALOGUE_TYPE) {
        this.els.btnDlgAdvance.classList.remove('hidden');
        this.els.dlgHintDrawer.classList.add('hidden');
        this.preloadCaseAssets(this.engine.getCurrentScenario());
        this._updateHudTelemetry();
      } else if (state === S.CHOICE_IDLE) {
        this.els.btnDlgAdvance.classList.add('hidden');
        this._updateHudTelemetry();
        this._renderVerdictPanel();
      } else if (state === S.VERDICT_ANIM) {
        this._updateHudTelemetry();
        this._playVerdictPresentation(payload);
      } else if (state === S.SUMMARY_READ) {
        this._renderSummaryScreen();
      }
    }

    _formatSeconds(sec) {
      const safe = Math.max(0, Number(sec) || 0);
      return `${safe.toFixed(1)} ${this.i18n.t('timer_sec_unit')}`;
    }

    _applyMenuBackground() {
      if (!this.els.menuBgImage) return;
      const menuBgPath = this.engine.getMenuBackground();
      this._probeImageAsset(menuBgPath).then((exists) => {
        if (exists) {
          if (this.els.menuBgImage.getAttribute('src') !== menuBgPath) {
            this.els.menuBgImage.src = this._resolveAssetSrc(menuBgPath);
          }
          this.els.menuBgImage.classList.remove('hidden');
        } else {
          this.els.menuBgImage.classList.add('hidden');
        }
      });
    }

    _showShutdownScreen() {
      if (this.els.screenMenu) {
        this.els.screenMenu.classList.add('hidden');
      }
      if (this.els.screenShutdown) {
        this.els.screenShutdown.classList.remove('hidden');
      }
      this.engine.audio.playPanicPulse();
    }

    _updateHudTelemetry() {
      const tel = this.engine.getTelemetry();
      if (this.els.hudCaseLabel) {
        this.els.hudCaseLabel.textContent = tel.caseNumber;
      }
      this.els.hudCaseVal.textContent = tel.characterName;
      this.els.hudAccuracyVal.textContent = `${tel.accuracy}%`;
      this.els.hudScoreVal.textContent = String(tel.score);

      const isPro = tel.difficulty === 'mindhunter';
      this.els.hudModeBadge.textContent = this.i18n.t(isPro ? 'mode_mindhunter_name' : 'mode_scout_name');
      this.els.hudModeBadge.classList.toggle('mode-pro', isPro);
      this.els.hudTimerModule.classList.toggle('timer-pro', isPro);

      if (tel.isCadetFrozen) {
        this.els.hudTimerDigits.textContent = this._formatSeconds(tel.timerDurationSec || 60);
        this.els.hudTimerFill.style.width = '100%';
        this.els.hudTimerModule.classList.remove('timer-critical');
        this.els.dangerOverlay.classList.remove('critical-active');
      } else if (tel.timerUnlimited) {
        this.els.hudTimerDigits.textContent = '∞';
        this.els.hudTimerFill.style.width = '100%';
      } else {
        const ratio = tel.timerDurationSec > 0 ? tel.timerRemainingSec / tel.timerDurationSec : 1;
        const pct = `${Math.max(0, Math.min(100, ratio * 100)).toFixed(2)}%`;
        this.els.hudTimerDigits.textContent = this._formatSeconds(tel.timerRemainingSec);
        this.els.hudTimerFill.style.width = pct;
      }
    }

    /**
     * Load location background (`assets/media/backgrounds/*.png`) if present on disk;
     * otherwise preserve procedural CSS terminal background (grid, vignette & neon frames).
     * Supports both dynamic per-card background string and legacy scenario object.
     */
    _applyScenarioBackground(targetOrScenario, token) {
      let bgPath = '';
      if (typeof targetOrScenario === 'string') {
        bgPath = targetOrScenario.trim();
      } else if (targetOrScenario && typeof targetOrScenario === 'object') {
        bgPath = (targetOrScenario.background_image || targetOrScenario.background || '').trim();
      }

      if (bgPath === this._currentBgPath && !this.els.bgImage.classList.contains('hidden')) return;
      this._currentBgPath = bgPath;

      if (!bgPath) {
        this.els.bgImage.classList.add('hidden');
        this.els.bgImage.removeAttribute('src');
        return;
      }

      // If already cached, switch immediately with smooth CSS transition
      if (this._mediaAvailabilityCache.get(bgPath) === true) {
        const resolved = this._resolveAssetSrc(bgPath);
        if (this.els.bgImage.getAttribute('src') !== resolved && this.els.bgImage.getAttribute('src') !== bgPath) {
          this.els.bgImage.src = resolved;
        }
        this.els.bgImage.classList.remove('hidden');
        return;
      }

      this._probeImageAsset(bgPath).then((exists) => {
        if (token !== this._sceneRenderToken) return;
        if (exists) {
          this.els.bgImage.src = this._resolveAssetSrc(bgPath);
          this.els.bgImage.classList.remove('hidden');
        } else {
          this.els.bgImage.classList.add('hidden');
          this.els.bgImage.removeAttribute('src');
        }
      });
    }

    /**
     * Load transparent raster character sprite (`assets/media/sprites/*.png`) if present on disk;
     * otherwise seamlessly display procedural vector SVG silhouette fallback.
     * Supports both per-card dynamic sprite switching and legacy scenario defaults.
     */
    _applyCharacterSprite(scenario, spritePathOrEmotion, emotionKeyOrChanged, emotionChangedOrToken, maybeToken) {
      let spritePath = '';
      let emotionKey = 'panic';
      let emotionChanged = false;
      let token = this._sceneRenderToken;

      if (typeof spritePathOrEmotion === 'string' && (spritePathOrEmotion.includes('/') || spritePathOrEmotion.includes('.'))) {
        spritePath = spritePathOrEmotion.trim();
        emotionKey = emotionKeyOrChanged || 'panic';
        emotionChanged = Boolean(emotionChangedOrToken);
        token = maybeToken || this._sceneRenderToken;
      } else {
        spritePath = (scenario && (scenario.sprite_image || scenario.sprite) ? (scenario.sprite_image || scenario.sprite) : '').trim();
        emotionKey = spritePathOrEmotion || 'panic';
        emotionChanged = Boolean(emotionKeyOrChanged);
        token = emotionChangedOrToken || this._sceneRenderToken;
      }

      const fallbackSvgSrc = this._getFallbackSilhouetteSrc(scenario, emotionKey);

      this.els.charSprite.classList.toggle('emotion-resolve', emotionKey === 'resolve');
      this.els.charSprite.classList.toggle('emotion-panic', emotionKey !== 'resolve');

      const triggerSwapAnim = () => {
        if (emotionChanged) {
          this.els.charSprite.classList.remove('emotion-swap');
          void this.els.charSprite.offsetWidth;
          this.els.charSprite.classList.add('emotion-swap');
        }
      };

      // If already known cached true, render raster immediately without flicker
      if (spritePath && this._mediaAvailabilityCache.get(spritePath) === true) {
        this.els.charSprite.setAttribute('data-render-mode', 'raster');
        const resolved = this._resolveAssetSrc(spritePath);
        if (this.els.charSprite.getAttribute('src') !== resolved && this.els.charSprite.getAttribute('src') !== spritePath) {
          this.els.charSprite.src = resolved;
        }
        triggerSwapAnim();
        return;
      }

      // Immediately guarantee visible silhouette while probing physical file
      if (!spritePath) {
        this.els.charSprite.setAttribute('data-render-mode', 'svg-fallback');
        this.els.charSprite.src = fallbackSvgSrc;
        triggerSwapAnim();
        return;
      }

      this._probeImageAsset(spritePath).then((exists) => {
        if (token !== this._sceneRenderToken) return;
        if (exists) {
          this.els.charSprite.setAttribute('data-render-mode', 'raster');
          this.els.charSprite.src = this._resolveAssetSrc(spritePath);
          triggerSwapAnim();
        } else {
          this.els.charSprite.setAttribute('data-render-mode', 'svg-fallback');
          this.els.charSprite.src = fallbackSvgSrc;
          triggerSwapAnim();
        }
      });
    }

    /**
     * Render Background, Character Sprite Emotion, Climax Camera Zoom & Typewriter Line
     */
    _renderDialogueBeat({ scenario, line, index, total }) {
      this._updateHudTelemetry();

      const scenarioChanged = this._currentScenarioId !== scenario.id;
      if (scenarioChanged) {
        this._currentScenarioId = scenario.id;
        this._currentEmotionKey = null;
        this._currentBgPath = null;
        this._currentSpritePath = null;
        this._sceneRenderToken += 1;
      }

      const token = this._sceneRenderToken;

      // Dynamic per-card asset resolution (falling back to scenario defaults for 100% backward compatibility)
      const card = (scenario && scenario.dialogue_cards && scenario.dialogue_cards[index]) || line || {};

      // 1. Dynamic background: card.background_image -> card.background -> scenario.background_image -> scenario.background
      const bgPath = (card.background_image || card.background || (line && (line.background_image || line.background)) || (scenario && (scenario.background_image || scenario.background)) || '').trim();
      this._applyScenarioBackground(bgPath, token);

      // 2. Dynamic character sprite: card.sprite_image -> card.sprite -> scenario.sprite_image -> scenario.sprite
      const spritePath = (card.sprite_image || card.sprite || (line && (line.sprite_image || line.sprite)) || (scenario && (scenario.sprite_image || scenario.sprite)) || '').trim();
      const emotionKey = (line && line.emotion) || 'panic';
      const spriteChanged = this._currentSpritePath !== spritePath;
      const emotionChanged = scenarioChanged || this._currentEmotionKey !== emotionKey || spriteChanged;
      this._currentEmotionKey = emotionKey;
      this._currentSpritePath = spritePath;
      this._applyCharacterSprite(scenario, spritePath, emotionKey, emotionChanged, token);

      // 3. Climax camera zoom-in
      const isClimax = Boolean(line && line.climax);
      this.els.cameraRig.classList.toggle('climax-zoom', isClimax);
      this.els.charRig.classList.toggle('climax-zoom', isClimax);
      this.els.dlgClimaxBadge.classList.toggle('hidden', !isClimax);

      // 4. Speaker & Step counter
      this.els.dlgSpeaker.textContent = this.i18n.localizeField(line.speaker);
      this.els.dlgStepCounter.textContent = `[0${index + 1} / 0${total}]`;

      // 5. Start typewriter
      const localizedText = this.i18n.localizeField(line.text);
      this._startTypewriter(localizedText);
    }

    _startTypewriter(text) {
      this._stopTypewriter();
      this._twFullText = text;
      this._twIndex = 0;
      this.els.dlgText.textContent = '';

      const speed = this._getTextSpeed();
      if (speed <= 0) {
        this.els.dlgText.textContent = text;
        this._twIsTyping = false;
        return;
      }

      this._twIsTyping = true;
      this._twTimer = setInterval(() => {
        if (this.engine.isPaused() || this._settingsOpen) {
          return;
        }
        this._twIndex = Math.min(this._twFullText.length, this._twIndex + 1);
        this.els.dlgText.textContent = this._twFullText.slice(0, this._twIndex);

        const ch = this._twFullText[this._twIndex - 1];
        if (ch && ch.trim().length > 0 && this._twIndex % 2 === 0) {
          this.engine.audio.playTypeBlip(this._twIndex);
        }

        if (this._twIndex >= this._twFullText.length) {
          this._stopTypewriter();
        }
      }, speed);
    }

    _stopTypewriter() {
      if (this._twTimer !== null) {
        clearInterval(this._twTimer);
        this._twTimer = null;
      }
      this._twIsTyping = false;
    }

    handleDialogueAdvanceInput() {
      if (this._twIsTyping) {
        this._stopTypewriter();
        this.els.dlgText.textContent = this._twFullText;
        this.engine.audio.playHoverTick();
      } else {
        this.engine.advanceDialogue();
      }
    }

    /**
     * Render 4 Skewed Neon Verdict Buttons (`CHOICE_IDLE`)
     * Adapts between Scout Mode (axes + evidence clue) and Mindhunter Mode (bare function codes + 15s red bar)
     */
    _renderVerdictPanel() {
      const sc = this.engine.getCurrentScenario();
      if (!sc) return;

      const diffCfg = this.engine.getDifficultyConfig();
      const profile = this.engine.getProfile();
      const isScout = profile.difficulty === 'scout';
      const selectedIdx = this.engine.getSelectedOptionIndex();
      const hintRevealed = this.engine.isHintRevealed();

      this.els.verdictSubtitle.textContent = isScout
        ? this.i18n.t('verdict_subheader_scout')
        : this.i18n.t('verdict_subheader_pro');

      const timerUnlimited = isScout && profile.scoutUnlimitedTimer;
      const tel = this.engine.getTelemetry();
      this.els.verdictCrisisWrap.classList.toggle('hidden', timerUnlimited);

      if (!timerUnlimited) {
        const ratio = tel.timerDurationSec > 0 ? tel.timerRemainingSec / tel.timerDurationSec : 0;
        const pct = `${Math.max(0, Math.min(100, ratio * 100)).toFixed(2)}%`;
        this.els.verdictCrisisFill.style.width = pct;
        this.els.hudTimerDigits.textContent = this._formatSeconds(tel.timerRemainingSec);
      } else {
        this.els.verdictCrisisFill.style.width = '100%';
      }

      // Scout Evidence Clue button
      this.els.btnEvidenceHint.classList.toggle('hidden', !diffCfg.allow_evidence_hint);
      this.els.btnEvidenceHint.classList.toggle('active', hintRevealed);
      this._renderHintState(hintRevealed);

      // Build 4 option plates
      this.els.verdictOptionsList.innerHTML = '';
      sc.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `verdict-plate-btn${idx === selectedIdx ? ' focused' : ''}`;
        btn.setAttribute('role', 'option');
        btn.setAttribute('aria-selected', idx === selectedIdx ? 'true' : 'false');

        const topLine = document.createElement('div');
        topLine.className = 'plate-top-line';

        const hotkey = document.createElement('span');
        hotkey.className = 'plate-hotkey';
        hotkey.textContent = String(idx + 1);

        const mainLabel = document.createElement('span');
        mainLabel.className = 'plate-main-label';

        if (diffCfg.id === 'mindhunter') {
          // Mindhunter Mode: bare function code/label only
          mainLabel.textContent = this.i18n.getBareFunctionLabel(opt.function_code);
        } else {
          mainLabel.textContent = this.i18n.localizeField(opt.text);
        }

        topLine.appendChild(hotkey);
        topLine.appendChild(mainLabel);
        btn.appendChild(topLine);

        if (diffCfg.show_axes_on_options) {
          const axesLine = document.createElement('div');
          axesLine.className = 'plate-axes-sub';
          axesLine.textContent = this.i18n.localizeField(opt.axes);
          btn.appendChild(axesLine);
        }

        if (diffCfg.allow_evidence_hint && hintRevealed) {
          const hintLine = document.createElement('div');
          hintLine.className = 'plate-scout-hint';
          hintLine.textContent = `▸ ${this.i18n.localizeField(opt.hint)}`;
          btn.appendChild(hintLine);
        }

        btn.addEventListener('mouseenter', () => {
          this.engine.setChoiceCursor(idx);
        });
        btn.addEventListener('click', () => {
          this.engine.submitVerdict(idx);
        });

        this.els.verdictOptionsList.appendChild(btn);
      });
    }

    _highlightChoiceCursor(index) {
      const plates = this.els.verdictOptionsList.querySelectorAll('.verdict-plate-btn');
      plates.forEach((plate, idx) => {
        const active = idx === index;
        plate.classList.toggle('focused', active);
        plate.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    }

    _renderHintState(revealed) {
      const sc = this.engine.getCurrentScenario();
      const diffCfg = this.engine.getDifficultyConfig();
      if (!sc || !diffCfg.allow_evidence_hint) {
        this.els.dlgHintDrawer.classList.add('hidden');
        return;
      }

      this.els.btnEvidenceHint.classList.toggle('active', revealed);
      this.els.dlgHintDrawer.classList.toggle('hidden', !revealed);
      if (revealed) {
        this.els.dlgHintContent.textContent = this.i18n.localizeField(sc.evidence_summary);
      }

      // Refresh per-plate hints
      const plates = this.els.verdictOptionsList.querySelectorAll('.verdict-plate-btn');
      plates.forEach((plate, idx) => {
        const existing = plate.querySelector('.plate-scout-hint');
        if (existing) existing.remove();
        if (revealed && sc.options[idx]) {
          const hintLine = document.createElement('div');
          hintLine.className = 'plate-scout-hint';
          hintLine.textContent = `▸ ${this.i18n.localizeField(sc.options[idx].hint)}`;
          plate.appendChild(hintLine);
        }
      });
    }

    _updateTimerUI({ remaining, ratio, isCritical, isFrozen }) {
      const isScoutDialogue =
        this.engine.getState() === this.engine.STATES.DIALOGUE_TYPE &&
        this.engine.getProfile().difficulty === 'scout';

      if (isScoutDialogue || isFrozen) {
        const dur = this.engine.getTelemetry().timerDurationSec || 60;
        this.els.hudTimerDigits.textContent = this._formatSeconds(dur);
        this.els.hudTimerFill.style.width = '100%';
        this.els.verdictCrisisFill.style.width = '100%';
        this.els.hudTimerModule.classList.remove('timer-critical');
        this.els.dangerOverlay.classList.remove('critical-active');
        return;
      }

      const pct = `${Math.max(0, Math.min(100, ratio * 100)).toFixed(2)}%`;
      this.els.hudTimerDigits.textContent = this._formatSeconds(remaining);
      this.els.hudTimerFill.style.width = pct;
      this.els.verdictCrisisFill.style.width = pct;

      this.els.hudTimerModule.classList.toggle('timer-critical', isCritical);
      this.els.dangerOverlay.classList.toggle('critical-active', isCritical);
    }

    _formatFunctionSlot(option) {
      if (!option) return '—';
      const code = option.function_code || '';
      const numMatch = code.match(/^[1-4]/);
      const romanMap = { '1': 'I', '2': 'II', '3': 'III', '4': 'IV' };
      const roman = numMatch ? romanMap[numMatch[0]] : code;

      const aspectLetter = code.replace(/^[1-4]/, '').toUpperCase();
      let aspectName = 'ФУНКЦИЯ';
      const curLang = this.i18n && typeof this.i18n.getLang === 'function' ? this.i18n.getLang() : 'ru';
      const aspectNames = {
        'В': { ru: 'ВОЛЯ', en: 'WILL', zh: '意志', de: 'WILLE', ja: '意志' },
        'W': { ru: 'ВОЛЯ', en: 'WILL', zh: '意志', de: 'WILLE', ja: '意志' },
        'Л': { ru: 'ЛОГИКА', en: 'LOGIC', zh: '逻辑', de: 'LOGIK', ja: '論理' },
        'L': { ru: 'ЛОГИКА', en: 'LOGIC', zh: '逻辑', de: 'LOGIK', ja: '論理' },
        'Ф': { ru: 'ФИЗИКА', en: 'PHYSICS', zh: '物理', de: 'PHYSIK', ja: '物理' },
        'P': { ru: 'ФИЗИКА', en: 'PHYSICS', zh: '物理', de: 'PHYSIK', ja: '物理' },
        'F': { ru: 'ФИЗИКА', en: 'PHYSICS', zh: '物理', de: 'PHYSIK', ja: '物理' },
        'Э': { ru: 'ЭМОЦИЯ', en: 'EMOTION', zh: '情感', de: 'EMOTION', ja: '感情' },
        'E': { ru: 'ЭМОЦИЯ', en: 'EMOTION', zh: '情感', de: 'EMOTION', ja: '感情' }
      };
      if (aspectNames[aspectLetter]) {
        aspectName = aspectNames[aspectLetter][curLang] || aspectNames[aspectLetter].ru;
      }

      const fullText = this.i18n.localizeField(option.text) || '';
      let title = fullText;
      if (fullText.includes('—')) {
        title = fullText.split('—').slice(1).join('—').trim();
      } else if (fullText.includes('-')) {
        title = fullText.split('-').slice(1).join('-').trim();
      }

      return `${roman} ${aspectName} — ${title}`;
    }

    /**
     * Play Verdict FX (Breakthrough flash or Screen-Shake) & Populate Psychological Autopsy Modal (`VERDICT_ANIM`)
     */
    _playVerdictPresentation(result) {
      if (!result) return;

      const { outcome, isCorrect, isTimeout, chosenOption, correctOption, timeoutData } = result;

      // Visual FX
      if (isCorrect) {
        this.els.breakthroughFlash.classList.remove('hidden');
        setTimeout(() => {
          this.els.breakthroughFlash.classList.add('hidden');
        }, 740);
      } else {
        this.triggerScreenShake();
      }

      // Outcome Ribbon
      this.els.verdictRibbon.className = `verdict-outcome-ribbon outcome-${outcome}`;
      if (outcome === 'win') {
        this.els.verdictRibbon.textContent = this.i18n.t('verdict_win_tag');
      } else if (outcome === 'timeout') {
        this.els.verdictRibbon.textContent = timeoutData
          ? this.i18n.localizeField(timeoutData.title)
          : this.i18n.t('verdict_timeout_tag');
      } else {
        this.els.verdictRibbon.textContent = this.i18n.t('verdict_lose_tag');
      }

      // Chosen vs True Function (Roman numeral slot format)
      if (isTimeout) {
        this.els.verdictChosenVal.textContent = this.i18n.t('verdict_timeout_value');
      } else if (chosenOption) {
        this.els.verdictChosenVal.textContent = this._formatFunctionSlot(chosenOption);
      }

      if (correctOption) {
        this.els.verdictCorrectVal.textContent = this._formatFunctionSlot(correctOption);
      }

      // Canonical Axis Tags e.g. [СЛАБАЯ] [ПРОЦЕССИОННАЯ] [ДОМИНАНТНАЯ]
      const targetForAxes = !isTimeout && chosenOption ? chosenOption : correctOption;
      const rawAxes = targetForAxes ? this.i18n.localizeField(targetForAxes.axes) : '';
      this.els.verdictAxesTags.innerHTML = '';

      rawAxes
        .split('/')
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((axisToken) => {
          const pill = document.createElement('span');
          pill.className = 'axis-tag-pill';
          pill.textContent = `[${axisToken.toUpperCase()}]`;
          this.els.verdictAxesTags.appendChild(pill);
        });

      // Psychological Breakdown
      if (isTimeout && timeoutData) {
        this.els.verdictBreakdownText.textContent = this.i18n.localizeField(timeoutData.breakdown);
      } else if (chosenOption) {
        this.els.verdictBreakdownText.textContent = this.i18n.localizeField(chosenOption.breakdown);
      }
    }

    triggerScreenShake() {
      if (!this.engine.getProfile().screenShakeEnabled) return;
      this.els.stage.classList.remove('fx-screen-shake');
      void this.els.stage.offsetWidth;
      this.els.stage.classList.add('fx-screen-shake');
    }

    /**
     * Render Case Dossier Summary (`SUMMARY_READ`)
     */
    _renderSummaryScreen() {
      const verdict = this.engine.getLastVerdictResult();
      const tel = this.engine.getTelemetry();
      if (!verdict) return;

      this.els.summaryHeadline.textContent = verdict.isCorrect
        ? this.i18n.t('summary_status_solved')
        : this.i18n.t('summary_status_failed');
      this.els.summaryHeadline.style.color = verdict.isCorrect ? '#00e676' : '#ff5252';

      this.els.sumValCase.textContent = this.i18n.localizeField(verdict.scenario.case_title);
      this.els.sumValProfile.textContent = verdict.correctOption
        ? this._formatFunctionSlot(verdict.correctOption)
        : '—';
      this.els.sumValScore.textContent = `${tel.score} (+${verdict.pointsEarned})`;
      this.els.sumValAccuracy.textContent = `${tel.accuracy}%`;
      this.els.sumValTime.textContent =
        verdict.remainingTimeSec === null ? '∞' : this._formatSeconds(verdict.remainingTimeSec);

      // Bottom explanation badge: success (green) vs failure (red/amber)
      this.els.sumExplanation.classList.remove('status-success', 'status-failed');
      if (verdict.isCorrect) {
        this.els.sumExplanation.classList.add('status-success');
        this.els.sumExplanation.textContent = verdict.correctOption
          ? this.i18n.localizeField(verdict.correctOption.explanation)
          : '';
      } else {
        this.els.sumExplanation.classList.add('status-failed');
        const prefix = this.i18n.t('summary_failed_explanation_prefix');
        const correctInfo = verdict.correctOption
          ? this._formatFunctionSlot(verdict.correctOption)
          : '—';
        this.els.sumExplanation.textContent = `${prefix}${correctInfo}.`;
      }

      this.els.btnSumNext.classList.toggle('hidden', !this.engine.hasNextScenario());
    }

    /**
     * Render Optional Interactive Typology Database & Breakthrough Simulator (`TUTORIAL_READ`)
     */
    renderTutorialScreen() {
      const tut = this.i18n.t('tutorial');
      if (!tut) return;

      this.els.tutHeaderTitle.textContent = tut.header;
      this.els.btnTutBack.textContent = tut.back_btn;
      this.els.btnTutStartGame.textContent = tut.start_case_btn;

      this.els.tabBtnAspects.textContent = tut.tab_aspects;
      this.els.tabBtnPositions.textContent = tut.tab_positions;
      this.els.tabBtnSimulator.textContent = tut.tab_simulator;

      [this.els.tabBtnAspects, this.els.tabBtnPositions, this.els.tabBtnSimulator].forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('data-tut-tab') === this._activeTutorialTab);
      });

      const body = this.els.tutorialBody;
      body.innerHTML = '';

      if (this._activeTutorialTab === 'aspects') {
        const intro = document.createElement('p');
        intro.className = 'tut-lead-text';
        intro.textContent = tut.aspects_intro;
        body.appendChild(intro);

        const grid = document.createElement('div');
        grid.className = 'tut-cards-grid';
        tut.aspects_list.forEach((item) => {
          const card = document.createElement('article');
          card.className = 'tut-info-card';
          card.innerHTML = `
            <h3 class="tut-card-title"></h3>
            <p class="tut-card-desc"></p>
            <div class="tut-card-markers"></div>
          `;
          card.querySelector('.tut-card-title').textContent = item.title;
          card.querySelector('.tut-card-desc').textContent = item.desc;
          card.querySelector('.tut-card-markers').textContent = item.markers;
          grid.appendChild(card);
        });
        body.appendChild(grid);
      } else if (this._activeTutorialTab === 'positions') {
        const intro = document.createElement('p');
        intro.className = 'tut-lead-text';
        intro.textContent = tut.positions_intro;
        body.appendChild(intro);

        const legend = document.createElement('div');
        legend.className = 'tut-legend-banner';
        legend.textContent = tut.axes_legend;
        body.appendChild(legend);

        const grid = document.createElement('div');
        grid.className = 'tut-cards-grid';
        tut.positions_list.forEach((posItem) => {
          const card = document.createElement('article');
          card.className = 'tut-info-card';

          const title = document.createElement('h3');
          title.className = 'tut-card-title';
          title.textContent = posItem.pos;

          const tagsWrap = document.createElement('div');
          tagsWrap.className = 'verdict-axes-tags';
          tagsWrap.style.marginBottom = '14px';
          posItem.axes.forEach((ax) => {
            const pill = document.createElement('span');
            pill.className = 'axis-tag-pill';
            pill.style.fontSize = '14px';
            pill.style.padding = '6px 14px';
            pill.textContent = `[${ax}]`;
            tagsWrap.appendChild(pill);
          });

          const desc = document.createElement('p');
          desc.className = 'tut-card-desc';
          desc.textContent = posItem.summary;

          card.appendChild(title);
          card.appendChild(tagsWrap);
          card.appendChild(desc);
          grid.appendChild(card);
        });
        body.appendChild(grid);
      } else {
        // Practical Breakthrough Simulator
        const title = document.createElement('h3');
        title.className = 'tut-card-title';
        title.textContent = tut.sim_title;
        body.appendChild(title);

        const instr = document.createElement('p');
        instr.className = 'tut-lead-text';
        instr.textContent = tut.sim_instruction;
        body.appendChild(instr);

        const arena = document.createElement('div');
        arena.className = 'sim-arena';

        const quoteBox = document.createElement('div');
        quoteBox.className = 'sim-quote-box';

        const quoteLabel = document.createElement('div');
        quoteLabel.className = 'sim-quote-label';
        quoteLabel.textContent = '// ПЕРЕХВАТ АУДИОЗАПИСИ — ТЕСТОВЫЙ ОБЪЕКТ';

        const quoteText = document.createElement('div');
        quoteText.className = 'simulator-quote sim-quote-text';
        quoteText.textContent = tut.sim_quote;

        quoteBox.appendChild(quoteLabel);
        quoteBox.appendChild(quoteText);

        const rightCol = document.createElement('div');
        const stack = document.createElement('div');
        stack.className = 'sim-choices-stack';

        const feedbackBox = document.createElement('div');
        feedbackBox.className = 'sim-feedback-box hidden';

        tut.sim_options.forEach((simOpt, idx) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = `verdict-plate-btn${this._simSelectedCode === simOpt.code ? ' focused' : ''}`;

          const top = document.createElement('div');
          top.className = 'plate-top-line';

          const hk = document.createElement('span');
          hk.className = 'plate-hotkey';
          hk.textContent = String(idx + 1);

          const lbl = document.createElement('span');
          lbl.className = 'plate-main-label';
          lbl.style.fontSize = '20px';
          lbl.textContent = simOpt.label;

          top.appendChild(hk);
          top.appendChild(lbl);
          btn.appendChild(top);

          btn.addEventListener('click', () => {
            this._simSelectedCode = simOpt.code;
            this.engine.audio.playRelayClick();

            stack.querySelectorAll('.verdict-plate-btn').forEach((b) => b.classList.remove('focused'));
            btn.classList.add('focused');

            feedbackBox.classList.remove('hidden', 'sim-win', 'sim-miss');
            feedbackBox.classList.add(simOpt.correct ? 'sim-win' : 'sim-miss');
            feedbackBox.textContent = simOpt.feedback;

            if (simOpt.correct) {
              this.engine.audio.playBreakthrough();
              this.engine.achievements.unlockAchievement('THEORY_INITIATE');
              this.els.breakthroughFlash.classList.remove('hidden');
              setTimeout(() => this.els.breakthroughFlash.classList.add('hidden'), 700);
            } else {
              this.engine.audio.playErrorShock();
              this.triggerScreenShake();
            }
          });

          stack.appendChild(btn);

          if (this._simSelectedCode === simOpt.code) {
            feedbackBox.classList.remove('hidden');
            feedbackBox.classList.add(simOpt.correct ? 'sim-win' : 'sim-miss');
            feedbackBox.textContent = simOpt.feedback;
          }
        });

        rightCol.appendChild(stack);
        rightCol.appendChild(feedbackBox);
        arena.appendChild(quoteBox);
        arena.appendChild(rightCol);
        body.appendChild(arena);
      }
    }

    /**
     * Settings & Pause Modal
     */
    toggleSettingsModal() {
      if (this._settingsOpen) {
        this.closeSettingsModal();
      } else {
        this.openSettingsModal();
      }
    }

    openSettingsModal() {
      this._settingsOpen = true;
      this.engine.setPaused(true);
      this._refreshAudioOutputDevices();
      this.renderSettingsState();
      this.els.modalSettings.classList.remove('hidden');
    }

    closeSettingsModal() {
      this._settingsOpen = false;
      this.els.modalSettings.classList.add('hidden');
      this.engine.audio.playHoverTick();
      this.engine.setPaused(false);
    }

    _applyVisualSettings() {
      if (!this.els.stage) return;
      const profile = this.engine.getProfile();
      this.els.stage.classList.toggle('crt-disabled', !profile.crtEnabled);
      if (!profile.screenShakeEnabled) {
        this.els.stage.classList.remove('fx-screen-shake');
      }
    }

    async _refreshAudioOutputDevices() {
      const select = this.els.settingsAudioDevice;
      if (!select) return;

      const sinkSupported = Boolean(
        this.els.audioSinkBridge && typeof this.els.audioSinkBridge.setSinkId === 'function'
      );

      if (!sinkSupported || !navigator.mediaDevices || typeof navigator.mediaDevices.enumerateDevices !== 'function') {
        select.innerHTML = '';
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = this.i18n.t('settings_sink_unsupported');
        select.appendChild(opt);
        select.disabled = true;
        return;
      }

      select.disabled = false;
      let outputs = [];
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        outputs = devices.filter((d) => d && d.kind === 'audiooutput');
      } catch (_) {
        outputs = [];
      }

      const savedSinkId = this.engine.getProfile().audioSinkId || '';
      const seenIds = new Set();
      select.innerHTML = '';

      // Always include canonical system default output option
      const defaultOpt = document.createElement('option');
      defaultOpt.value = '';
      const explicitDefault = outputs.find((d) => d.deviceId === 'default' || d.deviceId === '');
      defaultOpt.textContent =
        explicitDefault && explicitDefault.label && explicitDefault.label.trim()
          ? explicitDefault.label.trim()
          : this.i18n.t('settings_sink_default');
      select.appendChild(defaultOpt);
      seenIds.add('');
      seenIds.add('default');

      let customIdx = 1;
      outputs.forEach((dev) => {
        const id = dev.deviceId || '';
        if (seenIds.has(id)) return;
        seenIds.add(id);

        const opt = document.createElement('option');
        opt.value = id;
        opt.textContent =
          dev.label && dev.label.trim()
            ? dev.label.trim()
            : `${this.i18n.t('settings_sink_fallback_prefix')} #${customIdx}`;
        customIdx += 1;
        select.appendChild(opt);
      });

      const hasSaved = Array.from(select.options).some((o) => o.value === savedSinkId);
      select.value = hasSaved ? savedSinkId : '';
    }

    isFullscreenActive() {
      return Boolean(document.fullscreenElement || document.webkitFullscreenElement);
    }

    toggleFullscreen() {
      const docEl = document.documentElement;
      if (!this.isFullscreenActive()) {
        const req = docEl.requestFullscreen || docEl.webkitRequestFullscreen;
        if (typeof req === 'function') {
          Promise.resolve(req.call(docEl))
            .catch(() => {})
            .finally(() => this.renderSettingsState());
        }
      } else {
        const exit = document.exitFullscreen || document.webkitExitFullscreen;
        if (typeof exit === 'function') {
          Promise.resolve(exit.call(document))
            .catch(() => {})
            .finally(() => this.renderSettingsState());
        }
      }
    }

    renderSettingsState() {
      const profile = this.engine.getProfile();
      const state = this.engine.getState();
      const S = this.engine.STATES;

      const onLabel = this.i18n.t('toggle_on');
      const offLabel = this.i18n.t('toggle_off');

      // Master Volume
      const volPct = Math.round(Math.max(0, Math.min(1, profile.masterVolume)) * 100);
      if (this.els.settingsMasterVol) {
        this.els.settingsMasterVol.value = String(volPct);
        this.els.settingsMasterVol.style.setProperty('--slider-fill', `${volPct}%`);
      }
      if (this.els.settingsMasterVolVal) {
        this.els.settingsMasterVolVal.textContent = `${volPct}%`;
      }

      // BGM & SFX toggles
      if (this.els.btnBgmToggle) {
        this.els.btnBgmToggle.textContent = profile.bgmEnabled ? onLabel : offLabel;
        this.els.btnBgmToggle.classList.toggle('active', profile.bgmEnabled);
      }
      if (this.els.btnSfxToggle) {
        this.els.btnSfxToggle.textContent = profile.sfxEnabled ? onLabel : offLabel;
        this.els.btnSfxToggle.classList.toggle('active', profile.sfxEnabled);
      }

      // Audio Output Sink Selector
      if (this.els.settingsAudioDevice && !this.els.settingsAudioDevice.disabled) {
        const wanted = profile.audioSinkId || '';
        if (Array.from(this.els.settingsAudioDevice.options).some((o) => o.value === wanted)) {
          this.els.settingsAudioDevice.value = wanted;
        }
      }

      // Visual toggles: Screen Shake, CRT Scanlines & Fullscreen
      if (this.els.btnShakeToggle) {
        this.els.btnShakeToggle.textContent = profile.screenShakeEnabled ? onLabel : offLabel;
        this.els.btnShakeToggle.classList.toggle('active', profile.screenShakeEnabled);
      }
      if (this.els.btnCrtToggle) {
        this.els.btnCrtToggle.textContent = profile.crtEnabled ? onLabel : offLabel;
        this.els.btnCrtToggle.classList.toggle('active', profile.crtEnabled);
      }
      if (this.els.btnFullscreenToggle) {
        const fsActive = this.isFullscreenActive();
        this.els.btnFullscreenToggle.textContent = fsActive
          ? this.i18n.t('settings_fullscreen_exit')
          : this.i18n.t('settings_fullscreen_enter');
        this.els.btnFullscreenToggle.classList.toggle('active', fsActive);
      }

      // Terminal Text Speed Pills
      const curSpeed = this._getTextSpeed();
      if (this.els.settingsSpeedButtons) {
        const speedBtns = this.els.settingsSpeedButtons.querySelectorAll('[data-speed]');
        speedBtns.forEach((btn) => {
          const sp = Number(btn.getAttribute('data-speed'));
          btn.classList.toggle('active', sp === curSpeed);
        });
      }

      const canReturnMenu = state !== S.MENU_IDLE && state !== S.LOADING;
      this.els.btnSettingsQuitMenu.classList.toggle('hidden', !canReturnMenu);
    }

    /**
     * Live re-render of active view when language changes mid-session
     */
    _refreshActiveScreenForLanguage() {
      const state = this.engine.getState();
      const S = this.engine.STATES;

      if (state === S.TUTORIAL_READ) {
        this.renderTutorialScreen();
      } else if (state === S.DIALOGUE_TYPE) {
        const sc = this.engine.getCurrentScenario();
        const line = this.engine.getCurrentDialogueLine();
        if (sc && line) {
          this._stopTypewriter();
          this.els.dlgSpeaker.textContent = this.i18n.localizeField(line.speaker);
          this.els.dlgText.textContent = this.i18n.localizeField(line.text);
          this._updateHudTelemetry();
        }
      } else if (state === S.CHOICE_IDLE) {
        const sc = this.engine.getCurrentScenario();
        const line = this.engine.getCurrentDialogueLine();
        if (sc && line) {
          this.els.dlgSpeaker.textContent = this.i18n.localizeField(line.speaker);
          this.els.dlgText.textContent = this.i18n.localizeField(line.text);
        }
        this._updateHudTelemetry();
        this._renderVerdictPanel();
      } else if (state === S.VERDICT_ANIM) {
        this._updateHudTelemetry();
        this._playVerdictPresentation(this.engine.getLastVerdictResult());
      } else if (state === S.SUMMARY_READ) {
        this._renderSummaryScreen();
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const ui = new PsychoUIController(global.PsychoEngine, global.PsychoI18n);
    global.PsychoUI = ui;
    ui.init();
  });
})(window);
