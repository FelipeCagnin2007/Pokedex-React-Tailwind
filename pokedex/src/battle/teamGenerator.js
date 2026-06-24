import { fetchPokemonById, fetchAPI } from '../api/pokeapi';
import { buildBattlePokemon } from './battleEngine';
import { ITEMS } from '../data/items';

/**
 * Generates a random team of 6 Pokémon with moves and items.
 * If a season is provided, it tries to generate a team that complies with its rules.
 */
export async function generateRandomTeam(season = null) {
  const picks = new Set();
  
  if (season?.rules?.monotype) {
    // If the season requires a specific type, fetch all pokemon of that type first
    try {
      const typeData = await fetchAPI(`https://pokeapi.co/api/v2/type/${season.rules.monotype}`);
      const validNames = typeData.pokemon.map(p => p.pokemon.name);
      // Pick 6 random names from this type
      while (picks.size < 6 && picks.size < validNames.length) {
        picks.add(validNames[Math.floor(Math.random() * validNames.length)]);
      }
    } catch (e) {
      console.error('Error fetching type for season', e);
      // Fallback
      while (picks.size < 6) picks.add(Math.floor(Math.random() * 493) + 1);
    }
  } else {
    // Try to pick 6 unique pokemon from generation 1-4 (up to 493) to keep it manageable
    while (picks.size < 6) picks.add(Math.floor(Math.random() * 493) + 1);
  }

  const itemKeys = Object.keys(ITEMS);
  // Copy to avoid giving same item twice (Item Clause)
  const availableItems = [...itemKeys];

  const team = await Promise.all([...picks].map(async id => {
    const poke = await fetchPokemonById(id);
    
    // Pick 4 valid attacking moves if possible
    const moveRefs = (poke.moves || []).sort(() => 0.5 - Math.random()).slice(0, 15);
    const moveDetails = await Promise.all(
      moveRefs.map(m => fetchAPI(m.move.url).catch(() => null))
    );
    const validMoves = moveDetails
      .filter(m => m && m.power !== null && m.power > 0) // prioritize damaging moves
      .slice(0, 4)
      .map(m => ({
        name: m.name,
        power: m.power || 40,
        accuracy: m.accuracy || 100,
        pp: m.pp || 10,
        type: m.type,
        damage_class: m.damage_class,
      }));

    // Fallback if not enough moves
    const finalMoves = validMoves.length >= 2 ? validMoves : validMoves.concat([{
      name: 'tackle',
      power: 40,
      accuracy: 100,
      pp: 35,
      type: { name: 'normal' },
      damage_class: { name: 'physical' },
    }]).slice(0, 4);

    const battlePoke = buildBattlePokemon(poke, finalMoves);

    // Assign random item
    if (availableItems.length > 0) {
      const itemIdx = Math.floor(Math.random() * availableItems.length);
      const itemId = availableItems.splice(itemIdx, 1)[0];
      battlePoke.item = ITEMS[itemId];
    }

    return battlePoke;
  }));

  return team;
}
