# 🦫 BlitzCount / ZählFix

**BlitzCount** (English) / **ZählFix** (Deutsch) is an offline, kid-friendly app designed for children aged 4–8 to build rapid visual number recognition (**subitizing**) from 0 to 10.

Featuring **Counti the Kawaii Capybara** mascot! 🦫✨

---

## 🌟 Key Features

* **Zero-Text / Non-Reader Friendly**:
  * Designed specifically so 4-year-olds can play independently without needing to read words.
  * Difficulty is chosen through friendly animal speed metaphors:
    * 🐢 **Turtle**: 2.5s flash (Relaxed / Gemütlich)
    * 🐇 **Bunny**: 1.2s flash (Medium / Normal)
    * 🐆 **Cheetah**: 0.6s flash (Fast / Schnell)
    * 🚀 **Rocket**: 0.3s flash + 3s keypad countdown (Master / Rakete)
  * Big glowing ▶️ Play button, clear 0–10 keypad, and star progress bubbles.
* **Smart Pedagogical Grouping**:
  * 🍓 **Fruits (3x3 Dice Pattern Layout & 5+X)**:
    * Arranged like the dots on a dice!
    * Counts 1 to 6 in a classic 3x3 dice formation.
    * Counts 7 to 10 in two dice formations side-by-side (5 on the left + remainder on the right).
    * Strictly numbers 1 to 10 (no zero).
  * 🎲 **High-Contrast 3x3 Dice Cards**:
    * 1 to 6 on a single die card with large colorful pips.
    * 7 to 10 across two dice (e.g. 5 + 3 = 8) for intuitive visual addition.
    * Strictly numbers 1 to 10 (no zero).
  * 🖐️ **Fingers Mode (0 to 10)**:
    * 0 represented by both hands showing closed fists (✊ ✊).
    * 1 to 5 on one hand, 6 to 10 across two hands.
  * 🔀 **Mixed Mode**:
    * Random variety mix of fruits, dice, and hands.
* **Instant Tapping During Flash**:
  * Kids can tap their answer immediately while the picture is visible—no need to wait for the timer to run out!
* **Numpad Layout**:
  * Organized like a standard phone/calculator numpad:
    * `[ 10 ]` (3-wide on top)
    * `[ 7 ] [ 8 ] [ 9 ]`
    * `[ 4 ] [ 5 ] [ 6 ]`
    * `[ 1 ] [ 2 ] [ 3 ]`
    * `[ 0 ]` (3-wide at the bottom)
* **Counti the Kawaii Capybara**:
  * Dynamic vector mascot that cheers with joyful sparkles upon correct answers, offers encouraging learning reveals when an answer is missed, and celebrates with a party hat and gold medal upon winning!
* **100% Procedural Audio (Web Audio API)**:
  * Zero audio files to download or stream.
  * Instant, zero-latency bubble pops, joyful glockenspiel chimes (C-E-G-C), gentle boings, and brass victory fanfares generated in code.
  * Immediate 🔊/🔇 toggle.
* **Profiles & Trophy Room**:
  * Multiple player profiles with animal avatars (🦁, 🦄, 🐶, 🐱, 🐻, 🦊, 🦕, 🐼, 🐸, 🚀).
  * Collect Bronze (🥉), Silver (🥈), and Gold (🥇) medals.
  * Shared Hall of Fame so siblings and parents can play and compare.
* **Parent Settings (with Child-Lock)**:
  * 3-second long press on ⚙️ prevents toddlers from accidentally changing settings.
  * Toggle between German (ZählFix) and English (BlitzCount).
  * Fine-tune flash duration sliders and round counts (5, 10, 20).
* **Privacy & Offline First**:
  * 100% offline via Service Worker.
  * Zero ads, zero tracking, zero third-party telemetry, no cloud accounts. Pure local gaming.

---

## 🚀 Running on Your Computer & Android Tablet/Phone

### Quick Start with Python
In the project directory, run:
```bash
python3 server.py
```

This will launch the local server and display:
```
============================================================
 🦫  BlitzCount / ZählFix (Counti the Capybara) is ready!
============================================================
 ▶  On this computer:              http://localhost:8000
 📱 On your Tablet/Phone (Wi-Fi):  http://192.168.x.x:8000
============================================================
```

### 📱 Installing on an Android Tablet or Phone (PWA)
1. Ensure your tablet or phone is on the same local Wi-Fi.
2. Open Chrome (or any Chromium/Firefox browser) and enter the `http://<your-ip>:8000` address.
3. Tap the browser menu (⋮) and select **"Add to Home screen"** or **"Install App"**.
4. The app will install with its own icon 🦫 and launch full-screen like a native app (without address bar or browser controls).
5. Once loaded once, it works **100% offline** even if the server is stopped!

---

## 🛠 Project Structure

```
sumarize/
├── index.html              # HTML5 entrypoint & PWA metadata
├── manifest.webmanifest    # Standalone PWA declaration
├── sw.js                   # Service Worker for offline caching
├── server.py               # Local LAN dev & Wi-Fi server
├── LICENSE                 # MIT License (Coded by Antigravity, directed by Korbinian Probst)
├── README.md
├── css/
│   └── main.css            # Kid-friendly theme, large buttons, animations
└── js/
    ├── app.js              # Application controller & view routing
    ├── audio.js            # Web Audio API procedural sound synthesizer
    ├── confetti.js         # Particle celebration canvas
    ├── i18n.js             # English & German translations
    ├── mascot.js           # Counti the Kawaii Capybara SVG generator
    ├── state.js            # Reactive state & localStorage persistence
    ├── stimuli.js          # Hungarian 5+X fruits, 3x3 dice cards, hands
    └── components/
        ├── header.js       # Top bar, profile avatar, 3s child-locked settings
        ├── homeScreen.js   # Main view, speeds (🐢🐇🐆🚀), category tabs
        ├── gameScreen.js   # Flash timer, stage, feedback & 0-10 keypad
        ├── keypad.js       # Chunky 0-10 buttons with 3D press feel
        ├── resultScreen.js # Medals (🥇🥈🥉), confetti & fanfare
        ├── profileModal.js # Animal avatar picker for multi-user profiles
        ├── trophyModal.js  # Trophy Room & shared Hall of Fame
        └── settingsModal.js# Parent fine-tuning sliders & language toggle
```

---

## 📄 License

This project is open-source under the [MIT License](file:///home/korbinian/coding/sumarize/LICENSE).

**Direction & Concept**: Korbinian Probst  
**Code & Architecture**: Antigravity  
Mascot (`Counti`) is original inline SVG vector code licensed under the same MIT license.

