// Counti the Kawaii Capybara mascot SVG generator
// Authentic Capybara anatomy:
// - Characteristic flat-topped blocky rectangular head & barrel/loaf body
// - Small rounded ears set far back and to the sides
// - High-set wide eyes with chill zen kawaii cuteness
// - Broad, blunt rectangular snout with classic capybara nostrils (\ /)
// - Iconic Japanese onsen yuzu/orange on its flat head

export function renderCounti(mood = 'idle', size = 120) {
  let eyesSvg = '';
  let mouthSvg = '';
  let extrasSvg = '';
  let animationClass = 'counti-idle';

  switch (mood) {
    case 'cheer':
      animationClass = 'counti-bounce';
      eyesSvg = `
        <path d="M 32 46 Q 38 38 44 46" stroke="#2C1810" stroke-width="3" stroke-linecap="round" fill="none" />
        <path d="M 76 46 Q 82 38 88 46" stroke="#2C1810" stroke-width="3" stroke-linecap="round" fill="none" />
      `;
      mouthSvg = `
        <path d="M 54 74 Q 60 80 66 74" stroke="#2C1810" stroke-width="2.6" stroke-linecap="round" fill="none" />
      `;
      extrasSvg = `
        <text x="12" y="30" font-size="16" class="sparkle-float">✨</text>
        <text x="92" y="26" font-size="16" class="sparkle-float-delay">✨</text>
        <!-- Cheering Paws Up -->
        <ellipse cx="26" cy="76" rx="8" ry="12" transform="rotate(-30 26 76)" fill="#8A5122" />
        <ellipse cx="94" cy="76" rx="8" ry="12" transform="rotate(30 94 76)" fill="#8A5122" />
      `;
      break;

    case 'victory':
      animationClass = 'counti-triumph';
      eyesSvg = `
        <ellipse cx="38" cy="46" rx="4.5" ry="5.5" fill="#2C1810" />
        <circle cx="36" cy="44" r="1.8" fill="#FFF" />
        <ellipse cx="82" cy="46" rx="4.5" ry="5.5" fill="#2C1810" />
        <circle cx="80" cy="44" r="1.8" fill="#FFF" />
      `;
      mouthSvg = `
        <path d="M 53 73 Q 60 80 67 73" stroke="#2C1810" stroke-width="2.6" stroke-linecap="round" fill="none" />
      `;
      extrasSvg = `
        <!-- Party Hat on Capybara's Flat Head -->
        <polygon points="60,6 48,32 72,32" fill="#FF4081" />
        <polygon points="60,6 54,32 66,32" fill="#FFEB3B" />
        <circle cx="60" cy="5" r="4" fill="#FFD700" />
        
        <!-- Golden Medal with Blue Ribbon -->
        <path d="M 46 84 L 60 94 L 74 84" stroke="#2196F3" stroke-width="4" fill="none" stroke-linecap="round" />
        <circle cx="60" cy="98" r="9" fill="#FFD700" stroke="#FFA000" stroke-width="1.5" />
        <text x="60" y="102" font-size="9" text-anchor="middle" font-weight="bold" fill="#795548">1</text>
      `;
      break;

    case 'encourage':
      animationClass = 'counti-nod';
      eyesSvg = `
        <ellipse cx="38" cy="46" rx="4" ry="5" fill="#2C1810" />
        <circle cx="36" cy="44" r="1.5" fill="#FFF" />
        <ellipse cx="82" cy="46" rx="4" ry="5" fill="#2C1810" />
        <circle cx="80" cy="44" r="1.5" fill="#FFF" />
      `;
      mouthSvg = `
        <path d="M 55 74 Q 60 78 65 74" stroke="#2C1810" stroke-width="2.2" stroke-linecap="round" fill="none" />
      `;
      extrasSvg = `
        <text x="82" y="86" font-size="16">🌸</text>
      `;
      break;

    case 'idle':
    default:
      animationClass = 'counti-idle';
      eyesSvg = `
        <ellipse cx="38" cy="46" rx="4.5" ry="5.5" fill="#2C1810" />
        <circle cx="36.5" cy="44.5" r="1.8" fill="#FFF" />
        <ellipse cx="82" cy="46" rx="4.5" ry="5.5" fill="#2C1810" />
        <circle cx="80.5" cy="44.5" r="1.8" fill="#FFF" />
      `;
      mouthSvg = `
        <path d="M 54 74 Q 60 77 66 74" stroke="#2C1810" stroke-width="2.2" stroke-linecap="round" fill="none" />
      `;
      extrasSvg = `
        <!-- Iconic Yuzu/Orange resting gently on flat capybara head -->
        <circle cx="60" cy="22" r="8" fill="#FFA726" />
        <circle cx="60" cy="22" r="8" fill="url(#orangeGrad)" />
        <path d="M 60 14 Q 63 10 66 12" stroke="#4CAF50" stroke-width="2.2" fill="none" stroke-linecap="round" />
        <circle cx="65" cy="11" r="2.2" fill="#66BB6A" />
      `;
      break;
  }

  return `
    <svg class="counti-mascot ${animationClass}" viewBox="0 0 120 120" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Warm Capybara brown fur gradient -->
        <linearGradient id="capyFur" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#BA7C46" />
          <stop offset="100%" stop-color="#8F5323" />
        </linearGradient>
        <!-- Distinctive broad snout gradient -->
        <linearGradient id="capySnout" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#8B5121" />
          <stop offset="100%" stop-color="#683610" />
        </linearGradient>
        <radialGradient id="orangeGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#FFB74D" />
          <stop offset="100%" stop-color="#F57C00" />
        </radialGradient>
      </defs>

      <!-- Soft Ground Shadow -->
      <ellipse cx="60" cy="112" rx="38" ry="6" fill="rgba(0,0,0,0.12)" />

      <!-- Small Rounded Capybara Ears set to the sides of the head -->
      <ellipse cx="22" cy="38" rx="7" ry="8" fill="#8F5323" transform="rotate(-15 22 38)" />
      <ellipse cx="23" cy="38" rx="4" ry="5" fill="#5D320F" transform="rotate(-15 23 38)" />
      
      <ellipse cx="98" cy="38" rx="7" ry="8" fill="#8F5323" transform="rotate(15 98 38)" />
      <ellipse cx="97" cy="38" rx="4" ry="5" fill="#5D320F" transform="rotate(15 97 38)" />

      <!-- Body / Lower torso (barrel/loaf shape) -->
      <path d="M 28 80 C 24 96, 32 108, 60 108 C 88 108, 96 96, 92 80 Z" fill="#8F5323" />
      
      <!-- Resting Paws -->
      <ellipse cx="44" cy="98" rx="7" ry="5" fill="#683610" />
      <ellipse cx="76" cy="98" rx="7" ry="5" fill="#683610" />

      <!-- Characteristic Flat-Topped Blocky Capybara Head -->
      <!-- Flat top, slopes down to blunt cheeks -->
      <path d="M 34 32 
               L 86 32 
               C 96 32, 100 46, 98 64 
               C 96 82, 88 90, 60 90 
               C 32 90, 24 82, 22 64 
               C 20 46, 24 32, 34 32 Z" 
            fill="url(#capyFur)" />

      <!-- Prominent Blunt / Boxy Capybara Snout (Broad rounded rectangle) -->
      <rect x="36" y="52" width="48" height="34" rx="14" fill="url(#capySnout)" />

      <!-- Iconic Capybara Nostrils: wide-spaced angled slits -->
      <path d="M 48 60 C 47 64, 49 66, 52 64" stroke="#2C1810" stroke-width="3" stroke-linecap="round" fill="none" />
      <path d="M 72 60 C 73 64, 71 66, 68 64" stroke="#2C1810" stroke-width="3" stroke-linecap="round" fill="none" />
      
      <!-- Vertical philtrum from snout to mouth -->
      <line x1="60" y1="64" x2="60" y2="73" stroke="#2C1810" stroke-width="2.2" stroke-linecap="round" />

      <!-- Subtle Kawaii Rosy Cheeks -->
      <ellipse cx="30" cy="62" rx="5" ry="3.5" fill="#FF8A80" opacity="0.6" />
      <ellipse cx="90" cy="62" rx="5" ry="3.5" fill="#FF8A80" opacity="0.6" />

      <!-- Eyes -->
      ${eyesSvg}

      <!-- Mouth -->
      ${mouthSvg}

      <!-- Extras (Orange, Hat, Sparkles, Paws) -->
      ${extrasSvg}
    </svg>
  `;
}
