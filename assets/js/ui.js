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
      this._sceneRenderToken = 0;
      this._mediaAvailabilityCache = new Map();

      // Tutorial active tab & simulator state
      this._activeTutorialTab = 'aspects';
      this._simSelectedCode = null;

      // Overlay flags
      this._backlogOpen = false;
      this._settingsOpen = false;

      this.els = {};
    }

    init() {
      this._bindOverlayProtection();
      this._cacheElements();
      this._initViewportScaler();
      this._bindUIEvents();
      this._bindKeyboardAndWheelControls();
      this._bindEngineEvents();
      this._bindAchievementToast();

      this.applyStaticTranslations();
      this.renderLanguageSelectors();

      this.engine.boot('assets/data/scenarios.json').catch((err) => {
        console.error('[Boot Error]:', err);
        if (this.els.bootStatus) {
          this.els.bootStatus.textContent = `CRITICAL SCHEMA / LOAD ERROR: ${err.message}`;
          this.els.bootStatus.style.color = '#ff1744';
        }
      });
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
        hudCaseVal: byId('hud-case-val'),
        hudPhaseVal: byId('hud-phase-val'),
        hudModeBadge: byId('hud-mode-badge'),
        hudTimerModule: byId('hud-timer-module'),
        hudTimerDigits: byId('hud-timer-digits'),
        hudTimerFill: byId('hud-timer-fill'),
        hudAccuracyVal: byId('hud-accuracy-val'),
        hudScoreVal: byId('hud-score-val'),
        btnHudBacklog: byId('btn-hud-backlog'),
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
        menuLangStrip: byId('menu-lang-strip'),
        btnMenuStart: byId('btn-menu-start'),
        btnMenuTutorial: byId('btn-menu-tutorial'),
        btnMenuSettings: byId('btn-menu-settings'),

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

        modalBacklog: byId('modal-backlog'),
        btnCloseBacklog: byId('btn-close-backlog'),
        backlogBody: byId('backlog-scroll-body'),

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
        btnAudioToggle: byId('btn-audio-toggle'),
        btnScoutTimerToggle: byId('btn-scout-timer-toggle'),
        btnSettingsResume: byId('btn-settings-resume'),
        btnSettingsQuitMenu: byId('btn-settings-quit-menu'),

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
     * Universal procedural vector SVG silhouette fallback if neither physical PNG nor `scenario.sprites` exists
     */
    _buildDefaultProceduralSilhouette(scenario, emotionKey) {
      const stroke = emotionKey === 'resolve' ? '#00e5ff' : '#ff1744';
      const badge = (scenario && scenario.case_number) || 'SUBJECT';
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
        this.engine.startScenario(0);
      });
      this.els.btnMenuTutorial.addEventListener('click', () => {
        this.engine.openTutorial();
      });
      this.els.btnMenuSettings.addEventListener('click', () => {
        this.engine.audio.playRelayClick();
        this.openSettingsModal();
      });

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

      // HUD buttons
      this.els.btnHudBacklog.addEventListener('click', () => {
        this.toggleBacklogModal();
      });
      this.els.btnHudMenu.addEventListener('click', () => {
        this.toggleSettingsModal();
      });

      // Scout Mode Evidence Hint toggle
      this.els.btnEvidenceHint.addEventListener('click', () => {
        this.engine.toggleEvidenceHint();
      });

      // Backlog close
      this.els.btnCloseBacklog.addEventListener('click', () => {
        this.closeBacklogModal();
      });
      this.els.modalBacklog.addEventListener('click', (e) => {
        if (e.target === this.els.modalBacklog) this.closeBacklogModal();
      });

      // Verdict modal continue -> SUMMARY_READ
      this.els.btnVerdictContinue.addEventListener('click', () => {
        this.engine.proceedToSummary();
      });

      // Summary screen buttons
      this.els.btnSumNext.addEventListener('click', () => {
        this.engine.startNextScenario();
      });
      this.els.btnSumRetry.addEventListener('click', () => {
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

      this.els.btnAudioToggle.addEventListener('click', () => {
        const next = !this.engine.getProfile().audioEnabled;
        this.engine.setAudioEnabled(next);
        if (next) this.engine.audio.playRelayClick();
        this.renderSettingsState();
      });

      this.els.btnScoutTimerToggle.addEventListener('click', () => {
        const next = !this.engine.getProfile().scoutUnlimitedTimer;
        this.engine.setScoutUnlimitedTimer(next);
        this.engine.audio.playRelayClick();
        this.renderSettingsState();
      });

      this.els.btnSettingsQuitMenu.addEventListener('click', () => {
        this.closeSettingsModal();
        this.engine.returnToMenu();
      });
    }

    /**
     * Hybrid Controls for Steam Desktop & Steam Deck:
     * Space/Enter, ArrowUp/ArrowDown, Digits 1-4, KeyL / WheelUp Backlog, KeyH Hint, ESC Pause
     */
    _bindKeyboardAndWheelControls() {
      global.addEventListener('keydown', (event) => {
        const code = event.code;
        const state = this.engine.getState();
        const S = this.engine.STATES;

        // ESC: close modals, leave tutorial, or toggle pause/settings
        if (code === 'Escape') {
          event.preventDefault();
          if (this._backlogOpen) {
            this.closeBacklogModal();
            return;
          }
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

        // L key (physical KeyL works across RU/EN/DE/ZH/JA layouts) -> Toggle Backlog
        if (code === 'KeyL') {
          if (
            !this._settingsOpen &&
            (state === S.DIALOGUE_TYPE || state === S.CHOICE_IDLE || state === S.VERDICT_ANIM || state === S.SUMMARY_READ)
          ) {
            event.preventDefault();
            this.toggleBacklogModal();
          }
          return;
        }

        // Block gameplay hotkeys while modal overlays are open
        if (this._backlogOpen || this._settingsOpen) {
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

      // Mouse Wheel Up -> Open Backlog during active scene
      global.addEventListener(
        'wheel',
        (event) => {
          if (this._backlogOpen || this._settingsOpen) return;
          const state = this.engine.getState();
          const S = this.engine.STATES;
          if ((state === S.DIALOGUE_TYPE || state === S.CHOICE_IDLE) && event.deltaY < -12) {
            this.openBacklogModal();
          }
        },
        { passive: true }
      );
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
      const langs = this.i18n.getSupportedLanguages();
      const names = this.i18n.getLanguageNames();
      const activeLang = this.i18n.getLang();

      const buildButtons = (container, className) => {
        if (!container) return;
        container.innerHTML = '';
        langs.forEach((code) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = `${className}${code === activeLang ? ' active' : ''}`;
          btn.textContent = names[code] || code.toUpperCase();
          btn.addEventListener('click', () => {
            this.engine.audio.playRelayClick();
            this.engine.setLanguage(code);
          });
          container.appendChild(btn);
        });
      };

      buildButtons(this.els.menuLangStrip, 'lang-chip-btn');
      buildButtons(this.els.settingsLangButtons, 'settings-pill-btn');
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
      this.els.screenTutorial.classList.toggle('hidden', state !== S.TUTORIAL_READ);
      this.els.screenSummary.classList.toggle('hidden', state !== S.SUMMARY_READ);
      this.els.modalVerdict.classList.toggle('hidden', state !== S.VERDICT_ANIM);

      const inAdvStage = state === S.DIALOGUE_TYPE || state === S.CHOICE_IDLE || state === S.VERDICT_ANIM;
      this.els.hud.classList.toggle('hidden', !inAdvStage);
      this.els.dialogueLayer.classList.toggle('hidden', !(state === S.DIALOGUE_TYPE || state === S.CHOICE_IDLE));
      this.els.verdictLayer.classList.toggle('hidden', state !== S.CHOICE_IDLE);
      this.els.stage.classList.toggle('choice-mode-layout', state === S.CHOICE_IDLE);

      if (state !== S.CHOICE_IDLE) {
        this.els.dangerOverlay.classList.remove('critical-active');
        this.els.hudTimerModule.classList.remove('timer-critical');
      }

      if (state === S.MENU_IDLE) {
        this._stopTypewriter();
        this._currentScenarioId = null;
        this._currentEmotionKey = null;
        this._currentBgPath = null;
        this.els.bgImage.classList.add('hidden');
        this.els.cameraRig.classList.remove('climax-zoom');
        this.els.charRig.classList.remove('climax-zoom');
        this._applyMenuBackground();
      } else if (state === S.TUTORIAL_READ) {
        this.renderTutorialScreen();
      } else if (state === S.DIALOGUE_TYPE) {
        this.els.btnDlgAdvance.classList.remove('hidden');
        this.els.dlgHintDrawer.classList.add('hidden');
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

    _updateHudTelemetry() {
      const tel = this.engine.getTelemetry();
      this.els.hudCaseVal.textContent = tel.caseTitle;
      this.els.hudPhaseVal.textContent = tel.phaseCode;
      this.els.hudAccuracyVal.textContent = `${tel.accuracy}%`;
      this.els.hudScoreVal.textContent = String(tel.score);

      const isPro = tel.difficulty === 'mindhunter';
      this.els.hudModeBadge.textContent = isPro ? 'MINDHUNTER // PRO' : 'SCOUT // CADET';
      this.els.hudModeBadge.classList.toggle('mode-pro', isPro);
      this.els.hudTimerModule.classList.toggle('timer-pro', isPro);

      if (this.engine.getState() === this.engine.STATES.DIALOGUE_TYPE) {
        this.els.hudTimerDigits.textContent = tel.timerUnlimited ? '∞' : '--.-s';
        this.els.hudTimerFill.style.width = '100%';
      } else if (tel.timerUnlimited) {
        this.els.hudTimerDigits.textContent = '∞';
        this.els.hudTimerFill.style.width = '100%';
      }
    }

    /**
     * Load location background (`assets/media/backgrounds/*.png`) if present on disk;
     * otherwise preserve procedural CSS terminal background (grid, vignette & neon frames).
     */
    _applyScenarioBackground(scenario, token) {
      const bgPath = scenario && scenario.background ? scenario.background.trim() : '';
      if (bgPath === this._currentBgPath) return;
      this._currentBgPath = bgPath;

      if (!bgPath) {
        this.els.bgImage.classList.add('hidden');
        this.els.bgImage.removeAttribute('src');
        return;
      }

      // Keep procedural CSS terminal background visible unless/until raster file is verified
      this.els.bgImage.classList.add('hidden');

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
     */
    _applyCharacterSprite(scenario, emotionKey, emotionChanged, token) {
      const spritePath = scenario && scenario.sprite ? scenario.sprite.trim() : '';
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
        if (this.els.charSprite.getAttribute('src') !== spritePath) {
          this.els.charSprite.src = spritePath;
        }
        triggerSwapAnim();
        return;
      }

      // Immediately guarantee visible silhouette while probing physical file
      this.els.charSprite.setAttribute('data-render-mode', 'svg-fallback');
      this.els.charSprite.src = fallbackSvgSrc;
      triggerSwapAnim();

      if (spritePath && !this._mediaAvailabilityCache.has(spritePath)) {
        this._probeImageAsset(spritePath).then((exists) => {
          if (token !== this._sceneRenderToken) return;
          if (exists) {
            this.els.charSprite.setAttribute('data-render-mode', 'raster');
            this.els.charSprite.src = spritePath;
          }
        });
      }
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
        this._sceneRenderToken += 1;
      }

      const token = this._sceneRenderToken;

      // 1. Background layer (raster location or procedural CSS terminal fallback)
      this._applyScenarioBackground(scenario, token);

      // 2. Character layer (transparent raster PNG/WebP or procedural vector SVG silhouette)
      const emotionKey = line.emotion || 'panic';
      const emotionChanged = scenarioChanged || this._currentEmotionKey !== emotionKey;
      this._currentEmotionKey = emotionKey;
      this._applyCharacterSprite(scenario, emotionKey, emotionChanged, token);

      // 3. Climax camera zoom-in
      const isClimax = Boolean(line.climax);
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
      this._twIsTyping = true;
      this.els.dlgText.textContent = '';

      this._twTimer = setInterval(() => {
        if (this.engine.isPaused() || this._backlogOpen || this._settingsOpen) {
          return;
        }
        this._twIndex += 1;
        this.els.dlgText.textContent = this._twFullText.slice(0, this._twIndex);

        const ch = this._twFullText[this._twIndex - 1];
        if (ch && ch.trim().length > 0) {
          this.engine.audio.playTypeBlip(this._twIndex);
        }

        if (this._twIndex >= this._twFullText.length) {
          this._stopTypewriter();
        }
      }, 22);
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
      this.els.verdictCrisisWrap.classList.toggle('hidden', timerUnlimited);
      this.els.verdictCrisisFill.style.width = '100%';

      if (!timerUnlimited) {
        const startSec = this.engine.getTelemetry().timerRemainingSec;
        this.els.hudTimerDigits.textContent = `${startSec.toFixed(1)}s`;
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

        if (diffCfg.show_axes_on_options) {
          mainLabel.textContent = `[${opt.function_code}] ${this.i18n.localizeField(opt.text)}`;
        } else {
          // Mindhunter Mode: bare function code/label only
          mainLabel.textContent = this.i18n.getBareFunctionLabel(opt.function_code);
        }

        topLine.appendChild(hotkey);
        topLine.appendChild(mainLabel);
        btn.appendChild(topLine);

        if (diffCfg.show_axes_on_options) {
          const axesLine = document.createElement('div');
          axesLine.className = 'plate-axes-sub';
          axesLine.textContent = `[${opt.function_code}: ${this.i18n.localizeField(opt.axes)}]`;
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

    _updateTimerUI({ remaining, ratio, isCritical }) {
      const pct = `${Math.max(0, Math.min(100, ratio * 100)).toFixed(2)}%`;
      this.els.hudTimerDigits.textContent = `${remaining.toFixed(1)}s`;
      this.els.hudTimerFill.style.width = pct;
      this.els.verdictCrisisFill.style.width = pct;

      this.els.hudTimerModule.classList.toggle('timer-critical', isCritical);
      this.els.dangerOverlay.classList.toggle('critical-active', isCritical);
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

      // Chosen vs True Function
      if (isTimeout) {
        this.els.verdictChosenVal.textContent = this.i18n.t('verdict_timeout_value');
      } else if (chosenOption) {
        this.els.verdictChosenVal.textContent = `[${chosenOption.function_code}] ${this.i18n.localizeField(chosenOption.text)}`;
      }

      if (correctOption) {
        this.els.verdictCorrectVal.textContent = `[${correctOption.function_code}] ${this.i18n.localizeField(correctOption.text)}`;
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
        ? `[${verdict.correctOption.function_code}] ${this.i18n.localizeField(verdict.correctOption.axes)}`
        : '—';
      this.els.sumValScore.textContent = `${tel.score} (+${verdict.pointsEarned})`;
      this.els.sumValAccuracy.textContent = `${tel.accuracy}%`;
      this.els.sumValTime.textContent =
        verdict.remainingTimeSec === null ? '∞' : `${verdict.remainingTimeSec.toFixed(1)}s`;

      this.els.sumExplanation.textContent = verdict.correctOption
        ? this.i18n.localizeField(verdict.correctOption.explanation)
        : '';

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
            <div class="tut-card-kicker"></div>
            <h3 class="tut-card-title"></h3>
            <p class="tut-card-desc"></p>
            <div class="tut-card-markers"></div>
          `;
          card.querySelector('.tut-card-kicker').textContent = item.code;
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
        quoteBox.textContent = tut.sim_quote;

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
          lbl.textContent = `[${simOpt.code}] ${simOpt.label}`;

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
     * Backlog Modal (History of Current & Past Cases)
     */
    toggleBacklogModal() {
      if (this._backlogOpen) {
        this.closeBacklogModal();
      } else {
        this.openBacklogModal();
      }
    }

    openBacklogModal() {
      this._backlogOpen = true;
      this.engine.setPaused(true);
      this.engine.audio.playHoverTick();
      this._renderBacklogContents();
      this.els.modalBacklog.classList.remove('hidden');
    }

    closeBacklogModal() {
      this._backlogOpen = false;
      this.els.modalBacklog.classList.add('hidden');
      this.engine.audio.playHoverTick();
      if (!this._settingsOpen) {
        this.engine.setPaused(false);
      }
    }

    _renderBacklogContents() {
      const archive = this.engine.getBacklogArchive();
      this.els.backlogBody.innerHTML = '';

      if (archive.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'tut-lead-text';
        empty.textContent = this.i18n.t('backlog_empty');
        this.els.backlogBody.appendChild(empty);
        return;
      }

      archive.forEach((group) => {
        const section = document.createElement('div');
        section.className = 'backlog-case-group';

        const header = document.createElement('div');
        header.className = 'backlog-case-header';
        const tag = group.isCurrent ? this.i18n.t('backlog_current_tag') : this.i18n.t('backlog_past_tag');
        header.textContent = `[${tag}] // ${group.caseTitle}`;
        section.appendChild(header);

        group.entries.forEach((item) => {
          const row = document.createElement('div');
          row.className = `backlog-entry${item.climax ? ' entry-climax' : ''}`;

          const sp = document.createElement('div');
          sp.className = 'backlog-speaker';
          sp.textContent = item.speaker;

          const tx = document.createElement('div');
          tx.className = 'backlog-line-text';
          tx.textContent = item.text;

          row.appendChild(sp);
          row.appendChild(tx);
          section.appendChild(row);
        });

        this.els.backlogBody.appendChild(section);
      });
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
      this.renderSettingsState();
      this.els.modalSettings.classList.remove('hidden');
    }

    closeSettingsModal() {
      this._settingsOpen = false;
      this.els.modalSettings.classList.add('hidden');
      this.engine.audio.playHoverTick();
      if (!this._backlogOpen) {
        this.engine.setPaused(false);
      }
    }

    renderSettingsState() {
      const profile = this.engine.getProfile();
      const state = this.engine.getState();
      const S = this.engine.STATES;

      this.els.btnAudioToggle.textContent = profile.audioEnabled
        ? this.i18n.t('settings_audio_on')
        : this.i18n.t('settings_audio_off');
      this.els.btnAudioToggle.classList.toggle('active', profile.audioEnabled);

      this.els.btnScoutTimerToggle.textContent = profile.scoutUnlimitedTimer
        ? this.i18n.t('settings_scout_off')
        : this.i18n.t('settings_scout_30s');
      this.els.btnScoutTimerToggle.classList.toggle('active', !profile.scoutUnlimitedTimer);

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

      if (this._backlogOpen) {
        this._renderBacklogContents();
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const ui = new PsychoUIController(global.PsychoEngine, global.PsychoI18n);
    global.PsychoUI = ui;
    ui.init();
  });
})(window);
