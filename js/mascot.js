// Counti the Kawaii Capybara mascot SVG generator
// Warm chibi cartoon aesthetic:
// - Friendly dark-chocolate cartoon outline (stroke: #452615)
// - Warm milk-caramel body (#D29873) with a distinct darker brown rounded snout (#935A39)
// - Rosy blush cheeks (#FF8FA3) and wide-set expressive kawaii eyes
// - Characteristic capybara nostrils and vertical philtrum
// - Chubby seated potato/loaf body with little stubby front paws and toe lines
// - 100% original vector geometry

export function renderCounti(mood = 'idle', size = 120) {
  let eyesSvg = '';
  let mouthSvg = '';
  let pawsSvg = '';
  let extrasSvg = '';
  let animationClass = 'counti-idle';

  const strokeColor = '#452615';
  const bodyColor = '#D29873';
  const snoutColor = '#935A39';
  const innerEarColor = '#80492B';
  const cheekColor = '#FF8FA3';

  switch (mood) {
    case 'cheer':
      animationClass = 'counti-bounce';
      // Happy rainbow-arc eyes ^ ^
      eyesSvg = `
        <path d="M 32 44 Q 37 38 42 44" stroke="${strokeColor}" stroke-width="3.2" stroke-linecap="round" fill="none" />
        <path d="M 78 44 Q 83 38 88 44" stroke="${strokeColor}" stroke-width="3.2" stroke-linecap="round" fill="none" />
      `;
      // Open happy mouth with pink tongue
      mouthSvg = `
        <path d="M 53 62 Q 60 71 67 62 Z" fill="#D32F2F" stroke="${strokeColor}" stroke-width="2.4" stroke-linejoin="round" />
        <path d="M 56 65 Q 60 70 64 65 Z" fill="#FF8FA3" />
      `;
      // Cheering raised paws
      pawsSvg = `
        <ellipse cx="26" cy="74" rx="7.5" ry="11" transform="rotate(-35 26 74)" fill="${bodyColor}" stroke="${strokeColor}" stroke-width="2.8" />
        <ellipse cx="94" cy="74" rx="7.5" ry="11" transform="rotate(35 94 74)" fill="${bodyColor}" stroke="${strokeColor}" stroke-width="2.8" />
      `;
      extrasSvg = `
        <text x="12" y="28" font-size="16" class="sparkle-float">✨</text>
        <text x="92" y="24" font-size="16" class="sparkle-float-delay">✨</text>
      `;
      break;

    case 'victory':
      animationClass = 'counti-triumph';
      // Proud sparkling eyes
      eyesSvg = `
        <ellipse cx="37" cy="44" rx="4.5" ry="5.5" fill="${strokeColor}" />
        <circle cx="35.5" cy="42" r="1.8" fill="#FFF" />
        <circle cx="38.5" cy="46" r="0.9" fill="#FFF" />
        <ellipse cx="83" cy="44" rx="4.5" ry="5.5" fill="${strokeColor}" />
        <circle cx="81.5" cy="42" r="1.8" fill="#FFF" />
        <circle cx="84.5" cy="46" r="0.9" fill="#FFF" />
      `;
      // Big triumphant smile
      mouthSvg = `
        <path d="M 52 62 Q 60 69 68 62" stroke="${strokeColor}" stroke-width="2.8" stroke-linecap="round" fill="none" />
      `;
      // Sitting paws
      pawsSvg = `
        <g class="front-paws">
          <ellipse cx="49" cy="104" rx="7" ry="5.5" fill="${bodyColor}" stroke="${strokeColor}" stroke-width="2.6" />
          <line x1="49" y1="102" x2="49" y2="108" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" />
          <ellipse cx="71" cy="104" rx="7" ry="5.5" fill="${bodyColor}" stroke="${strokeColor}" stroke-width="2.6" />
          <line x1="71" y1="102" x2="71" y2="108" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" />
        </g>
      `;
      extrasSvg = `
        <!-- Festive Striped Party Hat -->
        <polygon points="60,2 48,26 72,26" fill="#FF5252" stroke="${strokeColor}" stroke-width="2.6" stroke-linejoin="round" />
        <path d="M 52 19 L 68 19 M 55 12 L 65 12" stroke="#FFD54F" stroke-width="2.8" stroke-linecap="round" />
        <circle cx="60" cy="2" r="3.5" fill="#FFD54F" stroke="${strokeColor}" stroke-width="1.8" />
        
        <!-- Golden Medal with Royal Blue Ribbon -->
        <path d="M 47 82 L 60 92 L 73 82" stroke="#1E88E5" stroke-width="4.5" fill="none" stroke-linecap="round" />
        <circle cx="60" cy="96" r="9" fill="#FFD54F" stroke="#FFA000" stroke-width="1.8" />
        <text x="60" y="100" font-size="9" text-anchor="middle" font-weight="900" fill="#795548">1</text>
      `;
      break;

    case 'encourage':
      animationClass = 'counti-nod';
      // Warm, sweet caring eyes
      eyesSvg = `
        <ellipse cx="37" cy="44" rx="4.2" ry="5" fill="${strokeColor}" />
        <circle cx="35.5" cy="42" r="1.6" fill="#FFF" />
        <ellipse cx="83" cy="44" rx="4.2" ry="5" fill="${strokeColor}" />
        <circle cx="81.5" cy="42" r="1.6" fill="#FFF" />
      `;
      // Gentle warm smile
      mouthSvg = `
        <path d="M 54 62 Q 60 66 66 62" stroke="${strokeColor}" stroke-width="2.4" stroke-linecap="round" fill="none" />
      `;
      pawsSvg = `
        <g class="front-paws">
          <ellipse cx="49" cy="104" rx="7" ry="5.5" fill="${bodyColor}" stroke="${strokeColor}" stroke-width="2.6" />
          <line x1="49" y1="102" x2="49" y2="108" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" />
          <ellipse cx="71" cy="104" rx="7" ry="5.5" fill="${bodyColor}" stroke="${strokeColor}" stroke-width="2.6" />
          <line x1="71" y1="102" x2="71" y2="108" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" />
        </g>
      `;
      extrasSvg = `
        <!-- Cheerful encouraging flower -->
        <text x="76" y="86" font-size="18">🌸</text>
      `;
      break;

    case 'idle':
    default:
      animationClass = 'counti-idle';
      // Relaxed, calm, curious open eyes
      eyesSvg = `
        <ellipse cx="37" cy="44" rx="4.5" ry="5.5" fill="${strokeColor}" />
        <circle cx="35.5" cy="42" r="1.8" fill="#FFF" />
        <circle cx="38.5" cy="45.5" r="0.9" fill="#FFF" />
        <ellipse cx="83" cy="44" rx="4.5" ry="5.5" fill="${strokeColor}" />
        <circle cx="81.5" cy="42" r="1.8" fill="#FFF" />
        <circle cx="84.5" cy="45.5" r="0.9" fill="#FFF" />
      `;
      // Sweet peaceful smile
      mouthSvg = `
        <path d="M 53 62 Q 60 67 67 62" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round" fill="none" />
      `;
      pawsSvg = `
        <g class="front-paws">
          <ellipse cx="49" cy="104" rx="7" ry="5.5" fill="${bodyColor}" stroke="${strokeColor}" stroke-width="2.6" />
          <line x1="49" y1="102" x2="49" y2="108" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" />
          <ellipse cx="71" cy="104" rx="7" ry="5.5" fill="${bodyColor}" stroke="${strokeColor}" stroke-width="2.6" />
          <line x1="71" y1="102" x2="71" y2="108" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" />
        </g>
      `;
      extrasSvg = `
        <!-- Iconic Japanese onsen Yuzu / Orange on Counti's head -->
        <circle cx="60" cy="19" r="8" fill="#FFA726" stroke="${strokeColor}" stroke-width="2.2" />
        <!-- Little green stem & leaf -->
        <path d="M 60 11 Q 64 7 67 9 Q 64 14 60 11 Z" fill="#66BB6A" stroke="${strokeColor}" stroke-width="1.6" />
      `;
      break;
  }

  return `
    <svg class="counti-mascot ${animationClass}" viewBox="0 0 120 120" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <!-- Soft Ambient Shadow -->
      <ellipse cx="60" cy="113" rx="38" ry="5.5" fill="rgba(69, 38, 21, 0.14)" />

      <!-- Cute Small Rounded Capybara Ears -->
      <ellipse cx="27" cy="30" rx="7.5" ry="8.5" transform="rotate(-20 27 30)" fill="${bodyColor}" stroke="${strokeColor}" stroke-width="3" />
      <ellipse cx="28" cy="31" rx="4" ry="5" transform="rotate(-20 27 30)" fill="${innerEarColor}" />

      <ellipse cx="93" cy="30" rx="7.5" ry="8.5" transform="rotate(20 93 30)" fill="${bodyColor}" stroke="${strokeColor}" stroke-width="3" />
      <ellipse cx="92" cy="31" rx="4" ry="5" transform="rotate(20 93 30)" fill="${innerEarColor}" />

      <!-- Chubby Loaf Body (Seated posture) -->
      <path d="M 36 68 
               C 22 76, 18 92, 21 102 
               C 24 109, 34 110, 60 110 
               C 86 110, 96 109, 99 102 
               C 102 92, 98 76, 84 68 Z" 
            fill="${bodyColor}" 
            stroke="${strokeColor}" 
            stroke-width="3.2" 
            stroke-linejoin="round" />

      <!-- Characteristic Capybara Head Shape (Flat-topped crown, soft sloping cheeks) -->
      <path d="M 37 26 
               Q 60 23 83 26 
               C 97 29, 99 48, 97 63 
               C 95 76, 83 80, 60 80 
               C 37 80, 25 76, 23 63 
               C 21 48, 23 29, 37 26 Z" 
            fill="${bodyColor}" 
            stroke="${strokeColor}" 
            stroke-width="3.2" 
            stroke-linejoin="round" />

      <!-- Distinctive Darker Snout / Muzzle Patch (Vertical rounded bean/oval) -->
      <path d="M 44 45 
               C 44 38, 76 38, 76 45 
               C 77 56, 78 72, 60 72 
               C 42 72, 43 56, 44 45 Z" 
            fill="${snoutColor}" 
            stroke="${strokeColor}" 
            stroke-width="2.8" 
            stroke-linejoin="round" />

      <!-- Capybara Nostril Slits -->
      <path d="M 52 51 C 51 54, 53 56, 56 54" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round" fill="none" />
      <path d="M 68 51 C 69 54, 67 56, 64 54" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round" fill="none" />
      
      <!-- Philtrum Line -->
      <line x1="60" y1="53" x2="60" y2="61" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round" />

      <!-- Rosy Blush Cheeks -->
      <ellipse cx="31" cy="56" rx="5.5" ry="4" fill="${cheekColor}" opacity="0.9" />
      <ellipse cx="89" cy="56" rx="5.5" ry="4" fill="${cheekColor}" opacity="0.9" />

      <!-- Eyes -->
      ${eyesSvg}

      <!-- Mouth -->
      ${mouthSvg}

      <!-- Front Paws -->
      ${pawsSvg}

      <!-- Mood-Specific Extras (Orange, Party Hat, Medal, Flower, Sparkles) -->
      ${extrasSvg}
    </svg>
  `;
}
