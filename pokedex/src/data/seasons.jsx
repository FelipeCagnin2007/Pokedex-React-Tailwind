/**
 * src/data/seasons.js
 * Configuration for monthly seasonal themes and rules.
 * Add new months following the same pattern.
 */

import { Snowflake, Sparkles, Tornado, Leaf, Bug, Flame, Mountain, Waves, Eye, Ghost, Zap, Swords, Medal } from 'lucide-react';

export const SEASONS = {
  '01': { id: '01', name: 'Festival do Gelo', theme: 'ice', icon: <Snowflake size={16} />, colors: { '--season-bg': '#001a33', '--season-accent': '#00ccff', '--season-surface': '#002b4d' }, rules: { monotype: 'ice', damageBonus: { type: 'ice', mult: 1.2 } }, reward: { medal: 'Rei do Inverno', icon: <Medal size={16} className="text-yellow-500" /> } },
  '02': { id: '02', name: 'Amor Feérico', theme: 'fairy', icon: <Sparkles size={16} />, colors: { '--season-bg': '#33001a', '--season-accent': '#ff66b3', '--season-surface': '#4d002b' }, rules: { monotype: 'fairy', damageBonus: { type: 'fairy', mult: 1.2 } }, reward: { medal: 'Encantador', icon: <Medal size={16} className="text-yellow-500" /> } },
  '03': { id: '03', name: 'Vendaval', theme: 'flying', icon: <Tornado size={16} />, colors: { '--season-bg': '#1a2b3c', '--season-accent': '#8cb3d9', '--season-surface': '#263b52' }, rules: { monotype: 'flying', damageBonus: { type: 'flying', mult: 1.2 } }, reward: { medal: 'Mestre dos Ares', icon: <Medal size={16} className="text-yellow-500" /> } },
  '04': { id: '04', name: 'Despertar da Natureza', theme: 'grass', icon: <Leaf size={16} />, colors: { '--season-bg': '#003300', '--season-accent': '#33cc33', '--season-surface': '#004d00' }, rules: { monotype: 'grass', damageBonus: { type: 'grass', mult: 1.2 } }, reward: { medal: 'Guardião da Floresta', icon: <Medal size={16} className="text-yellow-500" /> } },
  '05': { id: '05', name: 'Ninho de Insetos', theme: 'bug', icon: <Bug size={16} />, colors: { '--season-bg': '#1a3300', '--season-accent': '#99cc00', '--season-surface': '#2b4d00' }, rules: { monotype: 'bug', damageBonus: { type: 'bug', mult: 1.2 } }, reward: { medal: 'Entomologista', icon: <Medal size={16} className="text-yellow-500" /> } },
  '06': { id: '06', name: 'Mês do Fogo', theme: 'fire', icon: <Flame size={16} />, colors: { '--season-bg': '#1a0800', '--season-accent': '#ff6b1a', '--season-surface': '#2d1200' }, rules: { monotype: 'fire', damageBonus: { type: 'fire', mult: 1.2 } }, reward: { medal: 'Lorde das Chamas', icon: <Medal size={16} className="text-yellow-500" /> } },
  '07': { id: '07', name: 'Peso Pesado', theme: 'rock', icon: <Mountain size={16} />, colors: { '--season-bg': '#12100a', '--season-accent': '#b8860b', '--season-surface': '#1e1c0e' }, rules: { monotype: 'rock', damageBonus: { type: 'rock', mult: 1.2 } }, reward: { medal: 'Muralha de Pedra', icon: <Medal size={16} className="text-yellow-500" /> } },
  '08': { id: '08', name: 'Oceano Profundo', theme: 'water', icon: <Waves size={16} />, colors: { '--season-bg': '#001a4d', '--season-accent': '#3385ff', '--season-surface': '#002b80' }, rules: { monotype: 'water', damageBonus: { type: 'water', mult: 1.2 } }, reward: { medal: 'Tritão', icon: <Medal size={16} className="text-yellow-500" /> } },
  '09': { id: '09', name: 'Mente Brilhante', theme: 'psychic', icon: <Eye size={16} />, colors: { '--season-bg': '#330033', '--season-accent': '#ff3399', '--season-surface': '#4d004d' }, rules: { monotype: 'psychic', damageBonus: { type: 'psychic', mult: 1.2 } }, reward: { medal: 'Telepata', icon: <Medal size={16} className="text-yellow-500" /> } },
  '10': { id: '10', name: 'Assombração', theme: 'ghost', icon: <Ghost size={16} />, colors: { '--season-bg': '#0e0814', '--season-accent': '#9333ea', '--season-surface': '#1a1020' }, rules: { monotype: 'ghost', damageBonus: { type: 'ghost', mult: 1.15 } }, reward: { medal: 'Espectro Eterno', icon: <Medal size={16} className="text-yellow-500" /> } },
  '11': { id: '11', name: 'Choque do Trovão', theme: 'electric', icon: <Zap size={16} />, colors: { '--season-bg': '#332b00', '--season-accent': '#ffcc00', '--season-surface': '#4d4000' }, rules: { monotype: 'electric', damageBonus: { type: 'electric', mult: 1.2 } }, reward: { medal: 'Bateria Humana', icon: <Medal size={16} className="text-yellow-500" /> } },
  '12': { id: '12', name: 'Fúria dos Dragões', theme: 'dragon', icon: <Swords size={16} />, colors: { '--season-bg': '#000033', '--season-accent': '#6666ff', '--season-surface': '#00004d' }, rules: { monotype: 'dragon', damageBonus: { type: 'dragon', mult: 1.2 } }, reward: { medal: 'Domador de Dragões', icon: <Medal size={16} className="text-yellow-500" /> } },
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
