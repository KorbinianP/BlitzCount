// Number Keypad component arranged like a standard Numpad
// Top: 10, 11, 12, then 7-8-9, then 4-5-6, then 1-2-3, Bottom: 0 (3-wide)

import { playTap } from '../audio.js';

export function renderKeypad(container, { onSelectNumber, isEnabled = true }) {
  container.innerHTML = `
    <div class="keypad-container ${!isEnabled ? 'is-disabled' : ''}">
      <div class="keypad-numpad-grid">
        <!-- Top Row: 10, 11, 12 -->
        <button class="keypad-num-btn num-10" data-num="10" ${!isEnabled ? 'disabled' : ''}>
          <span class="num-text">10</span>
        </button>
        <button class="keypad-num-btn num-11" data-num="11" ${!isEnabled ? 'disabled' : ''}>
          <span class="num-text">11</span>
        </button>
        <button class="keypad-num-btn num-12" data-num="12" ${!isEnabled ? 'disabled' : ''}>
          <span class="num-text">12</span>
        </button>

        <!-- Row 2: 7, 8, 9 -->
        <button class="keypad-num-btn num-7" data-num="7" ${!isEnabled ? 'disabled' : ''}>
          <span class="num-text">7</span>
        </button>
        <button class="keypad-num-btn num-8" data-num="8" ${!isEnabled ? 'disabled' : ''}>
          <span class="num-text">8</span>
        </button>
        <button class="keypad-num-btn num-9" data-num="9" ${!isEnabled ? 'disabled' : ''}>
          <span class="num-text">9</span>
        </button>

        <!-- Row 3: 4, 5, 6 -->
        <button class="keypad-num-btn num-4" data-num="4" ${!isEnabled ? 'disabled' : ''}>
          <span class="num-text">4</span>
        </button>
        <button class="keypad-num-btn num-5" data-num="5" ${!isEnabled ? 'disabled' : ''}>
          <span class="num-text">5</span>
        </button>
        <button class="keypad-num-btn num-6" data-num="6" ${!isEnabled ? 'disabled' : ''}>
          <span class="num-text">6</span>
        </button>

        <!-- Row 4: 1, 2, 3 -->
        <button class="keypad-num-btn num-1" data-num="1" ${!isEnabled ? 'disabled' : ''}>
          <span class="num-text">1</span>
        </button>
        <button class="keypad-num-btn num-2" data-num="2" ${!isEnabled ? 'disabled' : ''}>
          <span class="num-text">2</span>
        </button>
        <button class="keypad-num-btn num-3" data-num="3" ${!isEnabled ? 'disabled' : ''}>
          <span class="num-text">3</span>
        </button>

        <!-- Bottom Row: 0 (3-wide) -->
        <button class="keypad-num-btn num-0 span-3" data-num="0" ${!isEnabled ? 'disabled' : ''}>
          <span class="zero-fists-icon">✊✊</span>
          <span class="num-text">0</span>
        </button>
      </div>
    </div>
  `;

  const buttons = container.querySelectorAll('.keypad-num-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!isEnabled) return;
      playTap();
      const num = parseInt(btn.getAttribute('data-num'), 10);
      btn.classList.add('key-pressed');
      setTimeout(() => btn.classList.remove('key-pressed'), 180);
      onSelectNumber(num);
    });
  });
}
