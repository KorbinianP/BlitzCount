// Trophy Room / Hall of Fame modal for BlitzCount

import { getState, getActiveProfile } from '../state.js';
import { playTap } from '../audio.js';
import { t } from '../i18n.js';
import { renderCounti } from '../mascot.js';

export function openTrophyModal(modalContainer) {
  const state = getState();
  const activeProfile = getActiveProfile();

  modalContainer.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal-card trophy-modal-card">
        <div class="modal-header">
          <div class="modal-title-with-icon">
            <span class="title-trophy">🏆</span>
            <h2 class="modal-title">${t('trophyRoom.title')}</h2>
          </div>
          <button class="modal-close-btn" id="btn-close-trophy">✖</button>
        </div>

        <div class="modal-body trophy-modal-body">
          <div class="trophy-hero-showcase">
            <div class="trophy-mascot">${renderCounti('victory', 90)}</div>
            <div class="player-headline">
              <span class="player-avatar-large">${activeProfile.avatar}</span>
              <h3 class="player-name-large">${activeProfile.name}</h3>
            </div>
            
            <div class="medals-trio-row">
              <div class="medal-tally-box gold-box">
                <span class="medal-emoji">🥇</span>
                <span class="medal-count">${activeProfile.medals.gold || 0}</span>
                <span class="medal-label">Gold</span>
              </div>

              <div class="medal-tally-box silver-box">
                <span class="medal-emoji">🥈</span>
                <span class="medal-count">${activeProfile.medals.silver || 0}</span>
                <span class="medal-label">Silver</span>
              </div>

              <div class="medal-tally-box bronze-box">
                <span class="medal-emoji">🥉</span>
                <span class="medal-count">${activeProfile.medals.bronze || 0}</span>
                <span class="medal-label">Bronze</span>
              </div>
            </div>
          </div>

          <div class="hall-of-fame-section">
            <h4 class="section-subtitle">${t('settings.profiles')}</h4>
            <div class="players-leaderboard-list">
              ${state.profiles.map((p) => `
                <div class="leaderboard-player-row ${p.id === activeProfile.id ? 'is-current-active' : ''}">
                  <div class="player-info">
                    <span class="lb-avatar">${p.avatar}</span>
                    <span class="lb-name">${p.name}</span>
                  </div>
                  <div class="lb-medals">
                    <span class="lb-medal">🥇 ${p.medals.gold || 0}</span>
                    <span class="lb-medal">🥈 ${p.medals.silver || 0}</span>
                    <span class="lb-medal">🥉 ${p.medals.bronze || 0}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  modalContainer.querySelector('#btn-close-trophy').addEventListener('click', () => {
    playTap();
    modalContainer.innerHTML = '';
  });
}
