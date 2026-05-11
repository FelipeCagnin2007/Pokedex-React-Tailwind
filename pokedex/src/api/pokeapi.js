// PokéAPI v2 — Centralized API layer with localStorage cache

const BASE_URL = 'https://pokeapi.co/api/v2';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in ms

// ─── Cache helpers ─────────────────────────────────────────────────────────────

function cacheGet(key) {
  try {
    const item = localStorage.getItem(`pokedex_${key}`);
    if (!item) return null;
    const { data, timestamp } = JSON.parse(item);
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(`pokedex_${key}`);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function cacheSet(key, data) {
  try {
    localStorage.setItem(`pokedex_${key}`, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // Storage full — silently fail
  }
}

// ─── Core fetch ────────────────────────────────────────────────────────────────

export async function fetchAPI(path) {
  const cacheKey = path.replace(/\//g, '_').replace(/\?/g, '__').replace(/&/g, '_');
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`PokéAPI error: ${res.status} on ${url}`);
  const data = await res.json();
  cacheSet(cacheKey, data);
  return data;
}

// ─── List endpoints ────────────────────────────────────────────────────────────

export const fetchList = (endpoint, limit = 20, offset = 0) =>
  fetchAPI(`${endpoint}?limit=${limit}&offset=${offset}`);

// ─── Named resource endpoints ──────────────────────────────────────────────────

// Berries
export const fetchBerries = (limit, offset) => fetchList('/berry', limit, offset);
export const fetchBerryFirmness = (limit, offset) => fetchList('/berry-firmness', limit, offset);
export const fetchBerryFlavors = (limit, offset) => fetchList('/berry-flavor', limit, offset);
export const fetchBerry = (id) => fetchAPI(`/berry/${id}`);
export const fetchBerryFirmnessById = (id) => fetchAPI(`/berry-firmness/${id}`);
export const fetchBerryFlavorById = (id) => fetchAPI(`/berry-flavor/${id}`);

// Contests
export const fetchContestTypes = (limit, offset) => fetchList('/contest-type', limit, offset);
export const fetchContestEffects = (limit, offset) => fetchList('/contest-effect', limit, offset);
export const fetchSuperContestEffects = (limit, offset) => fetchList('/super-contest-effect', limit, offset);
export const fetchContestType = (id) => fetchAPI(`/contest-type/${id}`);
export const fetchContestEffect = (id) => fetchAPI(`/contest-effect/${id}`);
export const fetchSuperContestEffect = (id) => fetchAPI(`/super-contest-effect/${id}`);

// Encounters
export const fetchEncounterMethods = (limit, offset) => fetchList('/encounter-method', limit, offset);
export const fetchEncounterConditions = (limit, offset) => fetchList('/encounter-condition', limit, offset);
export const fetchEncounterConditionValues = (limit, offset) => fetchList('/encounter-condition-value', limit, offset);
export const fetchEncounterMethod = (id) => fetchAPI(`/encounter-method/${id}`);
export const fetchEncounterCondition = (id) => fetchAPI(`/encounter-condition/${id}`);

// Evolution
export const fetchEvolutionChains = (limit, offset) => fetchList('/evolution-chain', limit, offset);
export const fetchEvolutionTriggers = (limit, offset) => fetchList('/evolution-trigger', limit, offset);
export const fetchEvolutionChain = (id) => fetchAPI(`/evolution-chain/${id}`);
export const fetchEvolutionTrigger = (id) => fetchAPI(`/evolution-trigger/${id}`);

// Games
export const fetchGenerations = (limit, offset) => fetchList('/generation', limit, offset);
export const fetchPokedexes = (limit, offset) => fetchList('/pokedex', limit, offset);
export const fetchVersions = (limit, offset) => fetchList('/version', limit, offset);
export const fetchVersionGroups = (limit, offset) => fetchList('/version-group', limit, offset);
export const fetchGeneration = (id) => fetchAPI(`/generation/${id}`);
export const fetchPokedex = (id) => fetchAPI(`/pokedex/${id}`);
export const fetchVersion = (id) => fetchAPI(`/version/${id}`);

// Items
export const fetchItems = (limit, offset) => fetchList('/item', limit, offset);
export const fetchItemAttributes = (limit, offset) => fetchList('/item-attribute', limit, offset);
export const fetchItemCategories = (limit, offset) => fetchList('/item-category', limit, offset);
export const fetchItemFlingEffects = (limit, offset) => fetchList('/item-fling-effect', limit, offset);
export const fetchItemPockets = (limit, offset) => fetchList('/item-pocket', limit, offset);
export const fetchItem = (id) => fetchAPI(`/item/${id}`);
export const fetchItemCategory = (id) => fetchAPI(`/item-category/${id}`);

// Locations
export const fetchLocations = (limit, offset) => fetchList('/location', limit, offset);
export const fetchLocationAreas = (limit, offset) => fetchList('/location-area', limit, offset);
export const fetchPalParkAreas = (limit, offset) => fetchList('/pal-park-area', limit, offset);
export const fetchRegions = (limit, offset) => fetchList('/region', limit, offset);
export const fetchLocation = (id) => fetchAPI(`/location/${id}`);
export const fetchRegion = (id) => fetchAPI(`/region/${id}`);

// Machines
export const fetchMachines = (limit, offset) => fetchList('/machine', limit, offset);
export const fetchMachine = (id) => fetchAPI(`/machine/${id}`);

// Moves
export const fetchMoves = (limit, offset) => fetchList('/move', limit, offset);
export const fetchMoveAilments = (limit, offset) => fetchList('/move-ailment', limit, offset);
export const fetchMoveCategories = (limit, offset) => fetchList('/move-category', limit, offset);
export const fetchMoveDamageClasses = (limit, offset) => fetchList('/move-damage-class', limit, offset);
export const fetchMoveLearnMethods = (limit, offset) => fetchList('/move-learn-method', limit, offset);
export const fetchMoveTargets = (limit, offset) => fetchList('/move-target', limit, offset);
export const fetchMove = (id) => fetchAPI(`/move/${id}`);
export const fetchMoveAilment = (id) => fetchAPI(`/move-ailment/${id}`);

// Pokémon
export const fetchPokemon = (limit, offset) => fetchList('/pokemon', limit, offset);
export const fetchAbilities = (limit, offset) => fetchList('/ability', limit, offset);
export const fetchTypes = (limit, offset) => fetchList('/type', limit, offset);
export const fetchNatures = (limit, offset) => fetchList('/nature', limit, offset);
export const fetchStats = (limit, offset) => fetchList('/stat', limit, offset);
export const fetchEggGroups = (limit, offset) => fetchList('/egg-group', limit, offset);
export const fetchGenders = (limit, offset) => fetchList('/gender', limit, offset);
export const fetchGrowthRates = (limit, offset) => fetchList('/growth-rate', limit, offset);
export const fetchCharacteristics = (limit, offset) => fetchList('/characteristic', limit, offset);
export const fetchHabitats = (limit, offset) => fetchList('/pokemon-habitat', limit, offset);
export const fetchShapes = (limit, offset) => fetchList('/pokemon-shape', limit, offset);
export const fetchSpecies = (limit, offset) => fetchList('/pokemon-species', limit, offset);
export const fetchPokeathlonStats = (limit, offset) => fetchList('/pokeathlon-stat', limit, offset);
export const fetchPokemonById = (id) => fetchAPI(`/pokemon/${id}`);
export const fetchSpeciesById = (id) => fetchAPI(`/pokemon-species/${id}`);
export const fetchAbility = (id) => fetchAPI(`/ability/${id}`);
export const fetchType = (id) => fetchAPI(`/type/${id}`);
export const fetchNature = (id) => fetchAPI(`/nature/${id}`);
export const fetchStat = (id) => fetchAPI(`/stat/${id}`);

// ─── Helpers ────────────────────────────────────────────────────────────────────

/** Extract ID from a PokéAPI resource URL */
export function getIdFromUrl(url) {
  const parts = url.replace(/\/$/, '').split('/');
  return parts[parts.length - 1];
}

/** Format a PokéAPI name (kebab-case → Title Case) */
export function formatName(name) {
  return name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** Get English flavor text */
export function getEnglishText(entries, field = 'flavor_text') {
  if (!entries) return '';
  const en = entries.find((e) => e.language?.name === 'en');
  return en ? en[field]?.replace(/\n|\f/g, ' ') : '';
}

/** Get Pokémon sprite URL */
export function getSpriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}
