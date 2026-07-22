/**
 * Dark Vision - Service Worker Background Script (Manifest V3)
 */

const DEFAULT_SETTINGS = {
  enabled: true,
  theme: 'midnight',
  brightness: 100,
  contrast: 100,
  sepia: 0,
  autoSystem: false,
  whitelistedDomains: []
};

// Extension Lifecycle - Install Event
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.sync.set(DEFAULT_SETTINGS, () => {
      console.log('[Dark Vision] Extension installed and default settings initialized.');
    });
  }

  // Create Context Menu for quick toggling domain
  chrome.contextMenus.create({
    id: 'toggle-site-darkvision',
    title: 'Toggle Dark Vision on this site',
    contexts: ['page']
  });

  updateBadge();
});

// Update Action Badge State
function updateBadge() {
  chrome.storage.sync.get(['enabled'], (data) => {
    const isEnabled = data.enabled !== false;
    chrome.action.setBadgeText({ text: isEnabled ? 'ON' : 'OFF' });
    chrome.action.setBadgeBackgroundColor({
      color: isEnabled ? '#22c55e' : '#64748b'
    });
  });
}

// Listen for Context Menu Clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'toggle-site-darkvision' && tab && tab.url) {
    try {
      const url = new URL(tab.url);
      const domain = url.hostname;
      if (!domain) return;

      chrome.storage.sync.get(['whitelistedDomains'], (res) => {
        let list = res.whitelistedDomains || [];
        if (list.includes(domain)) {
          list = list.filter((d) => d !== domain);
        } else {
          list.push(domain);
        }
        chrome.storage.sync.set({ whitelistedDomains: list });
      });
    } catch (e) {
      console.error('[Dark Vision] Cannot parse domain from URL:', tab.url);
    }
  }
});

// Listen for storage changes to update badge
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.enabled) {
    updateBadge();
  }
});
