// Game Screen Component for BlitzCount / ZählFix
// Supports immediate keypad response during stimulus flash, plus blank card fallback

import { getState, getDurationForSpeed, getRocketAnswerLimit, recordGameResult } from '../state.js';
import { playDing, playCorrect, playWrong, playTap } from '../audio.js';
import { renderCounti } from '../mascot.js';
import { createStimulus } from '../stimuli.js';
import { renderKeypad } from './keypad.js';
import { t } from '../i18n.js';

export function renderGameScreen(container, { onGameFinished, onExitGame }) {
  const state = getState();
  const { category, speed, rounds } = state.settings;
  const totalRounds = rounds || 10;
  const flashDuration = getDurationForSpeed(speed);
  const isRocket = speed === 'rocket';
  const rocketAnswerLimit = getRocketAnswerLimit();

  let currentRound = 0;
  let score = 0;
  const roundResults = []; // array of true / false
  let currentStimulus = null;
  let flashTimer = null;
  let answerTimer = null;
  let isAnswered = false;

  function renderFrame(phase = 'ready') {
    let progressBubblesHtml = '';
    for (let i = 0; i < totalRounds; i++) {
      let bubbleClass = 'bubble-pending';
      let bubbleContent = '';
      if (i < roundResults.length) {
        if (roundResults[i]) {
          bubbleClass = 'bubble-correct';
          bubbleContent = '⭐';
        } else {
          bubbleClass = 'bubble-wrong';
          bubbleContent = '⭕';
        }
      } else if (i === currentRound) {
        bubbleClass = 'bubble-current';
      }
      progressBubblesHtml += `
        <div class="progress-bubble ${bubbleClass}">
          <span class="bubble-inner">${bubbleContent}</span>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="game-screen-view">
        <!-- Top Game Header with Exit, Mascot reaction pill, progress bubbles, and round count -->
        <div class="game-top-bar">
          <button class="game-exit-btn" id="btn-game-exit" title="${t('home')}">
            <span class="exit-icon">🏠</span>
          </button>
          
          <div class="game-mascot-pill" id="game-mascot" title="Counti">
            ${renderCounti('idle', 44)}
          </div>

          <div class="progress-bubble-track">
            ${progressBubblesHtml}
          </div>

          <div class="round-counter-pill">
            ${currentRound + 1} / ${totalRounds}
          </div>
        </div>

        <!-- Timer / Flash Progress Bar -->
        <div class="timer-bar-track">
          <div class="timer-bar-fill" id="timer-bar-fill"></div>
        </div>

        <!-- Central Play / Flash Card Area (Completely unobstructed, 100% reserved for stimulus) -->
        <div class="flash-stage-wrapper">
          <div class="flash-card-stage" id="flash-stage">
            <!-- Content injected dynamically -->
          </div>
        </div>

        <!-- Chunky Numpad Area -->
        <div class="game-keypad-section" id="keypad-mount">
          <!-- Keypad rendered here -->
        </div>
      </div>
    `;

    // Exit button
    const btnExit = container.querySelector('#btn-game-exit');
    btnExit.addEventListener('click', () => {
      cleanupTimers();
      playTap();
      onExitGame();
    });
  }

  function cleanupTimers() {
    if (flashTimer) clearTimeout(flashTimer);
    if (answerTimer) clearTimeout(answerTimer);
  }

  function startRound() {
    cleanupTimers();
    isAnswered = false;

    if (currentRound >= totalRounds) {
      finishGame();
      return;
    }

    renderFrame('ready');
    const stage = container.querySelector('#flash-stage');
    const mascot = container.querySelector('#game-mascot');
    const keypadMount = container.querySelector('#keypad-mount');
    const timerBar = container.querySelector('#timer-bar-fill');

    currentStimulus = createStimulus(category);

    renderKeypad(keypadMount, {
      isEnabled: false,
      onSelectNumber: () => {}
    });

    playDing();
    stage.innerHTML = `
      <div class="ready-countdown-pulse">
        <span class="ready-star">✨</span>
      </div>
    `;

    setTimeout(() => {
      if (isAnswered) return;

      // 1. FLASH PHASE: Display the stimulus
      stage.innerHTML = currentStimulus.html;
      stage.classList.add('is-flashing');

      timerBar.style.transition = `width ${flashDuration}s linear`;
      timerBar.style.width = '0%';

      // Enable keypad immediately during flash
      renderKeypad(keypadMount, {
        isEnabled: true,
        onSelectNumber: handleUserAnswer
      });

      flashTimer = setTimeout(() => {
        if (isAnswered) return;

        // 2. INPUT PHASE: Stimulus blanks out if not answered yet
        stage.classList.remove('is-flashing');
        stage.innerHTML = `
          <div class="blank-curtain">
            <span class="question-mark-icon">❓</span>
          </div>
        `;

        timerBar.style.transition = 'none';
        timerBar.style.width = '100%';

        renderKeypad(keypadMount, {
          isEnabled: true,
          onSelectNumber: handleUserAnswer
        });

        if (isRocket) {
          timerBar.style.transition = `width ${rocketAnswerLimit}s linear`;
          timerBar.style.width = '0%';
          answerTimer = setTimeout(() => {
            if (!isAnswered) {
              handleUserAnswer(-1);
            }
          }, rocketAnswerLimit * 1000);
        }
      }, flashDuration * 1000);
    }, 320);
  }

  function handleUserAnswer(chosenNumber) {
    if (isAnswered) return;
    isAnswered = true;
    cleanupTimers();

    const stage = container.querySelector('#flash-stage');
    const mascot = container.querySelector('#game-mascot');
    const keypadMount = container.querySelector('#keypad-mount');
    const timerBar = container.querySelector('#timer-bar-fill');

    renderKeypad(keypadMount, {
      isEnabled: false,
      onSelectNumber: () => {}
    });

    if (timerBar) {
      timerBar.style.transition = 'none';
      timerBar.style.width = '0%';
    }

    const isCorrect = chosenNumber === currentStimulus.count;
    roundResults.push(isCorrect);
    if (isCorrect) score++;

    if (isCorrect) {
      playCorrect();
      if (mascot) mascot.innerHTML = renderCounti('cheer', 48);
      stage.classList.remove('is-flashing');
      stage.classList.add('feedback-correct');
      stage.innerHTML = `
        <div class="feedback-badge-correct">
          <span class="feedback-star">⭐</span>
          <span class="feedback-number">${chosenNumber}</span>
        </div>
      `;

      setTimeout(() => {
        currentRound++;
        startRound();
      }, 1000);
    } else {
      playWrong();
      if (mascot) mascot.innerHTML = renderCounti('encourage', 48);
      stage.classList.remove('is-flashing');
      stage.classList.add('feedback-wrong');
      stage.innerHTML = `
        <div class="feedback-reveal-wrap">
          ${currentStimulus.reviewHtml}
        </div>
      `;

      setTimeout(() => {
        currentRound++;
        startRound();
      }, 2300);
    }
  }

  function finishGame() {
    cleanupTimers();
    const resultMeta = recordGameResult({
      score,
      total: totalRounds,
      speed,
      category
    });

    onGameFinished({
      score,
      total: totalRounds,
      speed,
      category,
      earnedMedal: resultMeta.earnedMedal,
      isNewHighscore: resultMeta.isNewHighscore
    });
  }

  startRound();

  return {
    destroy: () => cleanupTimers()
  };
}
