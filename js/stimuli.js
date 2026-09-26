// Visual stimuli generator for BlitzCount
// Formats:
// 1. Fruits: Arranged in classic 3x3 dice formations without any bounding box (1-6 single dice pattern, 7-10 double dice 5+X) (1 to 10)
// 2. Dice: High-contrast 3x3 pip cards (1-6 single die, 7-10 double dice 5+X) (1 to 10)
// 3. Fingers: Accurate, unmistakable cartoon hands with 0 to 10 fingers (4 fingers has thumb tucked, 0 has both fists closed ✊ ✊)

const FRUIT_PALETTE = ['🍓', '🍌', '🍎', '🍉', '🍇', '🍊', '🍒', '🍍', '🥝', '🫐'];

// Pip positions in a 3x3 grid (row: 1..3, col: 1..3)
const DICE_PIP_MAP = {
  1: [[2, 2]],
  2: [[1, 1], [3, 3]],
  3: [[1, 1], [2, 2], [3, 3]],
  4: [[1, 1], [1, 3], [3, 1], [3, 3]],
  5: [[1, 1], [1, 3], [2, 2], [3, 1], [3, 3]],
  6: [[1, 1], [2, 1], [3, 1], [1, 3], [2, 3], [3, 3]]
};

export function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomFruit() {
  return FRUIT_PALETTE[Math.floor(Math.random() * FRUIT_PALETTE.length)];
}

// Render a floating 3x3 grid of fruits (NO bounding box card)
function renderFruitDiceGrid(value, fruit, offsetIndex = 0, showCountBadges = false) {
  const pips = DICE_PIP_MAP[value] || [];
  let fruitItems = '';

  pips.forEach(([r, c], idx) => {
    const badgeNum = offsetIndex + idx + 1;
    fruitItems += `
      <div class="fruit-pip r${r} c${c}">
        <span class="fruit-emoji">${fruit}</span>
        ${showCountBadges ? `<span class="count-badge">${badgeNum}</span>` : ''}
      </div>
    `;
  });

  return `
    <div class="fruit-dice-grid" data-count="${value}">
      ${fruitItems}
    </div>
  `;
}

// Partition a total (7 to 12) into two valid 6-sided dice faces [d1, d2]
export function getDicePartition(total) {
  if (total <= 6) return [total, 0];

  const pairs = [];
  const minD1 = Math.max(1, total - 6);
  const maxD1 = Math.min(6, total - 1);

  for (let d1 = minD1; d1 <= maxD1; d1++) {
    const d2 = total - d1;
    pairs.push([d1, d2]);
  }

  if (pairs.length === 0) {
    return [6, Math.min(6, total - 6)];
  }

  return pairs[Math.floor(Math.random() * pairs.length)];
}

// Generate Fruit Stimulus ordered like points on a dice (1 to 12, no box)
export function renderFruitsStimulus(count, fruit = '🍓', showCountBadges = false, partition = null) {
  const validCount = Math.max(1, Math.min(count, 12));

  if (validCount <= 6) {
    return `
      <div class="stimulus-fruits single-die-pattern ${showCountBadges ? 'show-badges' : ''}">
        ${renderFruitDiceGrid(validCount, fruit, 0, showCountBadges)}
      </div>
    `;
  }

  // 7 to 12: Two 3x3 dice patterns
  const [leftCount, rightCount] = partition || getDicePartition(validCount);

  return `
    <div class="stimulus-fruits double-die-pattern ${showCountBadges ? 'show-badges' : ''}">
      ${renderFruitDiceGrid(leftCount, fruit, 0, showCountBadges)}
      <span class="fruits-plus">+</span>
      ${renderFruitDiceGrid(rightCount, fruit, leftCount, showCountBadges)}
      ${showCountBadges ? `<div class="fruits-sum-formula">${leftCount} + ${rightCount} = ${validCount}</div>` : ''}
    </div>
  `;
}

