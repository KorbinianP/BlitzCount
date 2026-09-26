// Internationalization module for BlitzCount (EN) / ZählFix (DE)
export const translations = {
  en: {
    appTitle: 'BlitzCount',
    tagline: 'Quick Number Flash with Counti',
    play: 'Play',
    replay: 'Play Again',
    home: 'Home',
    speeds: {
      turtle: 'Turtle (2.5s)',
      bunny: 'Bunny (1.2s)',
      cheetah: 'Cheetah (0.6s)',
      rocket: 'Rocket (0.3s)'
    },
    categories: {
      fruits: 'Fruits',
      dice: 'Dice',
      fingers: 'Fingers',
      mixed: 'Mixed'
    },
    results: {
      gold: 'Spectacular! Perfect Score!',
      silver: 'Super Job!',
      bronze: 'Great Work!',
      tryAgain: 'Good Practice! Try again!',
      newMedal: 'New Medal!'
    },
    roundLabel: 'Round',
    settings: {
      title: 'Parent Settings',
      childLockHint: 'Hold ⚙️ for 3 seconds to unlock',
      unlocked: 'Settings Unlocked',
      roundsCount: 'Rounds per game',
      flashDuration: 'Flash time (seconds)',
      sound: 'Sound Effects',
      language: 'Language',
      profiles: 'Players & Profiles',
      addPlayer: '+ New Player',
      save: 'Save & Close',
      close: 'Back',
      resetScores: 'Reset Scores',
      confirmReset: 'Reset all scores for this profile?',
      trophies: 'Trophy Room'
    },
    profileModal: {
      title: 'Choose Your Player',
      nameLabel: 'Player Name',
      createButton: 'Save Player'
    },
    trophyRoom: {
      title: 'Trophy Room',
      medals: 'Medals Collected',
      highscores: 'Best Scores'
    }
  },
  de: {
    appTitle: 'ZählFix',
    tagline: 'Blitzschnell Zählen mit Counti',
    play: 'Spielen',
    replay: 'Nochmal',
    home: 'Start',
    speeds: {
      turtle: 'Schildkröte (2,5s)',
      bunny: 'Hase (1,2s)',
      cheetah: 'Gepard (0,6s)',
      rocket: 'Rakete (0,3s)'
    },
    categories: {
      fruits: 'Früchte',
      dice: 'Würfel',
      fingers: 'Finger',
      mixed: 'Gemischt'
    },
    results: {
      gold: 'Fantastisch! Volle Punktzahl!',
      silver: 'Klasse gemacht!',
      bronze: 'Super geübt!',
      tryAgain: 'Toll mitgemacht! Gleich nochmal!',
      newMedal: 'Neue Medaille!'
    },
    roundLabel: 'Runde',
    settings: {
      title: 'Eltern-Einstellungen',
      childLockHint: '⚙️ 3 Sekunden gedrückt halten zum Entsperren',
      unlocked: 'Einstellungen geöffnet',
      roundsCount: 'Runden pro Spiel',
      flashDuration: 'Anzeigedauer (Sekunden)',
      sound: 'Soundeffekte',
      language: 'Sprache',
      profiles: 'Spieler & Profile',
      addPlayer: '+ Neuer Spieler',
      save: 'Speichern & Schließen',
      close: 'Zurück',
      resetScores: 'Punkte zurücksetzen',
      confirmReset: 'Alle Rekorde für dieses Profil zurücksetzen?',
      trophies: 'Trophy Room'
    },
    profileModal: {
      title: 'Wähle deinen Spieler',
      nameLabel: 'Name',
      createButton: 'Speichern'
    },
    trophyRoom: {
      title: 'Trophäen-Zimmer',
      medals: 'Gesammelte Medaillen',
      highscores: 'Beste Runden'
    }
  }
};

let currentLang = 'de';

export function setLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
  }
}

export function getLanguage() {
  return currentLang;
}

export function t(keyPath) {
  const keys = keyPath.split('.');
  let obj = translations[currentLang] || translations.de;
  for (const k of keys) {
    if (obj && obj[k] !== undefined) {
      obj = obj[k];
    } else {
      let fallback = translations.en;
      for (const fk of keys) {
        fallback = fallback ? fallback[fk] : undefined;
      }
      return fallback !== undefined ? fallback : keyPath;
    }
  }
  return obj;
}
