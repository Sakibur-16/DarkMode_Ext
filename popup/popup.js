/**
 * Dark Vision - Popup UI Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // UI Elements
  const masterToggle = document.getElementById('master-toggle');
  const currentDomainEl = document.getElementById('current-domain');
  const btnToggleWhitelist = document.getElementById('btn-toggle-whitelist');
  const whitelistBtnText = document.getElementById('whitelist-btn-text');
  const themeCards = document.querySelectorAll('.theme-card');
  const sliderBrightness = document.getElementById('brightness');
  const sliderContrast = document.getElementById('contrast');
  const sliderSepia = document.getElementById('sepia');
  const valBrightness = document.getElementById('val-brightness');
  const valContrast = document.getElementById('val-contrast');
  const valSepia = document.getElementById('val-sepia');
  const autoSystemToggle = document.getElementById('auto-system-toggle');
  const btnReset = document.getElementById('btn-reset');

  let currentDomain = '';

  const DEFAULT_SETTINGS = {
    enabled: true,
    theme: 'midnight',
    brightness: 100,
    contrast: 100,
    sepia: 0,
    autoSystem: false,
    whitelistedDomains: []
  };

  // 1. Detect Active Tab Domain
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs[0] && tabs[0].url) {
      try {
        const url = new URL(tabs[0].url);
        if (url.protocol.startsWith('http')) {
          currentDomain = url.hostname;
          currentDomainEl.textContent = currentDomain;
        } else {
          currentDomainEl.textContent = 'Browser Internal Page';
          btnToggleWhitelist.disabled = true;
          btnToggleWhitelist.style.opacity = '0.5';
        }
      } catch (e) {
        currentDomainEl.textContent = 'Unknown Page';
      }
    } else {
      currentDomainEl.textContent = 'Unknown Page';
    }

    // Load initial settings
    loadSettings();
  });

  // 2. Load and Apply Settings to UI
  function loadSettings() {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (stored) => {
      masterToggle.checked = stored.enabled;
      autoSystemToggle.checked = stored.autoSystem;

      // Sliders
      sliderBrightness.value = stored.brightness;
      valBrightness.textContent = stored.brightness + '%';

      sliderContrast.value = stored.contrast;
      valContrast.textContent = stored.contrast + '%';

      sliderSepia.value = stored.sepia;
      valSepia.textContent = stored.sepia + '%';

      // Theme Preset selection
      themeCards.forEach((card) => {
        if (card.dataset.theme === stored.theme) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });

      // Whitelist Status
      updateWhitelistUI(stored.whitelistedDomains || []);
    });
  }

  // 3. Update Whitelist Button UI
  function updateWhitelistUI(whitelistedDomains) {
    if (!currentDomain || currentDomainEl.textContent.includes('Internal')) return;

    const isWhitelisted = whitelistedDomains.includes(currentDomain);
    if (isWhitelisted) {
      btnToggleWhitelist.classList.add('active');
      whitelistBtnText.textContent = 'Disabled on this site (Click to Enable)';
    } else {
      btnToggleWhitelist.classList.remove('active');
      whitelistBtnText.textContent = 'Disable on this site';
    }
  }

  // 4. Event Listeners

  // Master Toggle
  masterToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ enabled: masterToggle.checked });
  });

  // Whitelist Toggle
  btnToggleWhitelist.addEventListener('click', () => {
    if (!currentDomain) return;

    chrome.storage.sync.get(['whitelistedDomains'], (res) => {
      let list = res.whitelistedDomains || [];
      if (list.includes(currentDomain)) {
        list = list.filter((d) => d !== currentDomain);
      } else {
        list.push(currentDomain);
      }
      chrome.storage.sync.set({ whitelistedDomains: list }, () => {
        updateWhitelistUI(list);
      });
    });
  });

  // Theme Cards
  themeCards.forEach((card) => {
    card.addEventListener('click', () => {
      themeCards.forEach((c) => c.classList.remove('active'));
      card.classList.add('active');
      const selectedTheme = card.dataset.theme;
      chrome.storage.sync.set({ theme: selectedTheme });
    });
  });

  // Live Slider Handlers
  function handleSliderInput(slider, labelEl, key) {
    labelEl.textContent = slider.value + '%';
    const obj = {};
    obj[key] = parseInt(slider.value, 10);
    chrome.storage.sync.set(obj);
  }

  sliderBrightness.addEventListener('input', () => {
    handleSliderInput(sliderBrightness, valBrightness, 'brightness');
  });

  sliderContrast.addEventListener('input', () => {
    handleSliderInput(sliderContrast, valContrast, 'contrast');
  });

  sliderSepia.addEventListener('input', () => {
    handleSliderInput(sliderSepia, valSepia, 'sepia');
  });

  // Auto System Toggle
  autoSystemToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ autoSystem: autoSystemToggle.checked });
  });

  // Reset Defaults Button
  btnReset.addEventListener('click', () => {
    chrome.storage.sync.set(DEFAULT_SETTINGS, () => {
      loadSettings();
    });
  });
});