// Render single die face card (1 to 6)
function renderDieFace(value, pipColor = '#2B3A67', offsetIndex = 0, showCountBadges = false) {
  const pips = DICE_PIP_MAP[value] || [];
  let pipElements = '';

  pips.forEach(([r, c], idx) => {
    const num = offsetIndex + idx + 1;
    pipElements += `
      <div class="dice-pip r${r} c${c}" style="background-color: ${pipColor};">
        <span class="pip-num">${num}</span>
      </div>
    `;
  });

  return `
    <div class="dice-card" data-val="${value}">
      <div class="dice-grid">
        ${pipElements}
      </div>
    </div>
  `;
}

// Generate High-Contrast Dice Stimulus (1 to 12)
export function renderDiceStimulus(count, showCountBadges = false, partition = null) {
  const validCount = Math.max(1, Math.min(count, 12));

  if (validCount <= 6) {
    return `
      <div class="stimulus-dice single-die ${showCountBadges ? 'show-badges' : ''}">
        ${renderDieFace(validCount, '#37474F', 0, showCountBadges)}
      </div>
    `;
  }

  // Double dice (7 to 12)
  const [die1, die2] = partition || getDicePartition(validCount);

  return `
    <div class="stimulus-dice double-dice ${showCountBadges ? 'show-badges' : ''}">
      ${renderDieFace(die1, '#2E7D32', 0, showCountBadges)}
      <span class="dice-plus">+</span>
      ${renderDieFace(die2, '#1565C0', die1, showCountBadges)}
      ${showCountBadges ? `<div class="dice-sum-formula">${die1} + ${die2} = ${validCount}</div>` : ''}
    </div>
  `;
}

// Render an unmistakable cartoon hand SVG showing exactly 0 to 5 fingers
// 0 = closed fist, 1 = index, 2 = index+middle, 3 = index+mid+ring,
// 4 = all 4 fingers UP with thumb tucked across palm (NOT Spock!), 5 = all 5 spread
function renderCartoonHand(fingerCount, isMirrored = false, badgeText = null) {
  const count = Math.max(0, Math.min(fingerCount, 5));
  const isThumbOut = count >= 5;
  const isIndexUp = count >= 1;
  const isMiddleUp = count >= 2;
  const isRingUp = count >= 3;
  const isPinkyUp = count >= 4;

  const stroke = '#BD6B24';
  const fill = '#FFDDAA';
  const strokeW = 3;

  const fingers = [
    { isUp: isIndexUp,  x: 28, yUp: 16, hUp: 50, yDn: 50, hDn: 22, w: 11 },
    { isUp: isMiddleUp, x: 42, yUp: 10, hUp: 56, yDn: 50, hDn: 22, w: 11 },
    { isUp: isRingUp,   x: 56, yUp: 16, hUp: 50, yDn: 50, hDn: 22, w: 11 },
    { isUp: isPinkyUp,  x: 70, yUp: 26, hUp: 40, yDn: 54, hDn: 18, w: 10 }
  ];

  let fingersSvg = '';
  fingers.forEach((f) => {
    const y = f.isUp ? f.yUp : f.yDn;
    const h = f.isUp ? f.hUp : f.hDn;
    const rx = f.w / 2;
    fingersSvg += `
      <rect x="${f.x}" y="${y}" width="${f.w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" />
    `;
  });

  const thumbSvg = isThumbOut
    ? `<path d="M 28 66 C 12 55, 8 40, 15 36 C 22 32, 26 48, 30 62 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" stroke-linejoin="round" />`
    : `<path d="M 28 66 C 36 68, 48 72, 46 80 C 44 86, 32 84, 26 76 Z" fill="#F5C492" stroke="${stroke}" stroke-width="${strokeW}" />`;

  const transform = isMirrored ? 'transform="scale(-1, 1) translate(-100, 0)"' : '';

  return `
    <div class="cartoon-hand-card">
      <svg class="hand-svg" viewBox="0 0 100 115" width="110" height="126" xmlns="http://www.w3.org/2000/svg">
        <g ${transform}>
          ${fingersSvg}
          <path d="M 24 64 
                   C 22 92, 34 104, 50 104 
                   C 66 104, 78 92, 76 64 
                   C 76 56, 24 56, 24 64 Z" 
                fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" />
          ${thumbSvg}
          <path d="M 36 82 Q 52 86 64 78" stroke="${stroke}" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6" />
        </g>
      </svg>
      ${badgeText !== null ? `<span class="finger-number-badge">${badgeText}</span>` : ''}
    </div>
  `;
}

