// Main Application Controller for BlitzCount

import { getState, subscribe } from './state.js';
import { setLanguage as setI18nLanguage, t } from './i18n.js';
import { setMuted, playTap } from './audio.js';
import { renderCounti } from './mascot.js';
import { renderHomeScreen } from './components/homeScreen.js';
import { renderGameScreen } from './components/gameScreen.js';
import { renderResultScreen } from './components/resultScreen.js';
import { openProfileModal } from './components/profileModal.js';
import { openTrophyModal } from './components/trophyModal.js';
import { openSettingsModal } from './components/settingsModal.js';

class BlitzCountApp {
  constructor() {
    this.headerMount = document.getElementById('header-mount');
    this.mainMount = document.getElementById('main-mount');
    this.modalMount = document.getElementById('modal-mount');

    this.currentView = 'home';
    this.lastResult = null;
    this.activeGameInstance = null;

    const state = getState();
    setI18nLanguage(state.language || 'de');
    setMuted(!state.soundEnabled);

    subscribe((newState) => {
      setI18nLanguage(newState.language || 'de');
      setMuted(!newState.soundEnabled);
      this.refreshHeader();
    });

    // Expose back navigation handler to Android WebView native bridge
    window.handleAndroidBack = () => this.handleBackPress();

    this.init();
  }

  init() {
    this.renderCurrentView();

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch((err) => {
          console.log('SW registration note:', err);
        });
      });
    }

    // Support browser / PWA back button via popstate
    window.addEventListener('popstate', () => {
      this.handleBackPress();
    });
  }

  handleBackPress() {
    // 1. If any modal is currently displayed (ProfileModal, SettingsModal, TrophyModal)
    if (this.modalMount && this.modalMount.firstElementChild) {
      const subCancel = this.modalMount.querySelector('#btn-confirm-cancel, #btn-cancel-edit-player, #btn-cancel-edit');
      if (subCancel) {
        subCancel.click();
        return true;
      }
      const closeBtn = this.modalMount.querySelector('#btn-close-modal, .modal-close-btn');
      if (closeBtn) {
        closeBtn.click();
      } else {
        this.modalMount.innerHTML = '';
      }
      return true;
    }

    // 2. If the exit confirmation dialog is already open, pressing back again confirms exit
    const exitDialog = document.getElementById('exit-confirm-dialog');
    if (exitDialog) {
      exitDialog.remove();
      if (window.AndroidBridge && window.AndroidBridge.exitApp) {
        window.AndroidBridge.exitApp();
      }
      return false; // tell Android callback to finish activity if bridge not present
    }

    // 3. If currently playing a game or viewing results -> return to home menu
    if (this.currentView === 'game' || this.currentView === 'result') {
      this.goToHome();
      return true;
    }

    // 4. In Home menu: show child-friendly exit confirmation dialog
    this.showExitConfirmDialog();
    return true;
  }

  showExitConfirmDialog() {
    const existing = document.getElementById('exit-confirm-dialog');
    if (existing) return;

    playTap();
    const dialog = document.createElement('div');
    dialog.className = 'confirm-dialog-overlay';
    dialog.id = 'exit-confirm-dialog';

    dialog.innerHTML = `
      <div class="confirm-dialog-card exit-dialog-card">
        <div class="confirm-mascot">
          ${renderCounti('idle', 95)}
        </div>
        <h3 class="confirm-title">${t('exitDialog.title')}</h3>
        <p class="confirm-desc">${t('exitDialog.desc')}</p>
        <div class="confirm-actions">
          <button class="confirm-btn-cancel" id="btn-exit-cancel">
            ${t('exitDialog.keepPlaying')}
          </button>
          <button class="confirm-btn-action btn-exit" id="btn-exit-confirm">
            ${t('exitDialog.exit')}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(dialog);

    dialog.querySelector('#btn-exit-cancel').addEventListener('click', () => {
      playTap();
      dialog.remove();
    });

    dialog.querySelector('#btn-exit-confirm').addEventListener('click', () => {
      playTap();
      dialog.remove();
      if (window.AndroidBridge && window.AndroidBridge.exitApp) {
        window.AndroidBridge.exitApp();
      } else {
        window.close();
      }
    });

    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) {
        dialog.remove();
      }
    });
  }

  refreshHeader() {
    if (this.headerMount) {
      this.headerMount.style.display = 'none';
      this.headerMount.innerHTML = '';
    }
  }

  renderCurrentView() {
    this.refreshHeader();
    this.mainMount.innerHTML = '';

    if (this.currentView === 'home') {
      renderHomeScreen(this.mainMount, {
        onStartGame: () => this.startGame(),
        onOpenProfiles: () => this.handleOpenProfiles(),
        onOpenSettings: () => this.handleOpenSettings(),
        onOpenTrophies: () => this.handleOpenTrophies()
      });
    } else if (this.currentView === 'game') {
      this.activeGameInstance = renderGameScreen(this.mainMount, {
        onGameFinished: (resultData) => this.handleGameFinished(resultData),
        onExitGame: () => this.goToHome()
      });
    } else if (this.currentView === 'result') {
      renderResultScreen(this.mainMount, {
        ...this.lastResult,
        onReplay: () => this.startGame(),
        onHome: () => this.goToHome()
      });
    }
  }

  startGame() {
    if (this.activeGameInstance && this.activeGameInstance.destroy) {
      this.activeGameInstance.destroy();
    }
    this.currentView = 'game';
    this.renderCurrentView();
  }

  handleGameFinished(resultData) {
    this.lastResult = resultData;
    this.currentView = 'result';
    this.renderCurrentView();
  }

  goToHome() {
    if (this.activeGameInstance && this.activeGameInstance.destroy) {
      this.activeGameInstance.destroy();
    }
    this.currentView = 'home';
    this.renderCurrentView();
  }

  handleOpenProfiles() {
    openProfileModal(this.modalMount, {
      onProfileChanged: () => {
        this.renderCurrentView();
      }
    });
  }

  handleOpenTrophies() {
    openTrophyModal(this.modalMount);
  }

  handleOpenSettings() {
    openSettingsModal(this.modalMount, {
      onSettingsChanged: () => {
        this.renderCurrentView();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new BlitzCountApp();
});
