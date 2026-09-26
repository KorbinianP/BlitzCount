// Home Screen Component for BlitzCount / ZählFix
import { getState, updateSettings, getActiveProfile } from '../state.js';
import { playTap } from '../audio.js';
import { t } from '../i18n.js';
import { renderCounti } from '../mascot.js';

export function renderHomeScreen(container, { onStartGame }) {
  const state = getState();
  const profile = getActiveProfile();
  const { category, speed, rounds } = state.settings;

  const scoreKey = `${category}_${speed}_${rounds}`;
  const bestScore = profile.highscores[scoreKey] || 0;

  container.innerHTML = `
    <div class="home-screen-view">
      <div class="mascot-hero-card">
        <div class="mascot-large-wrap">
          ${renderCounti('idle', 130)}
        </div>
        <div class="mascot-bubble">
          <h1 class="game-headline">${t('appTitle')}</h1>
          <p class="game-tagline">${t('tagline')}</p>
        </div>
      </div>

      <section class="section-container">
        <div class="category-tabs" role="tablist">
          <button class="cat-tab-btn ${category === 'fruits' ? 'is-active' : ''}" data-cat="fruits">
            <span class="tab-emoji">🍓</span>
            <span class="tab-label">${t('categories.fruits')}</span>
          </button>

          <button class="cat-tab-btn ${category === 'dice' ? 'is-active' : ''}" data-cat="dice">
            <span class="tab-emoji">🎲</span>
            <span class="tab-label">${t('categories.dice')}</span>
          </button>

          <button class="cat-tab-btn ${category === 'fingers' ? 'is-active' : ''}" data-cat="fingers">
            <span class="tab-emoji">🖐️</span>
            <span class="tab-label">${t('categories.fingers')}</span>
          </button>

          <button class="cat-tab-btn ${category === 'mixed' ? 'is-active' : ''}" data-cat="mixed">
            <span class="tab-emoji">🔀</span>
            <span class="tab-label">${t('categories.mixed')}</span>
          </button>
        </div>
      </section>

      <section class="section-container">
        <div class="speed-grid">
          <button class="speed-card-btn ${speed === 'turtle' ? 'is-active' : ''}" data-speed="turtle">
            <span class="animal-avatar">🐢</span>
            <span class="speed-title">${t('speeds.turtle')}</span>
          </button>

          <button class="speed-card-btn ${speed === 'bunny' ? 'is-active' : ''}" data-speed="bunny">
            <span class="animal-avatar">🐇</span>
            <span class="speed-title">${t('speeds.bunny')}</span>
          </button>

          <button class="speed-card-btn ${speed === 'cheetah' ? 'is-active' : ''}" data-speed="cheetah">
            <span class="animal-avatar">🐆</span>
            <span class="speed-title">${t('speeds.cheetah')}</span>
          </button>

          <button class="speed-card-btn ${speed === 'rocket' ? 'is-active' : ''}" data-speed="rocket">
            <span class="animal-avatar">🚀</span>
            <span class="speed-title">${t('speeds.rocket')}</span>
          </button>
        </div>
      </section>

      <div class="highscore-badge-row">
        <span class="star-icon">⭐</span>
        <span class="best-score-text">${t('trophyRoom.highscores')}: <strong>${bestScore} / ${rounds}</strong></span>
      </div>

      <div class="play-action-wrapper">
        <button class="huge-play-btn" id="btn-play-game">
          <span class="play-icon">▶️</span>
          <span class="play-text">${t('play')}</span>
        </button>
      </div>
    </div>
  `;

  const catButtons = container.querySelectorAll('.cat-tab-btn');
  catButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      playTap();
      const newCat = btn.getAttribute('data-cat');
      updateSettings({ category: newCat });
      renderHomeScreen(container, { onStartGame });
    });
  });

  const speedButtons = container.querySelectorAll('.speed-card-btn');
  speedButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      playTap();
      const newSpeed = btn.getAttribute('data-speed');
      updateSettings({ speed: newSpeed });
      renderHomeScreen(container, { onStartGame });
    });
  });

  const btnPlay = container.querySelector('#btn-play-game');
  btnPlay.addEventListener('click', () => {
    playTap();
    onStartGame();
  });
}
