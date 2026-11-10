// Player Profile Selection & Management Modal for BlitzCount

import { getState, setActiveProfile, addProfile, updateProfile, deleteProfile, DEFAULT_AVATARS } from '../state.js';
import { playTap } from '../audio.js';
import { t } from '../i18n.js';

export function openProfileModal(modalContainer, { onProfileChanged }) {
  let editingProfileId = null;
  let confirmDialog = null; // { type: 'save' | 'delete', profile, newName, newAvatar }

  function render() {
    const currentState = getState();

    // 1. If currently showing a confirmation prompt
    if (confirmDialog) {
      renderConfirmationView(currentState);
      return;
    }

    // 2. If currently editing a profile
    if (editingProfileId) {
      const profile = currentState.profiles.find((p) => p.id === editingProfileId);
      if (profile) {
        renderEditProfileView(profile, currentState);
        return;
      }
      editingProfileId = null;
    }

    // 3. Default: Profile Selection Grid
    renderSelectionView(currentState);
  }

  function renderSelectionView(currentState) {
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
                <div class="profile-tile-card ${p.id === currentState.activeProfileId ? 'is-active-profile' : ''}">
                  <button class="profile-select-btn" data-id="${p.id}" title="${p.name}">
                    <span class="tile-avatar">${p.avatar}</span>
                    <span class="tile-name">${p.name}</span>
                    <div class="tile-medals-summary">
                      ${p.medals.gold > 0 ? `<span>🥇${p.medals.gold}</span>` : ''}
                      ${p.medals.silver > 0 ? `<span>🥈${p.medals.silver}</span>` : ''}
                      ${p.medals.bronze > 0 ? `<span>🥉${p.medals.bronze}</span>` : ''}
                    </div>
                  </button>
                  <button class="profile-edit-btn" data-edit-id="${p.id}" title="${t('profileModal.editButton')}">
                    ✏️
                  </button>
                </div>
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

    // Close button
    modalContainer.querySelector('#btn-close-modal').addEventListener('click', () => {
      playTap();
      closeModal();
    });

    // Profile tile selection
    const selectBtns = modalContainer.querySelectorAll('.profile-select-btn');
    selectBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        playTap();
        const id = btn.getAttribute('data-id');
        setActiveProfile(id);
        onProfileChanged();
        closeModal();
      });
    });

    // Edit button on tile
    const editBtns = modalContainer.querySelectorAll('.profile-edit-btn');
    editBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        playTap();
        const id = btn.getAttribute('data-edit-id');
        editingProfileId = id;
        render();
      });
    });

    // Add Player Drawer
    const btnShowAdd = modalContainer.querySelector('#btn-show-add-player');
    const form = modalContainer.querySelector('#new-player-form');
    let selectedAvatar = DEFAULT_AVATARS[0];

    btnShowAdd.addEventListener('click', () => {
      playTap();
      form.classList.toggle('is-hidden');
      btnShowAdd.classList.toggle('is-hidden');
      const input = form.querySelector('#new-player-name');
      if (input) input.focus();
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

  function renderEditProfileView(profile, currentState) {
    let currentAvatar = profile.avatar;
    const canDelete = currentState.profiles.length > 1;

    modalContainer.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-card profile-modal-card edit-profile-card">
          <div class="modal-header">
            <h2 class="modal-title">${t('profileModal.editTitle')}</h2>
            <button class="modal-close-btn" id="btn-cancel-edit">✖</button>
          </div>

          <div class="modal-body edit-player-body">
            <!-- Large Current Avatar Preview -->
            <div class="avatar-preview-wrapper">
              <span class="avatar-preview-display" id="avatar-preview-display">${currentAvatar}</span>
            </div>

            <!-- Avatar Options Carousel -->
            <div class="edit-section-label">${t('profileModal.chooseAvatar') || 'Avatar wählen'}</div>
            <div class="avatar-picker-row">
              ${DEFAULT_AVATARS.map((av) => `
                <button class="avatar-option-btn ${av === currentAvatar ? 'is-selected' : ''}" data-avatar="${av}">${av}</button>
              `).join('')}
            </div>

            <!-- Name Input Field -->
            <div class="edit-section-label">${t('profileModal.nameLabel')}</div>
            <div class="form-input-row">
              <input type="text" class="player-name-input" id="edit-player-name" value="${profile.name}" maxlength="12" />
            </div>

            <!-- Actions Row -->
            <div class="edit-player-actions">
              <button class="save-changes-btn" id="btn-save-edit">
                💾 ${t('profileModal.save')}
              </button>
              ${canDelete ? `
                <button class="delete-player-btn" id="btn-delete-player">
                  🗑️ ${t('profileModal.delete')}
                </button>
              ` : ''}
              <button class="cancel-edit-btn" id="btn-cancel-edit-player">
                ${t('profileModal.cancel')}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Cancel / Back to list
    const cancelBtns = modalContainer.querySelectorAll('#btn-cancel-edit, #btn-cancel-edit-player');
    cancelBtns.forEach((b) => b.addEventListener('click', () => {
      playTap();
      editingProfileId = null;
      render();
    }));

    // Avatar selection
    const avBtns = modalContainer.querySelectorAll('.avatar-option-btn');
    const avatarPreview = modalContainer.querySelector('#avatar-preview-display');
    avBtns.forEach((ab) => {
      ab.addEventListener('click', () => {
        playTap();
        avBtns.forEach((b) => b.classList.remove('is-selected'));
        ab.classList.add('is-selected');
        currentAvatar = ab.getAttribute('data-avatar');
        avatarPreview.textContent = currentAvatar;
      });
    });

    const nameInput = modalContainer.querySelector('#edit-player-name');

    // Save changes button -> asks confirmation
    const btnSave = modalContainer.querySelector('#btn-save-edit');
    btnSave.addEventListener('click', () => {
      playTap();
      const newName = nameInput.value.trim() || profile.name;
      // If nothing changed, return without asking
      if (newName === profile.name && currentAvatar === profile.avatar) {
        editingProfileId = null;
        render();
        return;
      }
      confirmDialog = {
        type: 'save',
        profile,
        newName,
        newAvatar: currentAvatar
      };
      render();
    });

    // Delete player button -> asks confirmation
    const btnDelete = modalContainer.querySelector('#btn-delete-player');
    if (btnDelete) {
      btnDelete.addEventListener('click', () => {
        playTap();
        confirmDialog = {
          type: 'delete',
          profile
        };
        render();
      });
    }
  }

  function renderConfirmationView(currentState) {
    const isDelete = confirmDialog.type === 'delete';
    const profile = confirmDialog.profile;
    const title = isDelete ? t('profileModal.confirmDeleteTitle') : t('profileModal.confirmSaveTitle');
    const desc = isDelete
      ? t('profileModal.confirmDeleteDesc', { name: profile.name })
      : t('profileModal.confirmSaveDesc', { name: confirmDialog.newName });

    const okLabel = isDelete ? t('profileModal.delete') : t('profileModal.save');
    const okClass = isDelete ? 'btn-danger' : 'btn-success';

    modalContainer.innerHTML = `
      <div class="modal-backdrop">
        <div class="confirm-dialog-card">
          <div class="confirm-icon">${isDelete ? '⚠️' : '💾'}</div>
          <h3 class="confirm-title">${title}</h3>
          <p class="confirm-desc">${desc}</p>
          <div class="confirm-actions">
            <button class="confirm-btn-cancel" id="btn-confirm-cancel">
              ${t('profileModal.cancel')}
            </button>
            <button class="confirm-btn-action ${okClass}" id="btn-confirm-ok">
              ${okLabel}
            </button>
          </div>
        </div>
      </div>
    `;

    modalContainer.querySelector('#btn-confirm-cancel').addEventListener('click', () => {
      playTap();
      confirmDialog = null;
      render();
    });

    modalContainer.querySelector('#btn-confirm-ok').addEventListener('click', () => {
      playTap();
      if (isDelete) {
        deleteProfile(profile.id);
        editingProfileId = null;
        confirmDialog = null;
        onProfileChanged();
        render();
      } else {
        updateProfile(profile.id, {
          name: confirmDialog.newName,
          avatar: confirmDialog.newAvatar
        });
        editingProfileId = null;
        confirmDialog = null;
        onProfileChanged();
        render();
      }
    });
  }

  function closeModal() {
    modalContainer.innerHTML = '';
  }

  render();
}
