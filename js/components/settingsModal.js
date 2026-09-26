// Parent Settings Modal for BlitzCount / ZählFix

import { getState, updateSettings, updateDurations, setLanguage, resetProfileScores, getActiveProfile } from '../state.js';
import { playTap } from '../audio.js';
import { t, setLanguage as setI18nLang } from '../i18n.js';

export function openSettingsModal(modalContainer, { onSettingsChanged }) {
  const profile = getActiveProfile();

  function render() {
    const s = getState();
    modalContainer.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-card settings-modal-card">
          <div class="modal-header">
            <h2 class="modal-title">⚙️ ${t('settings.title')}</h2>
            <button class="modal-close-btn" id="btn-close-settings">✖</button>
          </div>

          <div class="modal-body settings-body">
            <!-- Language Selector -->
            <div class="setting-group">
              <label class="setting-label">${t('settings.language')}</label>
              <div class="setting-button-row">
                <button class="toggle-pill-btn ${s.language === 'de' ? 'is-active' : ''}" data-lang="de">
                  🇩🇪 Deutsch (ZählFix)
                </button>
                <button class="toggle-pill-btn ${s.language === 'en' ? 'is-active' : ''}" data-lang="en">
                  🇬🇧 English (BlitzCount)
                </button>
              </div>
            </div>

            <!-- Rounds Per Game (5, 10, 20) -->
            <div class="setting-group">
              <label class="setting-label">${t('settings.roundsCount')}</label>
              <div class="setting-button-row">
                <button class="toggle-pill-btn ${s.settings.rounds === 5 ? 'is-active' : ''}" data-rounds="5">5</button>
                <button class="toggle-pill-btn ${s.settings.rounds === 10 ? 'is-active' : ''}" data-rounds="10">10</button>
                <button class="toggle-pill-btn ${s.settings.rounds === 20 ? 'is-active' : ''}" data-rounds="20">20</button>
              </div>
            </div>

            <!-- Fine-Tune Flash Durations -->
            <div class="setting-group">
              <label class="setting-label">${t('settings.flashDuration')}</label>
              <div class="duration-slider-grid">
                <div class="slider-row">
                  <span class="slider-icon">🐢</span>
                  <input type="range" class="duration-slider" id="slider-turtle" min="1.0" max="4.0" step="0.1" value="${s.settings.durations.turtle}" />
                  <span class="slider-val" id="val-turtle">${s.settings.durations.turtle}s</span>
                </div>

                <div class="slider-row">
                  <span class="slider-icon">🐇</span>
                  <input type="range" class="duration-slider" id="slider-bunny" min="0.6" max="2.5" step="0.1" value="${s.settings.durations.bunny}" />
                  <span class="slider-val" id="val-bunny">${s.settings.durations.bunny}s</span>
                </div>

                <div class="slider-row">
                  <span class="slider-icon">🐆</span>
                  <input type="range" class="duration-slider" id="slider-cheetah" min="0.3" max="1.5" step="0.05" value="${s.settings.durations.cheetah}" />
                  <span class="slider-val" id="val-cheetah">${s.settings.durations.cheetah}s</span>
                </div>

                <div class="slider-row">
                  <span class="slider-icon">🚀</span>
                  <input type="range" class="duration-slider" id="slider-rocket" min="0.1" max="0.8" step="0.05" value="${s.settings.durations.rocket}" />
                  <span class="slider-val" id="val-rocket">${s.settings.durations.rocket}s</span>
                </div>
              </div>
            </div>

            <!-- Reset Scores -->
            <div class="setting-group danger-zone">
              <button class="reset-scores-btn" id="btn-reset-scores">
                🗑️ ${t('settings.resetScores')} (${profile.name})
              </button>
            </div>
          </div>

          <div class="modal-footer">
            <button class="modal-done-btn" id="btn-done-settings">
              ${t('settings.save')}
            </button>
          </div>
        </div>
      </div>
    `;

    const closeModal = () => {
      playTap();
      modalContainer.innerHTML = '';
      onSettingsChanged();
    };

    modalContainer.querySelector('#btn-close-settings').addEventListener('click', closeModal);
    modalContainer.querySelector('#btn-done-settings').addEventListener('click', closeModal);

    const langBtns = modalContainer.querySelectorAll('[data-lang]');
    langBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        playTap();
        const l = btn.getAttribute('data-lang');
        setLanguage(l);
        setI18nLang(l);
        render();
      });
    });

    const roundBtns = modalContainer.querySelectorAll('[data-rounds]');
    roundBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        playTap();
        const r = parseInt(btn.getAttribute('data-rounds'), 10);
        updateSettings({ rounds: r });
        render();
      });
    });

    const setupSlider = (id, key, valId) => {
      const slider = modalContainer.querySelector(id);
      const valSpan = modalContainer.querySelector(valId);
      if (slider && valSpan) {
        slider.addEventListener('input', (e) => {
          const val = parseFloat(e.target.value);
          valSpan.textContent = val + 's';
          updateDurations({ [key]: val });
        });
      }
    };

    setupSlider('#slider-turtle', 'turtle', '#val-turtle');
    setupSlider('#slider-bunny', 'bunny', '#val-bunny');
    setupSlider('#slider-cheetah', 'cheetah', '#val-cheetah');
    setupSlider('#slider-rocket', 'rocket', '#val-rocket');

    const btnReset = modalContainer.querySelector('#btn-reset-scores');
    btnReset.addEventListener('click', () => {
      if (confirm(t('settings.confirmReset'))) {
        playTap();
        resetProfileScores(profile.id);
        alert('Done!');
      }
    });
  }

  render();
}
