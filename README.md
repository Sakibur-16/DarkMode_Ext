# Dark Vision - Universal Dark Mode Browser Extension 🌙

> **Manifest V3** compliant browser extension designed for personal use and educational GitHub sharing. Automatically converts any website into a comfortable, customized dark theme with real-time controls, theme presets, and domain whitelisting.

![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Browser Support](https://img.shields.io/badge/browsers-Chrome%20%7C%20Edge%20%7C%20Brave%20%7C%20Firefox-orange?style=flat-square)

---

## ✨ Features

- 🌙 **Universal Smart Dark Mode**: Intelligently darkens web pages while preserving images, videos, canvas elements, SVGs, and photos without washing them out.
- 🎨 **4 Modern Theme Presets**:
  - **Midnight Dark**: Modern deep slate blue with vibrant blue accents (default).
  - **Pitch Black**: Pure OLED `#000000` background for maximum energy saving.
  - **Warm Sepia**: Low blue-light warm amber theme for reduced late-night eye strain.
  - **Soft Dark**: Low contrast slate dark theme for comfortable reading.
- 🎛️ **Fine-Tuning Controls**: Real-time Brightness, Contrast, and Sepia sliders with live active tab updates.
- 🚫 **Domain Whitelisting**: Disable dark mode on specific websites with a single click (useful for sites that already have native dark mode like YouTube or GitHub).
- 🔄 **Auto System Preference**: Sync extension state with your Operating System's light/dark mode preference (`prefers-color-scheme`).
- 🖱️ **Context Menu Integration**: Right-click anywhere on a webpage to quickly toggle Dark Vision for that domain.

---

## 📁 Repository & Project Structure

```text
Extension/
├── manifest.json            # Manifest V3 configuration (permissions, scripts, actions)
├── background/
│   └── background.js        # Service Worker (lifecycle, context menus, badge state)
├── content/
│   ├── content.js           # Content Script (dynamic CSS variable injection & storage syncing)
│   └── darkmode.css         # Universal CSS engine (media protection & element styling)
├── popup/
│   ├── popup.html           # Extension Popup UI layout
│   ├── popup.css            # Modern glassmorphic dark interface stylesheet
│   └── popup.js             # Popup controller (DOM events & Chrome Storage API)
├── icons/
│   ├── icon16.png           # Toolbar icon (16x16)
│   ├── icon48.png           # Management icon (48x48)
│   └── icon128.png          # Web Store icon (128x128)
├── .gitignore               # Standard git ignore rules
└── README.md                # Educational documentation & setup guide
```

---

## 🚀 How to Install and Test Locally

Follow these steps to load the unpacked extension in your browser:

### For Google Chrome, Microsoft Edge, Brave, or Opera

1. **Clone or Download** this repository to your computer:
   ```bash
   git clone https://github.com/your-username/dark-vision-extension.git
   ```
2. Open your browser and navigate to the Extensions page:
   - **Chrome**: `chrome://extensions`
   - **Edge**: `edge://extensions`
   - **Brave**: `brave://extensions`
3. Enable **Developer mode** (toggle switch usually located in the top-right corner).
4. Click the **Load unpacked** button.
5. Select the folder containing `manifest.json` (`Extension/`).
6. 🎉 **Done!** The **Dark Vision** moon icon will now appear in your browser extension toolbar!

---

## 🎓 Educational Concepts Highlighted

This project demonstrates core modern browser extension development patterns:

1. **Manifest V3 Architecture**:
   - Uses `background.service_worker` instead of persistent background pages for better browser memory management.
   - Declares granular permissions (`storage`, `activeTab`, `scripting`) and host permissions (`<all_urls>`).
2. **Chrome Storage API (`chrome.storage.sync`)**:
   - Stores user settings across browser instances and syncs theme preferences automatically.
3. **Content Script & CSS Variable Injection**:
   - Injects styles at `document_start` to eliminate white screen flashing.
   - Dynamically modifies CSS custom properties (`--dv-bg-main`, `--dv-brightness`, etc.) on the `:root` element in real time.
4. **Cross-Script Communication**:
   - Synchronizes UI adjustments in `popup.js` with active web page DOMs via `chrome.storage.onChanged`.

---

## 🛠️ How to Publish to Your GitHub Repository

1. Initialize git inside this project directory (if not already initialized):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Dark Vision Manifest V3 Browser Extension"
   ```
2. Create a new public repository on GitHub named `dark-vision-extension`.
3. Link and push your code to GitHub:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/dark-vision-extension.git
   git branch -M main
   git push -u origin main
   ```

---

## 📜 License

Distributed under the **MIT License**. Free to use, modify, and distribute for personal and educational purposes!
