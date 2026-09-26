// Main Application Controller for BlitzCount

import { getState, subscribe } from './state.js';
import { setLanguage as setI18nLanguage } from './i18n.js';
import { setMuted } from './audio.js';
import { renderHeader } from './components/header.js';
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

    this.init();
  }

  init() {
    this.refreshHeader();
    this.renderCurrentView();

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch((err) => {
          console.log('SW registration note:', err);
        });
      });
    }
  }

  refreshHeader() {
    renderHeader(this.headerMount, {
      onOpenProfiles: () => this.handleOpenProfiles(),
      onOpenSettings: () => this.handleOpenSettings(),
      onOpenTrophies: () => this.handleOpenTrophies(),
      onGoHome: () => this.goToHome()
    });
  }

  renderCurrentView() {
    this.mainMount.innerHTML = '';

    if (this.currentView === 'home') {
      renderHomeScreen(this.mainMount, {
        onStartGame: () => this.startGame()
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
        this.refreshHeader();
        if (this.currentView === 'home') {
          this.renderCurrentView();
        }
      }
    });
  }

  handleOpenTrophies() {
    openTrophyModal(this.modalMount);
  }

  handleOpenSettings() {
    openSettingsModal(this.modalMount, {
      onSettingsChanged: () => {
        this.refreshHeader();
        this.renderCurrentView();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new BlitzCountApp();
});
