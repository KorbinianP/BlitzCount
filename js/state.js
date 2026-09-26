// Reactive State Management & LocalStorage Persistence for BlitzCount

const STORAGE_KEY = 'blitzcount_v1_state';

const DEFAULT_AVATARS = ['🦁', '🦄', '🐶', '🐱', '🐻', '🦊', '🦕', '🐼', '🐸', '🚀'];

const DEFAULT_DURATIONS = {
  turtle: 2.5,
  bunny: 1.2,
  cheetah: 0.6,
  rocket: 0.3,
  rocketLimit: 3.0
};

const INITIAL_STATE = {
  language: 'de',
  soundEnabled: true,
  settings: {
    gameMode: 'classic', // 'classic' | 'blitz' | 'streak'
    numberRange: 'advanced', // 'easy' (0-5 / 1-6) | 'advanced' (0-10 / 1-12)
    speed: 'turtle',
    category: 'fruits',
    rounds: 10,
    blitzTime: 60,
    durations: { ...DEFAULT_DURATIONS }
  },
  activeProfileId: 'profile-1',
  profiles: [
    {
      id: 'profile-1',
      name: 'Player 1',
      avatar: '🦁',
      medals: { gold: 0, silver: 0, bronze: 0 },
      highscores: {}
    }
  ]
};

let currentState = loadState();
const listeners = new Set();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...INITIAL_STATE,
        ...parsed,
        settings: {
          ...INITIAL_STATE.settings,
          ...(parsed.settings || {}),
          durations: {
            ...INITIAL_STATE.settings.durations,
            ...((parsed.settings && parsed.settings.durations) || {})
          }
        }
      };
    }
  } catch (e) {
    console.warn('Failed to load local storage state:', e);
  }
  return JSON.parse(JSON.stringify(INITIAL_STATE));
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
  } catch (e) {
    console.warn('Failed to save state to localStorage:', e);
  }
  notify();
}