// Generate Hand / Finger Counting Stimulus (0 to 10)
export function renderFingersStimulus(count, showCountBadges = false, singleHandZero = false) {
  const validCount = Math.max(0, Math.min(count, 10));

  if (validCount === 0) {
    if (singleHandZero) {
      return `
        <div class="stimulus-fingers single-hand zero-fingers ${showCountBadges ? 'show-badges' : ''}">
          ${renderCartoonHand(0, false, showCountBadges ? '0' : null)}
          ${showCountBadges ? `<div class="finger-sum-formula">0</div>` : ''}
        </div>
      `;
    }
    // Both hands showing 0 fingers (two closed fists)
    return `
      <div class="stimulus-fingers zero-fingers ${showCountBadges ? 'show-badges' : ''}">
        ${renderCartoonHand(0, false, showCountBadges ? '0' : null)}
        ${renderCartoonHand(0, true, showCountBadges ? '0' : null)}
        ${showCountBadges ? `<div class="finger-sum-formula">0 + 0 = 0</div>` : ''}
      </div>
    `;
  }

  if (validCount <= 5) {
    return `
      <div class="stimulus-fingers single-hand ${showCountBadges ? 'show-badges' : ''}">
        ${renderCartoonHand(validCount, false, showCountBadges ? validCount : null)}
      </div>
    `;
  }

  // 6 to 10: 5 fingers on Left Hand + remainder on Right Hand
  const rightHandCount = validCount - 5;

  return `
    <div class="stimulus-fingers double-hand ${showCountBadges ? 'show-badges' : ''}">
      ${renderCartoonHand(5, false, showCountBadges ? '5' : null)}
      <span class="hand-plus">+</span>
      ${renderCartoonHand(rightHandCount, true, showCountBadges ? rightHandCount : null)}
      ${showCountBadges ? `<div class="finger-sum-formula">5 + ${rightHandCount} = ${validCount}</div>` : ''}
    </div>
  `;
}

// Unified generator for a game round
export function createStimulus(category, targetNumber = null, numberRange = 'advanced') {
  let resolvedCategory = category;

  if (category === 'mixed') {
    const cats = ['fruits', 'dice', 'fingers'];
    resolvedCategory = cats[Math.floor(Math.random() * cats.length)];
  }

  const isEasy = numberRange === 'easy';
  const minCount = (resolvedCategory === 'fingers') ? 0 : 1;
  const maxCount = isEasy 
    ? ((resolvedCategory === 'fingers') ? 5 : 6)
    : ((resolvedCategory === 'fingers') ? 10 : 12);

  const count = targetNumber !== null ? targetNumber : getRandomNumber(minCount, maxCount);
  const fruit = getRandomFruit();
  const partition = (resolvedCategory !== 'fingers' && count > 6) ? getDicePartition(count) : null;

  let html = '';
  let reviewHtml = '';

  switch (resolvedCategory) {
    case 'dice':
      html = renderDiceStimulus(count, false, partition);
      reviewHtml = renderDiceStimulus(count, true, partition);
      break;

    case 'fingers':
      html = renderFingersStimulus(count, false, isEasy);
      reviewHtml = renderFingersStimulus(count, true, isEasy);
      break;

    case 'fruits':
    default:
      resolvedCategory = 'fruits';
      html = renderFruitsStimulus(count, fruit, false, partition);
      reviewHtml = renderFruitsStimulus(count, fruit, true, partition);
      break;
  }

  return {
    category: resolvedCategory,
    count,
    fruit,
    partition,
    html,
    reviewHtml,
    numberRange
  };
}
