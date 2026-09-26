<p align="center">
  <img src="assets/counti.svg" width="160" height="160" alt="Counti the Kawaii Capybara">
  <br>
  <b>Meet Counti the Capybara! 🍊</b>
</p>

# BlitzCount / ZählFix

**BlitzCount** (English) / **ZählFix** (Deutsch) is an offline, kid-friendly web app designed for children aged 4–8 to build rapid visual number recognition (**subitizing**) from **0 to 12**.

Featuring **Counti**, the cute kawaii Capybara mascot! ✨

---

## 🎮 Play Live on GitHub Pages

You can play **BlitzCount / ZählFix** directly in your browser or install it as an offline app:

> **Live Demo**: [https://korbinianp.github.io/BlitzCount/](https://korbinianp.github.io/BlitzCount/)

### 📱 Installing on an Android Tablet or Phone (PWA)
1. Open the URL in Google Chrome (or any modern mobile browser).
2. Tap the browser menu (⋮) and select **"Install App"** or **"Add to Home screen"**.
3. BlitzCount installs with its orange icon (`🍊`) and launches full-screen like a native app.
4. **100% Offline**: Once loaded, it works entirely offline with zero network connection needed!

---

## 🌟 Key Features

* **Zero-Text / Non-Reader Friendly**:
  * Designed specifically so 4-year-olds can play independently without needing to read words.
  * Difficulty is chosen through friendly animal speed metaphors:
    * 🐢 **Turtle**: 2.5s flash (Relaxed / Gemütlich)
    * 🐇 **Bunny**: 1.2s flash (Medium / Normal)
    * 🐆 **Cheetah**: 0.6s flash (Fast / Schnell)
    * 🚀 **Rocket**: 0.3s flash + 3s keypad countdown (Master / Rakete)
  * Big glowing ▶️ Play button, clear keypad, and star progress bubbles.
* **Pedagogical Grouping (Numbers 0 to 12)**:
  * 🍓 **Fruits (3x3 Dice Pattern Layout)**:
    * Arranged cleanly like points on a dice without distracting boxes.
    * 1 to 6 in a single die formation.
    * 7 to 12 in realistic two-dice formations (e.g. 6 + 4 = 10, 6 + 5 = 11, 6 + 6 = 12).
    * Strictly numbers 1 to 12.
  * 🎲 **High-Contrast 3x3 Dice Cards**:
    * 1 to 6 on a single die card with large colorful pips.
    * 7 to 12 across two dice for authentic mental addition.
    * Strictly numbers 1 to 12.
  * 🖐️ **Fingers Mode (0 to 10)**:
    * Anchored on the pedagogical ten-frame (two hands).
    * 0 represented by both hands showing closed fists (`✊ ✊`).
    * 1 to 5 on one hand, 6 to 10 across two hands.
    * Unambiguous 4-finger hand with all 4 fingers straight up and thumb tucked across palm.
  * 🔀 **Mixed Mode**:
    * Random variety mix of fruits, dice, and hands.
* **Instant Input During Flash**:
  * Kids can tap their answer immediately while the picture is visible—no need to wait for the timer to run out!
* **Symmetrical Keypad Layout**:
  * Standard phone/calculator numpad arrangement:
    * `[ 10 ] [ 11 ] [ 12 ]` (Top row)
    * `[  7 ] [  8 ] [  9 ]`
    * `[  4 ] [  5 ] [  6 ]`
    * `[  1 ] [  2 ] [  3 ]`
    * `[      0 ✊ ✊      ]` (Bottom row, full width)
* **Counti the Kawaii Capybara Mascot**:
  * Pure original vector mascot with cheerful expressions:
    * **Idle**: Calm, zen gaze with an onsen yuzu orange on head.
    * **Cheer**: Jumping with joy, sparkles, and raised paws upon correct answers.
    * **Encourage**: Gentle learning review when an answer is missed.
    * **Victory**: Striped festive party hat and gold medal celebration!
* **100% Procedural Audio (Web Audio API)**:
  * Zero audio files to download or stream.
  * Instant, zero-latency bubble pops, joyful glockenspiel chimes (C-E-G-C), gentle boings, and brass victory fanfares synthesized mathematically in code.
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

## 🚀 Local Development

In the project directory, run:
```bash
python3 server.py
```

This launches the local server:
```
============================================================
 🍊  BlitzCount / ZählFix (Counti the Capybara) is ready!
============================================================
 ▶  On this computer:              http://localhost:8000
 📱 On your Tablet/Phone (Wi-Fi):  http://192.168.x.x:8000
============================================================
```

---

## 🛠 Project Structure

```
sumarize/
├── .github/
│   └── workflows/
│       └── deploy.yml      # Automatic GitHub Pages deployment workflow
├── assets/
│   └── counti.svg          # Standalone Counti the Capybara vector mascot
├── index.html              # HTML5 entrypoint & PWA metadata
├── manifest.webmanifest    # Standalone PWA declaration
├── sw.js                   # Service Worker for offline caching
├── server.py               # Local LAN dev & Wi-Fi server
├── LICENSE                 # MIT License
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
    ├── stimuli.js          # Fruits (1-12), dice (1-12), hands (0-10)
    └── components/
        ├── header.js       # Top bar, profile avatar, 3s child-locked settings
        ├── homeScreen.js   # Main view, speeds (🐢🐇🐆🚀), category tabs
        ├── gameScreen.js   # Flash timer, stage, feedback & keypad
        ├── keypad.js       # Chunky 0-12 buttons with 3D press feel
        ├── resultScreen.js # Medals (🥇🥈🥉), confetti & fanfare
        ├── profileModal.js # Animal avatar picker for multi-user profiles
        ├── trophyModal.js  # Trophy Room & shared Hall of Fame
        └── settingsModal.js# Parent fine-tuning sliders & language toggle
```

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

- **Direction & Concept**: Korbinian Probst
- **Code & Architecture**: Antigravity
- Mascot (**Counti**) is 100% original inline SVG vector code licensed under the same MIT license.
