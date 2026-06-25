import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentSeason, validateTeamForSeason, applySeasonalModifier } from '../data/seasons.jsx';

const SeasonContext = createContext(null);

export function SeasonProvider({ children }) {
  const [currentSeason, setCurrentSeason] = useState(() => getCurrentSeason());

  // Apply theme CSS variables whenever season changes
  useEffect(() => {
    const root = document.documentElement;
    if (currentSeason?.colors) {
      Object.entries(currentSeason.colors).forEach(([key, val]) => {
        root.style.setProperty(key, val);
      });
      root.setAttribute('data-season', currentSeason.theme);
    } else {
      root.removeAttribute('data-season');
      ['--season-bg', '--season-accent', '--season-surface'].forEach(k =>
        root.style.removeProperty(k)
      );
    }
  }, [currentSeason]);

  const validate = (team) => validateTeamForSeason(team, currentSeason);
  const applyModifier = (damage, moveType) => applySeasonalModifier(damage, moveType, currentSeason);

  return (
    <SeasonContext.Provider value={{ currentSeason, validate, applyModifier }}>
      {children}
    </SeasonContext.Provider>
  );
}

export const useSeason = () => {
  const ctx = useContext(SeasonContext);
  if (!ctx) throw new Error('useSeason must be used within SeasonProvider');
  return ctx;
};
