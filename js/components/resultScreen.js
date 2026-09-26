// Game Result & Medal Celebration Screen for BlitzCount / ZählFix

import { playFanfare, playTap, playDing } from '../audio.js';
import { renderCounti } from '../mascot.js';
import { launchConfetti } from '../confetti.js';
import { t } from '../i18n.js';

export function renderResultScreen(container, { score, total, earnedMedal, isNewHighscore, onReplay, onHome }) {
  let headline = t('results.tryAgain');
  let medalEmoji = '🌟';
  let medalClass = 'medal-star';

  if (earnedMedal === 'gold') {
    headline = t('results.gold');
    medalEmoji = '🥇';
    medalClass = 'medal-gold';
  } else if (earnedMedal === 'silver') {
    headline = t('results.silver');
    medalEmoji = '🥈';
    medalClass = 'medal-silver';
  } else if (earnedMedal === 'bronze') {
    headline = t('results.bronze');
    medalEmoji = '🥉';
    medalClass = 'medal-bronze';
  }

  container.innerHTML = `
    <div class="result-screen-view">
      <canvas class="confetti-canvas" id="result-confetti-canvas"></canvas>

      <div class="result-mascot-wrap">
        ${renderCounti(earnedMedal ? 'victory' : 'idle', 120)}
      </div>

      <div class="result-card">
        <div class="medal-badge-giant ${medalClass}">
          <span class="medal-icon">${medalEmoji}</span>
        </div>

        <h2 class="result-headline">${headline}</h2>

        <div class="score-stars-summary">
          <span class="score-number">${score}</span>
          <span class="score-divider">/</span>
          <span class="score-total">${total}</span>
          <span class="score-star-glyph">⭐</span>
        </div>

        ${isNewHighscore ? `
          <div class="new-highscore-badge">
            <span class="badge-sparkle">✨</span>
            <span>${t('trophyRoom.highscores')}!</span>
          </div>
        ` : ''}
      </div>

      <div class="result-actions-row">
        <button class="result-btn btn-replay" id="btn-result-replay">
          <span class="btn-icon">🔄</span>
          <span class="btn-text">${t('replay')}</span>
        </button>

        <button class="result-btn btn-home" id="btn-result-home">
          <span class="btn-icon">🏠</span>
          <span class="btn-text">${t('home')}</span>
        </button>
      </div>
    </div>
  `;

  if (earnedMedal) {
    playFanfare();
    const canvas = container.querySelector('#result-confetti-canvas');
    if (canvas) {
      launchConfetti(canvas, 4000);
    }
  } else {
    playDing();
  }

  const btnReplay = container.querySelector('#btn-result-replay');
  btnReplay.addEventListener('click', () => {
    playTap();
    onReplay();
  });

  const btnHome = container.querySelector('#btn-result-home');
  btnHome.addEventListener('click', () => {
    playTap();
    onHome();
  });
}
