// ─── Pokémon Type Chart ──────────────────────────────────────────────────────
export const TYPE_CHART = {
  normal:   { weak: ['fighting'],                              resist: [],                                                              immune: ['ghost'] },
  fire:     { weak: ['water', 'ground', 'rock'],               resist: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'],              immune: [] },
  water:    { weak: ['electric', 'grass'],                     resist: ['fire', 'water', 'ice', 'steel'],                              immune: [] },
  electric: { weak: ['ground'],                                resist: ['electric', 'flying', 'steel'],                                immune: [] },
  grass:    { weak: ['fire', 'ice', 'poison', 'flying', 'bug'],resist: ['water', 'electric', 'grass', 'ground'],                      immune: [] },
  ice:      { weak: ['fire', 'fighting', 'rock', 'steel'],     resist: ['ice'],                                                        immune: [] },
  fighting: { weak: ['flying', 'psychic', 'fairy'],            resist: ['bug', 'rock', 'dark'],                                        immune: [] },
  poison:   { weak: ['ground', 'psychic'],                     resist: ['grass', 'fighting', 'poison', 'bug', 'fairy'],                immune: [] },
  ground:   { weak: ['water', 'grass', 'ice'],                 resist: ['poison', 'rock'],                                             immune: ['electric'] },
  flying:   { weak: ['electric', 'ice', 'rock'],               resist: ['grass', 'fighting', 'bug'],                                   immune: ['ground'] },
  psychic:  { weak: ['bug', 'ghost', 'dark'],                  resist: ['fighting', 'psychic'],                                        immune: [] },
  bug:      { weak: ['fire', 'flying', 'rock'],                resist: ['grass', 'fighting', 'ground'],                               immune: [] },
  rock:     { weak: ['water', 'grass', 'fighting', 'ground', 'steel'], resist: ['normal', 'fire', 'poison', 'flying'],                immune: [] },
  ghost:    { weak: ['ghost', 'dark'],                         resist: ['poison', 'bug'],                                              immune: ['normal', 'fighting'] },
  dragon:   { weak: ['ice', 'dragon', 'fairy'],                resist: ['fire', 'water', 'electric', 'grass'],                        immune: [] },
  dark:     { weak: ['fighting', 'bug', 'fairy'],              resist: ['ghost', 'dark'],                                              immune: ['psychic'] },
  steel:    { weak: ['fire', 'fighting', 'ground'],            resist: ['normal','grass','ice','flying','psychic','bug','rock','dragon','steel','fairy'], immune: ['poison'] },
  fairy:    { weak: ['poison', 'steel'],                       resist: ['fighting', 'bug', 'dark'],                                    immune: ['dragon'] },
};

// ─── Type effectiveness multiplier ──────────────────────────────────────────
export function getTypeEffectiveness(moveType, defenderTypes) {
  let mult = 1;
  defenderTypes.forEach(dt => {
    const chart = TYPE_CHART[dt];
    if (!chart) return;
    if (chart.immune.includes(moveType)) mult *= 0;
    else if (chart.weak.includes(moveType)) mult *= 2;
    else if (chart.resist.includes(moveType)) mult *= 0.5;
  });
  return mult;
}

export function effectivenessLabel(mult) {
  if (mult === 0)    return { text: 'Sem efeito!',    color: 'text-slate-400' };
  if (mult >= 4)     return { text: 'Ultra efetivo!!', color: 'text-red-500' };
  if (mult >= 2)     return { text: 'Super efetivo!', color: 'text-orange-500' };
  if (mult < 1)      return { text: 'Não é muito efetivo...', color: 'text-slate-500' };
  return null;
}

// ─── STAB (Same-Type Attack Bonus) ──────────────────────────────────────────
function getSTAB(moveType, attackerTypes) {
  return attackerTypes.some(t => t === moveType) ? 1.5 : 1;
}

// ─── Critical hit ────────────────────────────────────────────────────────────
function isCriticalHit() {
  return Math.random() < 1 / 24;
}

// ─── Accuracy check ──────────────────────────────────────────────────────────
function didHit(accuracy) {
  if (!accuracy) return true; // moves with null accuracy always hit
  return Math.random() * 100 < accuracy;
}

// ─── Damage formula (simplified Gen VIII) ────────────────────────────────────
// Damage = ((2*Lv/5 + 2) * Power * A/D) / 50 + 2) * Modifiers
export function calculateDamage(attacker, defender, move) {
  if (!move.power) return { damage: 0, critical: false, effectiveness: 1, hit: true };

  const hit = didHit(move.accuracy);
  if (!hit) return { damage: 0, critical: false, effectiveness: 1, hit: false };

  const level = 50; // default battle level
  const isSpecial = move.damage_class?.name === 'special';

  const A = isSpecial ? (attacker.stats?.spAtk || 50) : (attacker.stats?.attack || 50);
  const D = isSpecial ? (defender.stats?.spDef || 50) : (defender.stats?.defense || 50);

  const base = (((2 * level / 5 + 2) * move.power * (A / D)) / 50) + 2;

  const critical = isCriticalHit();
  const critMult = critical ? 1.5 : 1;
  const stab = getSTAB(move.type?.name, attacker.types || []);
  const defTypes = defender.types || [];
  const effectiveness = getTypeEffectiveness(move.type?.name, defTypes);

  // Random factor: 0.85 to 1.0
  const random = 0.85 + Math.random() * 0.15;

  const damage = Math.max(1, Math.floor(base * critMult * stab * effectiveness * random));

  return { damage, critical, effectiveness, hit: true };
}

// ─── CPU AI ─────────────────────────────────────────────────────────────────
/**
 * CPU selects a move based on difficulty.
 * @param {'easy'|'normal'|'hard'} difficulty
 * @param {object} cpuPoke - CPU's active Pokémon
 * @param {object} playerPoke - Player's active Pokémon
 * @returns {object} selected move
 */
export function cpuChooseMove(cpuPoke, playerPoke, difficulty = 'normal') {
  const moves = cpuPoke.moves?.filter(m => m.power > 0) || cpuPoke.moves || [];
  if (!moves.length) return cpuPoke.moves?.[0] || null;

  if (difficulty === 'easy') {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  if (difficulty === 'normal') {
    // Prefer moves with type advantage, pick randomly from top half
    const playerTypes = playerPoke.types || [];
    const scored = moves.map(m => ({
      move: m,
      score: (m.power || 40) * getTypeEffectiveness(m.type?.name, playerTypes),
    })).sort((a, b) => b.score - a.score);

    const topHalf = scored.slice(0, Math.ceil(scored.length / 2));
    return topHalf[Math.floor(Math.random() * topHalf.length)].move;
  }

  // hard: always pick max damage potential
  const playerTypes = playerPoke.types || [];
  const stab = cpuPoke.types || [];
  const scored = moves.map(m => ({
    move: m,
    score: (m.power || 40)
      * getTypeEffectiveness(m.type?.name, playerTypes)
      * getSTAB(m.type?.name, stab),
  }));
  return scored.reduce((best, cur) => cur.score > best.score ? cur : best, scored[0]).move;
}

// ─── HP percentage helper ────────────────────────────────────────────────────
export function hpPercent(current, max) {
  return Math.max(0, Math.min(100, (current / max) * 100));
}

export function hpBarClass(pct) {
  if (pct > 50) return 'hp-high';
  if (pct > 20) return 'hp-medium';
  return 'hp-low';
}

// ─── Build battle-ready Pokémon from PokeAPI data ────────────────────────────
export function buildBattlePokemon(apiPoke, movesData) {
  const statsMap = {};
  (apiPoke.stats || []).forEach(s => {
    const key = s.stat.name;
    statsMap[key === 'special-attack' ? 'spAtk' : key === 'special-defense' ? 'spDef' : key] = s.base_stat;
  });

  const level = 50;
  const iv = 31; // Perfect IVs

  // VGC Auto-Build Heuristic (Standard Sweeper spread)
  // Determines if Pokemon is Physical or Special based on base stats
  const isPhysical = (statsMap.attack || 0) >= (statsMap.spAtk || 0);
  const mainAtk = isPhysical ? 'attack' : 'spAtk';
  const unusedAtk = isPhysical ? 'spAtk' : 'attack';

  // EVs: 252 Main Atk, 252 Speed, 4 HP
  const evs = { hp: 4, attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 252 };
  evs[mainAtk] = 252;

  // Nature: +10% Main Atk, -10% Unused Atk
  const natureMultipliers = { hp: 1, attack: 1, defense: 1, spAtk: 1, spDef: 1, speed: 1 };
  natureMultipliers[mainAtk] = 1.1;
  natureMultipliers[unusedAtk] = 0.9;

  // Official HP Formula: floor(0.01 * (2 * Base + IV + floor(EV/4)) * Level) + Level + 10
  const baseHp = statsMap.hp || 45;
  const maxHp = Math.floor(0.01 * (2 * baseHp + iv + Math.floor(evs.hp / 4)) * level) + level + 10;

  // Official Stat Formula: floor( (floor(0.01 * (2 * Base + IV + floor(EV/4)) * Level) + 5) * Nature )
  const scaledStats = { ...statsMap };
  Object.keys(scaledStats).forEach(key => {
    if (key !== 'hp') {
      const base = scaledStats[key] || 50;
      const ev = evs[key] || 0;
      const rawStat = Math.floor(0.01 * (2 * base + iv + Math.floor(ev / 4)) * level) + 5;
      scaledStats[key] = Math.floor(rawStat * natureMultipliers[key]);
    }
  });

  return {
    id:       apiPoke.id,
    name:     apiPoke.name,
    types:    apiPoke.types?.map(t => t.type.name) || [],
    stats:    scaledStats,
    maxHp,
    currentHp: maxHp,
    sprite:   apiPoke.sprites?.other?.['official-artwork']?.front_default
              || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${apiPoke.id}.png`,
    animatedSprite: apiPoke.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default || null,
    moves:    movesData.slice(0, 4),
  };
}
