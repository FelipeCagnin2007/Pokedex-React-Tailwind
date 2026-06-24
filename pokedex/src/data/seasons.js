/**
 * src/data/seasons.js
 * Configuration for monthly seasonal themes and rules.
 * Add new months following the same pattern.
 */

export const SEASONS = {
  '01': { id: '01', name: 'Festival do Gelo', theme: 'ice', emoji: '❄️', colors: { '--season-bg': '#001a33', '--season-accent': '#00ccff', '--season-surface': '#002b4d' }, rules: { monotype: 'ice', damageBonus: { type: 'ice', mult: 1.2 } }, reward: { medal: 'Rei do Inverno', icon: '🏅' } },
  '02': { id: '02', name: 'Amor Feérico', theme: 'fairy', emoji: '✨', colors: { '--season-bg': '#33001a', '--season-accent': '#ff66b3', '--season-surface': '#4d002b' }, rules: { monotype: 'fairy', damageBonus: { type: 'fairy', mult: 1.2 } }, reward: { medal: 'Encantador', icon: '🏅' } },
  '03': { id: '03', name: 'Vendaval', theme: 'flying', emoji: '🌪️', colors: { '--season-bg': '#1a2b3c', '--season-accent': '#8cb3d9', '--season-surface': '#263b52' }, rules: { monotype: 'flying', damageBonus: { type: 'flying', mult: 1.2 } }, reward: { medal: 'Mestre dos Ares', icon: '🏅' } },
  '04': { id: '04', name: 'Despertar da Natureza', theme: 'grass', emoji: '🍃', colors: { '--season-bg': '#003300', '--season-accent': '#33cc33', '--season-surface': '#004d00' }, rules: { monotype: 'grass', damageBonus: { type: 'grass', mult: 1.2 } }, reward: { medal: 'Guardião da Floresta', icon: '🏅' } },
  '05': { id: '05', name: 'Ninho de Insetos', theme: 'bug', emoji: '🐛', colors: { '--season-bg': '#1a3300', '--season-accent': '#99cc00', '--season-surface': '#2b4d00' }, rules: { monotype: 'bug', damageBonus: { type: 'bug', mult: 1.2 } }, reward: { medal: 'Entomologista', icon: '🏅' } },
  '06': { id: '06', name: 'Mês do Fogo', theme: 'fire', emoji: '🔥', colors: { '--season-bg': '#1a0800', '--season-accent': '#ff6b1a', '--season-surface': '#2d1200' }, rules: { monotype: 'fire', damageBonus: { type: 'fire', mult: 1.2 } }, reward: { medal: 'Lorde das Chamas', icon: '🏅' } },
  '07': { id: '07', name: 'Peso Pesado', theme: 'rock', emoji: '🪨', colors: { '--season-bg': '#12100a', '--season-accent': '#b8860b', '--season-surface': '#1e1c0e' }, rules: { monotype: 'rock', damageBonus: { type: 'rock', mult: 1.2 } }, reward: { medal: 'Muralha de Pedra', icon: '🏅' } },
  '08': { id: '08', name: 'Oceano Profundo', theme: 'water', emoji: '🌊', colors: { '--season-bg': '#001a4d', '--season-accent': '#3385ff', '--season-surface': '#002b80' }, rules: { monotype: 'water', damageBonus: { type: 'water', mult: 1.2 } }, reward: { medal: 'Tritão', icon: '🏅' } },
  '09': { id: '09', name: 'Mente Brilhante', theme: 'psychic', emoji: '🔮', colors: { '--season-bg': '#330033', '--season-accent': '#ff3399', '--season-surface': '#4d004d' }, rules: { monotype: 'psychic', damageBonus: { type: 'psychic', mult: 1.2 } }, reward: { medal: 'Telepata', icon: '🏅' } },
  '10': { id: '10', name: 'Assombração', theme: 'ghost', emoji: '👻', colors: { '--season-bg': '#0e0814', '--season-accent': '#9333ea', '--season-surface': '#1a1020' }, rules: { monotype: 'ghost', damageBonus: { type: 'ghost', mult: 1.15 } }, reward: { medal: 'Espectro Eterno', icon: '🏅' } },
  '11': { id: '11', name: 'Choque do Trovão', theme: 'electric', emoji: '⚡', colors: { '--season-bg': '#332b00', '--season-accent': '#ffcc00', '--season-surface': '#4d4000' }, rules: { monotype: 'electric', damageBonus: { type: 'electric', mult: 1.2 } }, reward: { medal: 'Bateria Humana', icon: '🏅' } },
  '12': { id: '12', name: 'Fúria dos Dragões', theme: 'dragon', emoji: '🐉', colors: { '--season-bg': '#000033', '--season-accent': '#6666ff', '--season-surface': '#00004d' }, rules: { monotype: 'dragon', damageBonus: { type: 'dragon', mult: 1.2 } }, reward: { medal: 'Domador de Dragões', icon: '🏅' } },
};

/** Returns the active season based on current date (or null) */
export function getCurrentSeason() {
  const now = new Date();
  const key = String(now.getMonth() + 1).padStart(2, '0');
  return SEASONS[key] || null;
}

/** Validates a team against season rules. Returns array of violation messages. */
export function validateTeamForSeason(team, season) {
  if (!season || !season.rules) return [];
  const violations = [];
  const { rules } = season;

  if (rules.monotype) {
    const bad = team.filter(p => !p.types?.includes(rules.monotype));
    if (bad.length > 0) {
      violations.push(`Esta temporada exige tipo ${rules.monotype}. Remova: ${bad.map(p => p.name).join(', ')}`);
    }
  }

  if (rules.minStat) {
    // We don't have base stats here — skip for now (build time check)
    // Could be extended with apiData
  }

  return violations;
}

/** Applies seasonal damage modifier */
export function applySeasonalModifier(damage, moveType, season) {
  if (!season?.rules?.damageBonus) return damage;
  const { type, mult } = season.rules.damageBonus;
  if (moveType === type) return Math.floor(damage * mult);
  return damage;
}
