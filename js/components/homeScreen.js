// Home Screen Component for BlitzCount
import { getState, updateSettings, getActiveProfile, getProfileBestScore } from '../state.js';
import { playTap } from '../audio.js';
import { t } from '../i18n.js';
import { renderCounti } from '../mascot.js';

export function renderHomeScreen(container, { onStartGame }) {
  const state = getState();
  const profile = getActiveProfile();
  const { gameMode = 'classic', category, speed, rounds, numberRange = 'advanced' } = state.settings;

  const bestScore = getProfileBestScore(profile, { gameMode, category, speed, rounds, numberRange });

  let highscoreLabel = '';
  if (gameMode === 'blitz') {
    highscoreLabel = `⏱️ ${t('results.blitzScore')}: <strong>${bestScore} ${t('results.points')}</strong>`;
  } else if (gameMode === 'streak') {
    highscoreLabel = `🔥 ${t('results.streakScore')}: <strong>${bestScore} ${t('results.inARow')}</strong>`;
  } else {
    highscoreLabel = `⭐ ${t('trophyRoom.highscores')}: <strong>${bestScore} / ${rounds}</strong>`;
  }

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

      <!-- Game Mode Selector (🎯 Classic, ⏱️ 60s Blitz, 🔥 Streak) -->
      <section class="section-container">
        <div class="mode-tabs" role="tablist">
          <button class="mode-tab-btn ${gameMode === 'classic' ? 'is-active' : ''}" data-mode="classic" title="${t('gameModes.classicDesc')}">
            <span class="mode-emoji">🎯</span>
            <span class="mode-label">${t('gameModes.classic')}</span>
          </button>

          <button class="mode-tab-btn ${gameMode === 'blitz' ? 'is-active' : ''}" data-mode="blitz" title="${t('gameModes.blitzDesc')}">
            <span class="mode-emoji">⏱️</span>
            <span class="mode-label">${t('gameModes.blitz')}</span>
          </button>

          <button class="mode-tab-btn ${gameMode === 'streak' ? 'is-active' : ''}" data-mode="streak" title="${t('gameModes.streakDesc')}">
            <span class="mode-emoji">🔥</span>
            <span class="mode-label">${t('gameModes.streak')}</span>
          </button>
        </div>
      </section>

      <!-- Number Range Selector (🌱 Bis 6, 🌟 Bis 12) -->
      <section class="section-container">
        <div class="range-tabs" role="tablist">
          <button class="range-tab-btn ${numberRange === 'easy' ? 'is-active' : ''}" data-range="easy" title="${t('numberRanges.easyDesc')}">
            <span class="range-emoji">🌱</span>
            <span class="range-label">${t('numberRanges.easy')}</span>
          </button>

          <button class="range-tab-btn ${numberRange === 'advanced' ? 'is-active' : ''}" data-range="advanced" title="${t('numberRanges.advancedDesc')}">
            <span class="range-emoji">🌟</span>
            <span class="range-label">${t('numberRanges.advanced')}</span>
          </button>
        </div>
      </section>

      <!-- Category Selector -->
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

      <!-- Animal Speed Selector -->
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
        <span class="best-score-text">${highscoreLabel}</span>
      </div>

      <div class="play-action-wrapper">
        <button class="huge-play-btn" id="btn-play-game">
          <span class="play-icon">▶️</span>
          <span class="play-text">${t('play')}</span>
        </button>
      </div>
    </div>
  `;

  // Mode button events
  const modeButtons = container.querySelectorAll('.mode-tab-btn');
  modeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      playTap();
      const newMode = btn.getAttribute('data-mode');
      updateSettings({ gameMode: newMode });
      renderHomeScreen(container, { onStartGame });
    });
  });

  // Range button events
  const rangeButtons = container.querySelectorAll('.range-tab-btn');
  rangeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      playTap();
      const newRange = btn.getAttribute('data-range');
      updateSettings({ numberRange: newRange });
      renderHomeScreen(container, { onStartGame });
    });
  });

  // Category button events
  const catButtons = container.querySelectorAll('.cat-tab-btn');
  catButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      playTap();
      const newCat = btn.getAttribute('data-cat');
      updateSettings({ category: newCat });
      renderHomeScreen(container, { onStartGame });
    });
  });

  // Speed button events
  const speedButtons = container.querySelectorAll('.speed-card-btn');
  speedButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      playTap();
      const newSpeed = btn.getAttribute('data-speed');
      updateSettings({ speed: newSpeed });
      renderHomeScreen(container, { onStartGame });
    });
  });

  // Play button
  const btnPlay = container.querySelector('#btn-play-game');
  btnPlay.addEventListener('click', () => {
    playTap();
    onStartGame();
  });
}
