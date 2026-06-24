import { createContext, useContext, useState, useEffect } from 'react';

const BattleContext = createContext(null);

const STORAGE_KEY = 'poke-battle-team';
const SETTINGS_KEY = 'poke-battle-settings';

function loadTeam() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Validate it's an array of battle-ready Pokémon
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(p => p?.id && p?.name && typeof p.maxHp === 'number');
  } catch {
    return [];
  }
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { battleMode: 'cpu', difficulty: 'normal' };
    return JSON.parse(raw);
  } catch {
    return { battleMode: 'cpu', difficulty: 'normal' };
  }
}

export function BattleProvider({ children }) {
  const [selectedTeam, setSelectedTeamState] = useState(() => loadTeam());
  const [battleMode, setBattleModeState]     = useState(() => loadSettings().battleMode || 'cpu');
  const [difficulty, setDifficultyState]     = useState(() => loadSettings().difficulty || 'normal');

  // Persist team to localStorage
  function setSelectedTeam(team) {
    setSelectedTeamState(team);
    try {
      // Store only what's needed (without currentHp from a past battle)
      const toStore = team.map(p => ({ ...p, currentHp: p.maxHp }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch { /* quota exceeded — silent fail */ }
  }

  function setBattleMode(mode) {
    setBattleModeState(mode);
    saveSettings({ battleMode: mode, difficulty });
  }

  function setDifficulty(diff) {
    setDifficultyState(diff);
    saveSettings({ battleMode, difficulty: diff });
  }

  function saveSettings(settings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch { /* silent */ }
  }

  const addToTeam = (pokemon) => {
    if (selectedTeam.length >= 6) return false;
    if (selectedTeam.find(p => p.id === pokemon.id)) return false;
    const next = [...selectedTeam, { ...pokemon, currentHp: pokemon.maxHp }];
    setSelectedTeam(next);
    return true;
  };

  const removeFromTeam = (pokemonId) => {
    setSelectedTeam(selectedTeam.filter(p => p.id !== pokemonId));
  };

  const clearTeam = () => {
    setSelectedTeam([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const isInTeam = (pokemonId) => selectedTeam.some(p => p.id === pokemonId);

  return (
    <BattleContext.Provider value={{
      selectedTeam, setSelectedTeam,
      battleMode, setBattleMode,
      difficulty, setDifficulty,
      addToTeam, removeFromTeam, clearTeam, isInTeam,
    }}>
      {children}
    </BattleContext.Provider>
  );
}

export function useBattle() {
  const ctx = useContext(BattleContext);
  if (!ctx) throw new Error('useBattle must be inside BattleProvider');
  return ctx;
}
