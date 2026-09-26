// Top Header Navigation Bar component with Kid Profile, Counti, Sound, Trophies & Child-Locked Settings

import { getState, getActiveProfile, setSoundEnabled, updateSettings } from '../state.js';
import { playTap, toggleMuted, getMuted } from '../audio.js';
import { t } from '../i18n.js';
import { renderCounti } from '../mascot.js';

export function renderHeader(container, { onOpenProfiles, onOpenSettings, onOpenTrophies, onGoHome }) {
  const state = getState();
  const profile = getActiveProfile();
  const muted = getMuted();

  container.innerHTML = `
    <header class="app-header">
      <!-- Player Profile Button (One Tap) -->
      <button class="profile-badge-btn" id="btn-profile" title="${t('profileModal.title')}">
        <span class="avatar-icon">${profile.avatar}</span>
        <span class="profile-name">${profile.name}</span>
      </button>

      <!-- App Logo & Home Link -->
      <div class="header-logo" id="btn-home" role="button" tabindex="0">
        <div class="mini-mascot">${renderCounti('idle', 36)}</div>
        <span class="logo-text">${t('appTitle')}</span>
      </div>

      <!-- Quick Action Controls -->
      <div class="header-actions">
        <!-- Sound Toggle -->
        <button class="icon-action-btn ${muted ? 'is-muted' : ''}" id="btn-sound" title="${t('settings.sound')}">
          <span class="btn-emoji">${muted ? '🔇' : '🔊'}</span>
        </button>

        <!-- Trophy Room -->
        <button class="icon-action-btn trophy-btn" id="btn-trophies" title="${t('trophyRoom.title')}">
          <span class="btn-emoji">🏆</span>
        </button>

        <!-- Settings with 3-second Child Lock -->
        <div class="settings-lock-wrapper">
          <button class="icon-action-btn settings-btn" id="btn-settings" title="${t('settings.childLockHint')}">
            <svg class="lock-ring" viewBox="0 0 44 44">
              <circle class="ring-bg" cx="22" cy="22" r="19" />
              <circle class="ring-fill" id="settings-hold-ring" cx="22" cy="22" r="19" />
            </svg>
            <span class="btn-emoji">⚙️</span>
          </button>
          <div class="child-lock-toast" id="child-lock-toast">
            ${t('settings.childLockHint')}
          </div>
        </div>
      </div>
    </header>
  `;

  // Attach event handlers
  const btnProfile = container.querySelector('#btn-profile');
  btnProfile.addEventListener('click', () => {
    playTap();
    onOpenProfiles();
  });

  const btnHome = container.querySelector('#btn-home');
  btnHome.addEventListener('click', () => {
    playTap();
    onGoHome();
  });

  const btnSound = container.querySelector('#btn-sound');
  btnSound.addEventListener('click', () => {
    const isNowMuted = toggleMuted();
    setSoundEnabled(!isNowMuted);
    playTap();
    btnSound.querySelector('.btn-emoji').textContent = isNowMuted ? '🔇' : '🔊';
    btnSound.classList.toggle('is-muted', isNowMuted);
  });

  const btnTrophies = container.querySelector('#btn-trophies');
  btnTrophies.addEventListener('click', () => {
    playTap();
    onOpenTrophies();
  });

  // Settings Child Lock: Long press 2.5s or prompt
  const btnSettings = container.querySelector('#btn-settings');
  const ringFill = container.querySelector('#settings-hold-ring');
  const toast = container.querySelector('#child-lock-toast');

  let holdTimer = null;
  let holdStart = 0;
  const HOLD_DURATION = 2500;

  function startHold(e) {
    if (e.type === 'touchstart') e.preventDefault();
    holdStart = Date.now();
    btnSettings.classList.add('holding');

    ringFill.style.transition = `stroke-dashoffset ${HOLD_DURATION}ms linear`;
    ringFill.style.strokeDashoffset = '0';

    holdTimer = setTimeout(() => {
      btnSettings.classList.remove('holding');
      ringFill.style.transition = 'none';
      ringFill.style.strokeDashoffset = '120';
      playTap();
      onOpenSettings();
    }, HOLD_DURATION);
  }

  function cancelHold() {
    if (holdTimer) {
      clearTimeout(holdTimer);
      holdTimer = null;
    }
    const elapsed = Date.now() - holdStart;
    btnSettings.classList.remove('holding');
    ringFill.style.transition = 'none';
    ringFill.style.strokeDashoffset = '120';

    if (holdStart > 0 && elapsed < 800) {
      toast.classList.add('visible');
      setTimeout(() => toast.classList.remove('visible'), 2600);
    }
    holdStart = 0;
  }

  btnSettings.addEventListener('mousedown', startHold);
  btnSettings.addEventListener('touchstart', startHold, { passive: false });
  btnSettings.addEventListener('mouseup', cancelHold);
  btnSettings.addEventListener('mouseleave', cancelHold);
  btnSettings.addEventListener('touchend', cancelHold);
}
