// Player Profile Selection Modal for BlitzCount

import { getState, setActiveProfile, addProfile, DEFAULT_AVATARS } from '../state.js';
import { playTap } from '../audio.js';
import { t } from '../i18n.js';

export function openProfileModal(modalContainer, { onProfileChanged }) {
  function render() {
    const currentState = getState();
    modalContainer.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-card profile-modal-card">
          <div class="modal-header">
            <h2 class="modal-title">${t('profileModal.title')}</h2>
            <button class="modal-close-btn" id="btn-close-modal">✖</button>
          </div>

          <div class="modal-body">
            <div class="profiles-selection-grid">
              ${currentState.profiles.map((p) => `
                <button class="profile-select-tile ${p.id === currentState.activeProfileId ? 'is-active-profile' : ''}" data-id="${p.id}">
                  <span class="tile-avatar">${p.avatar}</span>
                  <span class="tile-name">${p.name}</span>
                  <div class="tile-medals-summary">
                    ${p.medals.gold > 0 ? `<span>🥇${p.medals.gold}</span>` : ''}
                    ${p.medals.silver > 0 ? `<span>🥈${p.medals.silver}</span>` : ''}
                    ${p.medals.bronze > 0 ? `<span>🥉${p.medals.bronze}</span>` : ''}
                  </div>
                </button>
              `).join('')}
            </div>

            <div class="add-profile-drawer" id="add-profile-drawer">
              <button class="add-new-player-btn" id="btn-show-add-player">
                <span class="btn-icon">➕</span>
                <span>${t('settings.addPlayer')}</span>
              </button>

              <div class="new-player-form is-hidden" id="new-player-form">
                <div class="avatar-picker-row">
                  ${DEFAULT_AVATARS.map((av, idx) => `
                    <button class="avatar-option-btn ${idx === 0 ? 'is-selected' : ''}" data-avatar="${av}">${av}</button>
                  `).join('')}
                </div>
                <div class="form-input-row">
                  <input type="text" class="player-name-input" id="new-player-name" placeholder="${t('profileModal.nameLabel')}" maxlength="12" />
                  <button class="save-player-btn" id="btn-save-new-player">${t('profileModal.createButton')}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    modalContainer.querySelector('#btn-close-modal').addEventListener('click', () => {
      playTap();
      closeModal();
    });

    const tiles = modalContainer.querySelectorAll('.profile-select-tile');
    tiles.forEach((tile) => {
      tile.addEventListener('click', () => {
        playTap();
        const id = tile.getAttribute('data-id');
        setActiveProfile(id);
        onProfileChanged();
        closeModal();
      });
    });

    const btnShowAdd = modalContainer.querySelector('#btn-show-add-player');
    const form = modalContainer.querySelector('#new-player-form');
    let selectedAvatar = DEFAULT_AVATARS[0];

    btnShowAdd.addEventListener('click', () => {
      playTap();
      form.classList.toggle('is-hidden');
      btnShowAdd.classList.toggle('is-hidden');
    });

    const avBtns = modalContainer.querySelectorAll('.avatar-option-btn');
    avBtns.forEach((ab) => {
      ab.addEventListener('click', () => {
        playTap();
        avBtns.forEach((b) => b.classList.remove('is-selected'));
        ab.classList.add('is-selected');
        selectedAvatar = ab.getAttribute('data-avatar');
      });
    });

    const btnSave = modalContainer.querySelector('#btn-save-new-player');
    const nameInput = modalContainer.querySelector('#new-player-name');
    btnSave.addEventListener('click', () => {
      playTap();
      const name = nameInput.value.trim();
      addProfile(name, selectedAvatar);
      onProfileChanged();
      closeModal();
    });
  }

  function closeModal() {
    modalContainer.innerHTML = '';
  }

  render();
}