function notify() {
  listeners.forEach((fn) => {
    try {
      fn(currentState);
    } catch (e) {
      console.error('Subscriber error:', e);
    }
  });
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getState() {
  return currentState;
}

export function getActiveProfile() {
  const p = currentState.profiles.find((x) => x.id === currentState.activeProfileId);
  return p || currentState.profiles[0];
}

export function getDurationForSpeed(speed) {
  const durations = currentState.settings.durations || DEFAULT_DURATIONS;
  return durations[speed] || DEFAULT_DURATIONS[speed] || 1.2;
}

export function getRocketAnswerLimit() {
  return (currentState.settings.durations && currentState.settings.durations.rocketLimit) || 3.0;
}

export function updateSettings(partial) {
  currentState.settings = { ...currentState.settings, ...partial };
  saveState();
}

export function updateDurations(newDurations) {
  currentState.settings.durations = {
    ...currentState.settings.durations,
    ...newDurations
  };
  saveState();
}

export function setLanguage(lang) {
  currentState.language = lang;
  saveState();
}

export function setSoundEnabled(enabled) {
  currentState.soundEnabled = enabled;
  saveState();
}

export function setActiveProfile(profileId) {
  const exists = currentState.profiles.some((p) => p.id === profileId);
  if (exists) {
    currentState.activeProfileId = profileId;
    saveState();
  }
}

export function addProfile(name, avatar) {
  const newId = 'profile-' + Date.now();
  const profile = {
    id: newId,
    name: name.trim() || `Player ${currentState.profiles.length + 1}`,
    avatar: avatar || DEFAULT_AVATARS[currentState.profiles.length % DEFAULT_AVATARS.length],
    medals: { gold: 0, silver: 0, bronze: 0 },
    highscores: {}
  };
  currentState.profiles.push(profile);
  currentState.activeProfileId = newId;
  saveState();
  return profile;
}

export function updateProfile(id, data) {
  const profile = currentState.profiles.find((p) => p.id === id);
  if (profile) {
    Object.assign(profile, data);
    saveState();
  }
}

export function deleteProfile(id) {
  if (currentState.profiles.length <= 1) return;
  currentState.profiles = currentState.profiles.filter((p) => p.id !== id);
  if (currentState.activeProfileId === id) {
    currentState.activeProfileId = currentState.profiles[0].id;
  }
  saveState();
}

export function getProfileBestScore(profile, { gameMode = 'classic', category, speed, rounds = 10, numberRange = 'advanced' }) {
  if (!profile || !profile.highscores) return 0;
  if (gameMode === 'blitz') {
    return profile.highscores[`blitz_${category}_${speed}_${numberRange}`] ||
           (numberRange === 'advanced' ? profile.highscores[`blitz_${category}_${speed}`] : 0) || 0;
  } else if (gameMode === 'streak') {
    return profile.highscores[`streak_${category}_${speed}_${numberRange}`] ||
           (numberRange === 'advanced' ? profile.highscores[`streak_${category}_${speed}`] : 0) || 0;
  } else {
    return profile.highscores[`classic_${category}_${speed}_${rounds}_${numberRange}`] ||
           (numberRange === 'advanced' ? (profile.highscores[`classic_${category}_${speed}_${rounds}`] || profile.highscores[`${category}_${speed}_${rounds}`]) : 0) || 0;
  }
}

export function recordGameResult({ score, total, speed, category, gameMode = 'classic', streak = 0, numberRange = 'advanced' }) {
  const profile = getActiveProfile();
  if (!profile) return { earnedMedal: null, isNewHighscore: false, previousBest: 0 };

  let earnedMedal = null;

  if (gameMode === 'blitz') {
    // 60s Blitz medals
    if (score >= 28) {
      earnedMedal = 'gold';
      profile.medals.gold = (profile.medals.gold || 0) + 1;
    } else if (score >= 20) {
      earnedMedal = 'silver';
      profile.medals.silver = (profile.medals.silver || 0) + 1;
    } else if (score >= 12) {
      earnedMedal = 'bronze';
      profile.medals.bronze = (profile.medals.bronze || 0) + 1;
    }
  } else if (gameMode === 'streak') {
    // Sudden Death Streak medals
    const finalStreak = streak || score;
    if (finalStreak >= 25) {
      earnedMedal = 'gold';
      profile.medals.gold = (profile.medals.gold || 0) + 1;
    } else if (finalStreak >= 15) {
      earnedMedal = 'silver';
      profile.medals.silver = (profile.medals.silver || 0) + 1;
    } else if (finalStreak >= 8) {
      earnedMedal = 'bronze';
      profile.medals.bronze = (profile.medals.bronze || 0) + 1;
    }
  } else {
    // Classic Rounds medals
    if (score === total && total >= 5) {
      earnedMedal = 'gold';
      profile.medals.gold = (profile.medals.gold || 0) + 1;
    } else if (score >= Math.ceil(total * 0.8)) {
      earnedMedal = 'silver';
      profile.medals.silver = (profile.medals.silver || 0) + 1;
    } else if (score >= Math.ceil(total * 0.6)) {
      earnedMedal = 'bronze';
      profile.medals.bronze = (profile.medals.bronze || 0) + 1;
    }
  }

  let key = '';
  let fallbackKey = '';
  let scoreToCompare = score;
  if (gameMode === 'blitz') {
    key = `blitz_${category}_${speed}_${numberRange}`;
    fallbackKey = `blitz_${category}_${speed}`;
    scoreToCompare = score;
  } else if (gameMode === 'streak') {
    key = `streak_${category}_${speed}_${numberRange}`;
    fallbackKey = `streak_${category}_${speed}`;
    scoreToCompare = streak || score;
  } else {
    key = `classic_${category}_${speed}_${total}_${numberRange}`;
    fallbackKey = `classic_${category}_${speed}_${total}`;
    scoreToCompare = score;
  }

  const previousBest = profile.highscores[key] ||
    (numberRange === 'advanced' ? (profile.highscores[fallbackKey] || (gameMode === 'classic' ? profile.highscores[`${category}_${speed}_${total}`] : 0)) : 0) || 0;
  const isNewHighscore = scoreToCompare > previousBest;

  if (isNewHighscore) {
    profile.highscores[key] = scoreToCompare;
  }

  saveState();

  return {
    earnedMedal,
    isNewHighscore,
    previousBest
  };
}

export function resetProfileScores(profileId) {
  const profile = currentState.profiles.find((p) => p.id === profileId);
  if (profile) {
    profile.medals = { gold: 0, silver: 0, bronze: 0 };
    profile.highscores = {};
    saveState();
  }
}

export { DEFAULT_AVATARS, DEFAULT_DURATIONS };
