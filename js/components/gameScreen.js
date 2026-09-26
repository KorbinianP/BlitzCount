// Game Screen Component for BlitzCount
// Supports 3 Game Modes: 🎯 Classic Rounds, ⏱️ 60s Blitz, 🔥 Sudden Death Streak
// Features immediate keypad response during stimulus flash, plus blank card fallback

import { getState, getDurationForSpeed, getRocketAnswerLimit, recordGameResult } from '../state.js';
import { playDing, playCorrect, playWrong, playTap } from '../audio.js';
import { renderCounti } from '../mascot.js';
import { createStimulus } from '../stimuli.js';
import { renderKeypad } from './keypad.js';
import { t } from '../i18n.js';

export function renderGameScreen(container, { onGameFinished, onExitGame }) {
  const state = getState();
  const { gameMode = 'classic', category, speed, rounds, blitzTime = 60, numberRange = 'advanced' } = state.settings;
  const totalRounds = rounds || 10;
  const flashDuration = getDurationForSpeed(speed);
  const isRocket = speed === 'rocket';
  const rocketAnswerLimit = getRocketAnswerLimit();

  let currentRound = 0;
  let score = 0;
  let streak = 0;
  const roundResults = []; // array of true / false
  let currentStimulus = null;
  let flashTimer = null;
  let answerTimer = null;
  let reviewTimeout = null;
  let isAnswered = false;

  // Blitz Mode specific precision state
  let blitzMsLeft = (blitzTime || 60) * 1000;
  let blitzRunning = false;
  let blitzLastTick = 0;
  let blitzTimer = null;

  function updateBlitzDisplay() {
    const seconds = Math.ceil(blitzMsLeft / 1000);
    const timeText = container.querySelector('#blitz-time-text');
    const clockPill = container.querySelector('#blitz-clock-pill');
    if (timeText) timeText.textContent = `${seconds}s`;
    if (clockPill) {
      if (seconds <= 10) clockPill.classList.add('is-urgent');
      else clockPill.classList.remove('is-urgent');
      if (!blitzRunning) clockPill.classList.add('is-paused');
      else clockPill.classList.remove('is-paused');
    }
  }

  function startBlitzTimer() {
    if (gameMode !== 'blitz' || blitzRunning) return;
    if (blitzMsLeft <= 0) {
      finishGame();
      return;
    }
    blitzRunning = true;
    blitzLastTick = Date.now();
    updateBlitzDisplay();

    blitzTimer = setInterval(() => {
      if (!blitzRunning) return;
      const now = Date.now();
      const delta = now - blitzLastTick;
      blitzLastTick = now;
      blitzMsLeft = Math.max(0, blitzMsLeft - delta);
      updateBlitzDisplay();

      if (blitzMsLeft <= 0) {
        pauseBlitzTimer();
        finishGame();
      }
    }, 100);
  }

  function pauseBlitzTimer() {
    blitzRunning = false;
    if (blitzTimer) {
      clearInterval(blitzTimer);
      blitzTimer = null;
    }
    updateBlitzDisplay();
  }

  function renderFrame(phase = 'ready') {
    let topBarCenterHtml = '';

    if (gameMode === 'blitz') {
      const displaySec = Math.ceil(blitzMsLeft / 1000);
      topBarCenterHtml = `
        <div class="blitz-hud-track">
          <div class="blitz-clock-pill ${displaySec <= 10 ? 'is-urgent' : ''} ${!blitzRunning ? 'is-paused' : ''}" id="blitz-clock-pill">
            <span class="blitz-icon">⏱️</span>
            <span class="blitz-time-text" id="blitz-time-text">${displaySec}s</span>
          </div>
          <div class="blitz-score-pill">
            <span class="blitz-star">⭐</span>
            <span class="blitz-score-text" id="blitz-score-text">${score}</span>
          </div>
        </div>
      `;
    } else if (gameMode === 'streak') {
      topBarCenterHtml = `
        <div class="streak-hud-track">
          <div class="streak-flame-pill" id="streak-flame-pill">
            <span class="flame-icon">🔥</span>
            <span class="streak-label">${t('gameModes.streak')}:</span>
            <strong class="streak-count-text" id="streak-count-text">${streak}</strong>
          </div>
        </div>
      `;
    } else {
      // Classic rounds
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
            bubbleContent = '❌';
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

      topBarCenterHtml = `
        <div class="progress-bubble-track">
          ${progressBubblesHtml}
        </div>
        <div class="round-counter-pill">
          ${currentRound + 1} / ${totalRounds}
        </div>
      `;
    }

    container.innerHTML = `
      <div class="game-screen-view mode-${gameMode}">
        <!-- Top Game Header -->
        <div class="game-top-bar">
          <button class="game-exit-btn" id="btn-game-exit" title="${t('home')}">
            <span class="exit-icon">🏠</span>
          </button>
          
          <div class="game-mascot-pill" id="game-mascot" title="Counti">
            ${renderCounti('idle', 44)}
          </div>

          ${topBarCenterHtml}
        </div>

        <!-- Timer / Flash Progress Bar -->
        <div class="timer-bar-track">
          <div class="timer-bar-fill" id="timer-bar-fill"></div>
        </div>

        <!-- Central Play / Flash Card Area -->
        <div class="flash-stage-wrapper">
          <div class="flash-card-stage" id="flash-stage">
            <!-- Stimulus injected dynamically -->
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
      cleanupAllTimers();
      playTap();
      onExitGame();
    });
  }

  function cleanupAllTimers() {
    if (flashTimer) clearTimeout(flashTimer);
    if (answerTimer) clearTimeout(answerTimer);
    if (reviewTimeout) clearTimeout(reviewTimeout);
    pauseBlitzTimer();
  }

  function startRound() {
    if (flashTimer) clearTimeout(flashTimer);
    if (answerTimer) clearTimeout(answerTimer);
    if (reviewTimeout) clearTimeout(reviewTimeout);
    isAnswered = false;

    // Check Classic rounds finish condition
    if (gameMode === 'classic' && currentRound >= totalRounds) {
      finishGame();
      return;
    }

    // Check Blitz time expired condition before starting round
    if (gameMode === 'blitz' && blitzMsLeft <= 0) {
      finishGame();
      return;
    }

    renderFrame('ready');
    updateBlitzDisplay();

    const stage = container.querySelector('#flash-stage');
    const keypadMount = container.querySelector('#keypad-mount');
    const timerBar = container.querySelector('#timer-bar-fill');

    currentStimulus = createStimulus(category, null, numberRange);

    renderKeypad(keypadMount, {
      isEnabled: false,
      numberRange,
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

      // Start/resume the 60s countdown ONLY when the stimulus appears!
      startBlitzTimer();

      timerBar.style.transition = `width ${flashDuration}s linear`;
      timerBar.style.width = '0%';

      // Enable keypad immediately during flash
      renderKeypad(keypadMount, {
        isEnabled: true,
        numberRange,
        onSelectNumber: handleUserAnswer
      });

      flashTimer = setTimeout(() => {
        if (isAnswered) return;

        // 2. INPUT PHASE: Non-countable shutter curtain with downward prompt
        stage.classList.remove('is-flashing');
        stage.innerHTML = `
          <div class="blank-curtain shutter-curtain">
            <div class="shutter-slats">
              <span class="slat"></span>
              <span class="slat"></span>
              <span class="slat"></span>
            </div>
            <div class="input-prompt-box">
              <span class="input-prompt-arrow">👇</span>
              <span class="input-prompt-text">${t('results.inputPrompt')}</span>
            </div>
          </div>
        `;

        timerBar.style.transition = 'none';
        timerBar.style.width = '100%';

        const kp = keypadMount.querySelector('.keypad-container');
        if (kp) {
          kp.classList.add('keypad-prompt-pulse');
        }

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
    if (flashTimer) clearTimeout(flashTimer);
    if (answerTimer) clearTimeout(answerTimer);

    // Freeze 60s timer immediately so right & wrong feedback does NOT count to the 60s!
    pauseBlitzTimer();

    const stage = container.querySelector('#flash-stage');
    const mascot = container.querySelector('#game-mascot');
    const keypadMount = container.querySelector('#keypad-mount');
    const timerBar = container.querySelector('#timer-bar-fill');

    // Keep keypad visible so the tapped and correct keys can be highlighted
    const keypadContainer = keypadMount.querySelector('.keypad-container');
    if (keypadContainer) {
      keypadContainer.classList.add('is-disabled');
      keypadContainer.classList.remove('keypad-prompt-pulse');
    }

    if (timerBar) {
      timerBar.style.transition = 'none';
      timerBar.style.width = '0%';
    }

    const isCorrect = chosenNumber === currentStimulus.count;
    const tappedBtn = keypadMount.querySelector(`[data-num="${chosenNumber}"]`);
    const correctBtn = keypadMount.querySelector(`[data-num="${currentStimulus.count}"]`);

    if (isCorrect) {
      if (tappedBtn) tappedBtn.classList.add('key-correct');
      score++;
      if (gameMode === 'classic') {
        roundResults.push(true);
      } else if (gameMode === 'streak') {
        streak++;
        const streakEl = container.querySelector('#streak-count-text');
        if (streakEl) streakEl.textContent = streak;
      } else if (gameMode === 'blitz') {
        const scoreEl = container.querySelector('#blitz-score-text');
        if (scoreEl) scoreEl.textContent = score;
      }

      playCorrect();
      if (mascot) mascot.innerHTML = renderCounti('cheer', 48);
      stage.classList.remove('is-flashing');
      stage.classList.add('feedback-correct');
      if (stage.parentElement) stage.parentElement.classList.add('stage-correct');
      stage.innerHTML = `
        <div class="feedback-badge-correct">
          <span class="feedback-star">⭐</span>
          <span class="feedback-number">${chosenNumber}</span>
        </div>
      `;

      // Celebration delay: plenty of time for star celebration, chime, and cheer
      // (Does NOT count towards the 60s timer in Blitz mode!)
      const nextDelay = (gameMode === 'blitz') ? 950 : (gameMode === 'streak' ? 1050 : 1200);

      const advanceRight = () => {
        if (reviewTimeout) {
          clearTimeout(reviewTimeout);
          reviewTimeout = null;
        }
        stage.removeEventListener('click', advanceRight);
        currentRound++;
        startRound();
      };

      reviewTimeout = setTimeout(advanceRight, nextDelay);
      stage.addEventListener('click', advanceRight);

    } else {
      // Incorrect answer
      if (gameMode === 'classic') {
        roundResults.push(false);
      }

      playWrong();
      if (tappedBtn) tappedBtn.classList.add('key-wrong');
      if (correctBtn) correctBtn.classList.add('key-hint-correct');

      if (mascot) mascot.innerHTML = renderCounti('encourage', 48);
      stage.classList.remove('is-flashing');
      stage.classList.add('feedback-wrong');
      if (stage.parentElement) stage.parentElement.classList.add('stage-wrong');
      stage.innerHTML = `
        <div class="feedback-wrong-wrapper">
          <div class="feedback-wrong-banner">
            <span class="wrong-choice-badge">❌ ${chosenNumber >= 0 ? chosenNumber : '⏱️'}</span>
            <span class="wrong-arrow">➔</span>
            <span class="correct-choice-badge">⭐ ${currentStimulus.count}</span>
          </div>
          <div class="feedback-reveal-wrap">
            ${currentStimulus.reviewHtml}
          </div>
        </div>
      `;

      if (gameMode === 'streak') {
        // Sudden Death! Game finishes on first mistake: 3.0s to clearly see what broke the streak
        const finishStreak = () => {
          if (reviewTimeout) {
            clearTimeout(reviewTimeout);
            reviewTimeout = null;
          }
          stage.removeEventListener('click', finishStreak);
          finishGame(true);
        };
        reviewTimeout = setTimeout(finishStreak, 3000);
        stage.addEventListener('click', finishStreak);
      } else {
        // Generous review time: 3.5s in Classic, 2.5s in Blitz (where timer is paused!)
        // Tapping card advances immediately if player doesn't want to wait
        const wrongDelay = (gameMode === 'blitz') ? 2500 : 3500;
        const advanceWrong = () => {
          if (reviewTimeout) {
            clearTimeout(reviewTimeout);
            reviewTimeout = null;
          }
          stage.removeEventListener('click', advanceWrong);
          currentRound++;
          startRound();
        };
        reviewTimeout = setTimeout(advanceWrong, wrongDelay);
        stage.addEventListener('click', advanceWrong);
      }
    }
  }

  function finishGame(wasSuddenDeath = false) {
    cleanupAllTimers();

    const resultMeta = recordGameResult({
      score,
      total: (gameMode === 'classic') ? totalRounds : score,
      speed,
      category,
      gameMode,
      streak,
      numberRange
    });

    onGameFinished({
      score,
      total: (gameMode === 'classic') ? totalRounds : score,
      speed,
      category,
      gameMode,
      streak,
      numberRange,
      earnedMedal: resultMeta.earnedMedal,
      isNewHighscore: resultMeta.isNewHighscore,
      wasSuddenDeath
    });
  }

  startRound();

  return {
    destroy: () => cleanupAllTimers()
  };
}
