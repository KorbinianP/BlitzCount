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
    // Generate progress bubbles
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
        <!-- Top Game Header -->
        <div class="game-top-bar">
          <button class="game-exit-btn" id="btn-game-exit" title="${t('home')}">
            <span class="exit-icon">🏠</span>
          </button>
          
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

        <!-- Central Play / Flash Card Area -->
        <div class="flash-stage-wrapper">
          <div class="flash-card-stage" id="flash-stage">
            <!-- Content injected dynamically -->
          </div>

          <!-- Mascot Helper Corner -->
          <div class="game-mascot-corner" id="game-mascot">
            ${renderCounti('idle', 75)}
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

    // Generate random stimulus for this round
    currentStimulus = createStimulus(category);

    // Initial mount: keypad is ready
    renderKeypad(keypadMount, {
      isEnabled: false,
      onSelectNumber: () => {}
    });

    // Brief ready cue (300ms)
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

      // Animate the flash timer bar depleting
      timerBar.style.transition = `width ${flashDuration}s linear`;
      timerBar.style.width = '0%';

      // CHANGE 3: Enable Keypad IMMEDIATELY when stimulus appears!
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

        // Ensure keypad is enabled
        renderKeypad(keypadMount, {
          isEnabled: true,
          onSelectNumber: handleUserAnswer
        });

        // If Rocket mode, start answer timer
        if (isRocket) {
          timerBar.style.transition = `width ${rocketAnswerLimit}s linear`;
          timerBar.style.width = '0%';
          answerTimer = setTimeout(() => {
            if (!isAnswered) {
              handleUserAnswer(-1); // Timed out
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

    // Immediately disable keypad to prevent double-tap
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
      // Correct! Cheerful chime, sparkling Counti, green glow
      playCorrect();
      mascot.innerHTML = renderCounti('cheer', 85);
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
      // Missed / timeout! Gentle boing, encouraging Counti, friendly reveal with numbers
      playWrong();
      mascot.innerHTML = renderCounti('encourage', 85);
      stage.classList.remove('is-flashing');
      stage.classList.add('feedback-wrong');
      // Reveal the counted stimulus with badges so the child learns
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

  // Start the first round
  startRound();

  return {
    destroy: () => cleanupTimers()
  };
}
