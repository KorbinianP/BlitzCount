// Counti the Kawaii Capybara mascot SVG generator
// Beautiful, crisp, infinitely scalable vector mascot for BlitzCount / ZählFix

export function renderCounti(mood = 'idle', size = 120) {
  let eyes = '';
  let mouth = '';
  let paws = '';
  let extras = '';
  let animationClass = '';

  switch (mood) {
    case 'cheer':
      animationClass = 'counti-bounce';
      eyes = `
        <path d="M 38 48 Q 45 40 52 48" stroke="#3D271D" stroke-width="3.5" stroke-linecap="round" fill="none" />
        <path d="M 68 48 Q 75 40 82 48" stroke="#3D271D" stroke-width="3.5" stroke-linecap="round" fill="none" />
      `;
      mouth = `
        <path d="M 54 62 Q 60 70 66 62" stroke="#3D271D" stroke-width="3" stroke-linecap="round" fill="#E86A82" />
      `;
      paws = `
        <ellipse cx="28" cy="62" rx="7" ry="10" transform="rotate(-30 28 62)" fill="#8B5A2B" />
        <ellipse cx="92" cy="62" rx="7" ry="10" transform="rotate(30 92 62)" fill="#8B5A2B" />
      `;
      extras = `
        <text x="14" y="32" font-size="16" class="sparkle-float">✨</text>
        <text x="92" y="28" font-size="16" class="sparkle-float-delay">✨</text>
      `;
      break;

    case 'victory':
      animationClass = 'counti-triumph';
      eyes = `
        <ellipse cx="44" cy="46" rx="5" ry="6" fill="#3D271D" />
        <circle cx="42" cy="44" r="2" fill="#FFF" />
        <ellipse cx="76" cy="46" rx="5" ry="6" fill="#3D271D" />
        <circle cx="74" cy="44" r="2" fill="#FFF" />
      `;
      mouth = `
        <path d="M 52 59 Q 60 68 68 59" stroke="#3D271D" stroke-width="3" stroke-linecap="round" fill="#E86A82" />
      `;
      paws = `
        <ellipse cx="44" cy="88" rx="8" ry="6" fill="#8B5A2B" />
        <ellipse cx="76" cy="88" rx="8" ry="6" fill="#8B5A2B" />
      `;
      extras = `
        <!-- Party Hat -->
        <polygon points="60,6 48,30 72,30" fill="#FF4081" />
        <polygon points="60,6 54,30 66,30" fill="#FFEB3B" />
        <circle cx="60" cy="5" r="4" fill="#FFEB3B" />
        
        <!-- Gold Medal with ribbon -->
        <path d="M 46 76 L 60 88 L 74 76" stroke="#2196F3" stroke-width="4" fill="none" stroke-linecap="round" />
        <circle cx="60" cy="94" r="9" fill="#FFD700" stroke="#FFA000" stroke-width="1.5" />
        <text x="60" y="98" font-size="9" text-anchor="middle" font-weight="bold" fill="#795548">1</text>
      `;
      break;

    case 'encourage':
      animationClass = 'counti-nod';
      eyes = `
        <ellipse cx="45" cy="47" rx="4.5" ry="5.5" fill="#3D271D" />
        <circle cx="43" cy="45" r="1.8" fill="#FFF" />
        <ellipse cx="75" cy="47" rx="4.5" ry="5.5" fill="#3D271D" />
        <circle cx="73" cy="45" r="1.8" fill="#FFF" />
      `;
      mouth = `
        <path d="M 55 60 Q 60 65 65 60" stroke="#3D271D" stroke-width="2.8" stroke-linecap="round" fill="none" />
      `;
      paws = `
        <ellipse cx="44" cy="88" rx="7" ry="5" fill="#8B5A2B" />
        <ellipse cx="76" cy="86" rx="7" ry="5" fill="#8B5A2B" />
      `;
      extras = `
        <text x="80" y="86" font-size="16">🌸</text>
      `;
      break;

    case 'idle':
    default:
      animationClass = 'counti-idle';
      eyes = `
        <ellipse cx="44" cy="47" rx="5" ry="6" fill="#3D271D" />
        <circle cx="42" cy="45" r="2" fill="#FFF" />
        <ellipse cx="76" cy="47" rx="5" ry="6" fill="#3D271D" />
        <circle cx="74" cy="45" r="2" fill="#FFF" />
      `;
      mouth = `
        <path d="M 54 60 Q 60 64 66 60" stroke="#3D271D" stroke-width="2.8" stroke-linecap="round" fill="none" />
      `;
      paws = `
        <ellipse cx="44" cy="88" rx="8" ry="6" fill="#8B5A2B" />
        <ellipse cx="76" cy="88" rx="8" ry="6" fill="#8B5A2B" />
      `;
      extras = `
        <!-- Capybara signature little orange / yuzu on head -->
        <circle cx="60" cy="22" r="7" fill="#FFA726" />
        <path d="M 60 15 Q 63 12 65 14" stroke="#4CAF50" stroke-width="2" fill="none" stroke-linecap="round" />
        <circle cx="64" cy="13" r="2" fill="#66BB6A" />
      `;
      break;
  }

  return `
    <svg class="counti-mascot ${animationClass}" width="${size}" height="${size}" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bodyGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#C68B59" />
          <stop offset="100%" stop-color="#9E6335" />
        </radialGradient>
        <linearGradient id="snoutGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#DEB088" />
          <stop offset="100%" stop-color="#C28E61" />
        </linearGradient>
      </defs>

      <!-- Background Glow / Shadow -->
      <ellipse cx="60" cy="112" rx="36" ry="6" fill="rgba(0,0,0,0.12)" />

      <!-- Ears -->
      <ellipse cx="32" cy="30" rx="8" ry="9" fill="#9E6335" transform="rotate(-15 32 30)" />
      <ellipse cx="33" cy="31" rx="4.5" ry="5.5" fill="#6E401F" transform="rotate(-15 33 31)" />
      
      <ellipse cx="88" cy="30" rx="8" ry="9" fill="#9E6335" transform="rotate(15 88 30)" />
      <ellipse cx="87" cy="31" rx="4.5" ry="5.5" fill="#6E401F" transform="rotate(15 87 31)" />

      <!-- Body / Main chubby shape -->
      <path d="M 32 44 
               C 22 55, 20 85, 28 100 
               C 34 110, 86 110, 92 100 
               C 100 85, 98 55, 88 44 
               C 80 34, 40 34, 32 44 Z" 
            fill="url(#bodyGrad)" />

      <!-- Chubby Snout -->
      <path d="M 40 54 
               C 40 44, 80 44, 80 54 
               C 80 72, 40 72, 40 54 Z" 
            fill="url(#snoutGrad)" />

      <!-- Cute Dark Snout Nose -->
      <ellipse cx="60" cy="54" rx="8" ry="5" fill="#3D271D" />
      <circle cx="57" cy="53" r="1.5" fill="#6E401F" />
      <circle cx="63" cy="53" r="1.5" fill="#6E401F" />

      <!-- Cheeks (Rosy Pink Kawaii Blush) -->
      <ellipse cx="34" cy="55" rx="6" ry="4" fill="#FF8A80" opacity="0.65" />
      <ellipse cx="86" cy="55" rx="6" ry="4" fill="#FF8A80" opacity="0.65" />

      <!-- Eyes & Mouth depending on mood -->
      ${eyes}
      ${mouth}

      <!-- Paws -->
      ${paws}

      <!-- Extras (Hat, Medal, Orange, etc.) -->
      ${extras}
    </svg>
  `;
}
