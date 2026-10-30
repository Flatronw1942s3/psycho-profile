/**
 * PSYCHO-PROFILE // ANALYZER
 * Steam Achievements Adapter (achievements.js)
 *
 * Architectural bridge providing seamless `unlockAchievement(id)` across:
 * 1. Electron + steamworks.js (preload bridge or direct client)
 * 2. Electron + Greenworks
 * 3. Standalone Web / Dev / Test mode (console telemetry + local persistence + UI toast event)
 */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'psycho_profile_achievements_v1';

  const ACHIEVEMENT_REGISTRY = Object.freeze({
    FIRST_BREAKTHROUGH: {
      id: 'FIRST_BREAKTHROUGH',
      icon: '◆',
      code: 'ACH_01'
    },
    MINDHUNTER_MASTERY: {
      id: 'MINDHUNTER_MASTERY',
      icon: '◈',
      code: 'ACH_02'
    },
    WILL_STUPOR: {
      id: 'WILL_STUPOR',
      icon: '▲',
      code: 'ACH_03'
    },
    THEORY_INITIATE: {
      id: 'THEORY_INITIATE',
      icon: '❖',
      code: 'ACH_04'
    },
    FULL_DOSSIER_CLEAR: {
      id: 'FULL_DOSSIER_CLEAR',
      icon: '★',
      code: 'ACH_05'
    }
  });

  class SteamAchievementsAdapter {
    constructor() {
      this._unlocked = new Set();
      this._backend = 'web-console';
      this._steamClient = null;
      this._loadLocalCache();
      this._detectBackend();
    }

    _loadLocalCache() {
      try {
        const raw = global.localStorage ? global.localStorage.getItem(STORAGE_KEY) : null;
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            parsed.forEach((id) => this._unlocked.add(String(id)));
          }
        }
      } catch (_) {
        // Ignore storage restrictions in sandboxed environments
      }
    }

    _saveLocalCache() {
      try {
        if (global.localStorage) {
          global.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(this._unlocked)));
        }
      } catch (_) {
        // Ignore storage restrictions
      }
    }

    _detectBackend() {
      // 1. Electron preload IPC bridge for steamworks.js / Greenworks
      if (global.electronAPI && typeof global.electronAPI.unlockAchievement === 'function') {
        this._backend = 'electron-ipc-steamworks';
        this._steamClient = global.electronAPI;
        return;
      }

      // 2. Direct window.steamworks (steamworks.js)
      if (global.steamworks && global.steamworks.achievement && typeof global.steamworks.achievement.activate === 'function') {
        this._backend = 'steamworks.js';
        this._steamClient = global.steamworks;
        return;
      }

      // 3. Direct window.greenworks or CommonJS require('greenworks') in Electron renderer
      if (global.greenworks && typeof global.greenworks.activateAchievement === 'function') {
        this._backend = 'greenworks';
        this._steamClient = global.greenworks;
        return;
      }

      if (typeof global.require === 'function') {
        try {
          const sw = global.require('steamworks.js');
          if (sw && sw.init) {
            const client = sw.init();
            if (client && client.achievement) {
              this._backend = 'steamworks.js-node';
              this._steamClient = client;
              return;
            }
          }
        } catch (_) {
          // steamworks.js not present, check greenworks
        }

        try {
          const gw = global.require('greenworks');
          if (gw && typeof gw.init === 'function' && gw.init()) {
            this._backend = 'greenworks-node';
            this._steamClient = gw;
            return;
          }
        } catch (_) {
          // Fallback to web-console mode
        }
      }

      this._backend = 'web-console';
    }

    /**
     * Universal method to unlock an achievement by ID.
     * Logs in web/test mode and calls Steamworks/Greenworks transparently in Electron.
     * @param {string} id - Canonical Steam Achievement API name
     * @returns {boolean} True if newly unlocked (or triggered), false if invalid id
     */
    unlockAchievement(id) {
      if (!id || typeof id !== 'string') {
        return false;
      }

      const normalizedId = id.trim();
      const alreadyUnlocked = this._unlocked.has(normalizedId);

      // Always log in Web / Test mode and keep diagnostic trace consistent
      if (this._backend === 'web-console') {
        console.log('[Achievement Unlocked]:', normalizedId);
      } else {
        this._dispatchToSteamworks(normalizedId);
      }

      this._unlocked.add(normalizedId);
      this._saveLocalCache();

      if (!alreadyUnlocked && typeof global.CustomEvent === 'function' && global.dispatchEvent) {
        const meta = ACHIEVEMENT_REGISTRY[normalizedId] || { id: normalizedId, icon: '◆', code: 'STEAM' };
        global.dispatchEvent(
          new global.CustomEvent('psycho:achievement-unlocked', {
            detail: {
              id: normalizedId,
              icon: meta.icon,
              code: meta.code,
              backend: this._backend
            }
          })
        );
      }

      return true;
    }

    _dispatchToSteamworks(id) {
      try {
        if (this._backend === 'electron-ipc-steamworks') {
          this._steamClient.unlockAchievement(id);
        } else if (this._backend === 'steamworks.js' || this._backend === 'steamworks.js-node') {
          this._steamClient.achievement.activate(id);
        } else if (this._backend === 'greenworks' || this._backend === 'greenworks-node') {
          this._steamClient.activateAchievement(
            id,
            () => {},
            (err) => console.warn('[SteamAchievementsAdapter] Greenworks error:', err)
          );
        }
      } catch (err) {
        console.warn('[SteamAchievementsAdapter] Native bridge fallback:', err);
        console.log('[Achievement Unlocked]:', id);
      }
    }

    isUnlocked(id) {
      return this._unlocked.has(id);
    }

    getUnlockedList() {
      return Array.from(this._unlocked);
    }

    getBackendName() {
      return this._backend;
    }

    resetLocalAchievements() {
      this._unlocked.clear();
      this._saveLocalCache();
    }
  }

  const adapterInstance = new SteamAchievementsAdapter();

  global.PsychoAchievements = adapterInstance;
  global.unlockAchievement = function (id) {
    return adapterInstance.unlockAchievement(id);
  };
})(window);
