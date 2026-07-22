/**
 * Dark Vision - Content Script Engine (Manifest V3)
 */

(function () {
  'use me'

  // Prevent multiple injections
  if (window.__darkVisionInjected) return;
  window.__darkVisionInjected = true;

  const STYLESHEET_ID = 'dark-vision-core-stylesheet';
  const VARS_STYLE_ID = 'dark-vision-vars';

  // Theme Presets Definition
  const THEME_PRESETS = {
    midnight: {
      bgMain: '#121826',
      bgCard: '#1e293b',
      bgInput: '#1e293b',
      bgCode: '#0f172a',
      textMain: '#e2e8f0',
      textCode: '#38bdf8',
      borderColor: 'rgba(255, 255, 255, 0.12)',
      linkColor: '#60a5fa',
      accentColor: '#3b82f6'
    },
    pitch: {
      bgMain: '#000000',
      bgCard: '#111111',
      bgInput: '#181818',
      bgCode: '#050505',
      textMain: '#f8fafc',
      textCode: '#38bdf8',
      borderColor: 'rgba(255, 255, 255, 0.18)',
      linkColor: '#38bdf8',
      accentColor: '#0ea5e9'
    },
    sepia: {
      bgMain: '#1c1917',
      bgCard: '#292524',
      bgInput: '#292524',
      bgCode: '#141210',
      textMain: '#f5e0c3',
      textCode: '#fde047',
      borderColor: 'rgba(255, 237, 213, 0.15)',
      linkColor: '#fbbf24',
      accentColor: '#f59e0b'
    },
    soft: {
      bgMain: '#1e2022',
      bgCard: '#2b2d30',
      bgInput: '#2b2d30',
      bgCode: '#151618',
      textMain: '#d0d7de',
      textCode: '#a5d6ff',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      linkColor: '#79c0ff',
      accentColor: '#58a6ff'
    }
  };

  // Default Configuration
  let currentConfig = {
    enabled: true,
    theme: 'midnight',
    brightness: 100,
    contrast: 100,
    sepia: 0,
    autoSystem: false,
    whitelistedDomains: []
  };

  // Initialize Extension State
  init();

  function init() {
    ensureCSSInjected();

    // Fetch initial configuration from sync storage
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get(currentConfig, (stored) => {
        if (stored) {
          currentConfig = { ...currentConfig, ...stored };
        }
        applyConfig();
      });

      // Listen for configuration changes
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'sync') {
          for (let key in changes) {
            currentConfig[key] = changes[key].newValue;
          }
          applyConfig();
        }
      });
    } else {
      applyConfig();
    }

    // System theme change listener (for auto system sync)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (currentConfig.autoSystem) {
        applyConfig();
      }
    });
  }

  function ensureCSSInjected() {
    if (!document.getElementById(STYLESHEET_ID)) {
      const link = document.createElement('link');
      link.id = STYLESHEET_ID;
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = chrome.runtime.getURL('content/darkmode.css');
      (document.head || document.documentElement).appendChild(link);
    }
  }

  function applyConfig() {
    const currentDomain = window.location.hostname;
    const isWhitelisted = currentConfig.whitelistedDomains && currentConfig.whitelistedDomains.includes(currentDomain);

    // Check system preference if autoSystem is active
    let systemPrefersDark = true;
    if (currentConfig.autoSystem) {
      systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    const shouldEnable = currentConfig.enabled && !isWhitelisted && systemPrefersDark;

    if (!shouldEnable) {
      document.documentElement.removeAttribute('data-dark-vision');
      return;
    }

    // Set active attribute
    document.documentElement.setAttribute('data-dark-vision', 'enabled');

    // Get preset theme values
    const preset = THEME_PRESETS[currentConfig.theme] || THEME_PRESETS.midnight;

    // Inject or update dynamic CSS variables element
    let styleTag = document.getElementById(VARS_STYLE_ID);
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = VARS_STYLE_ID;
      (document.head || document.documentElement).appendChild(styleTag);
    }

    styleTag.textContent = `
      :root[data-dark-vision="enabled"] {
        --dv-bg-main: ${preset.bgMain} !important;
        --dv-bg-card: ${preset.bgCard} !important;
        --dv-bg-input: ${preset.bgInput} !important;
        --dv-bg-code: ${preset.bgCode} !important;
        --dv-text-main: ${preset.textMain} !important;
        --dv-text-code: ${preset.textCode} !important;
        --dv-border-color: ${preset.borderColor} !important;
        --dv-link-color: ${preset.linkColor} !important;
        --dv-accent-color: ${preset.accentColor} !important;
        --dv-brightness: ${currentConfig.brightness}% !important;
        --dv-contrast: ${currentConfig.contrast}% !important;
        --dv-sepia: ${currentConfig.sepia}% !important;
      }
    `;
  }
})();
