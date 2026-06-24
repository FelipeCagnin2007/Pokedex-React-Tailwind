import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchPokemon, fetchPokemonById, fetchAPI, fetchAllPokemon } from '../../api/pokeapi';
import { buildBattlePokemon } from '../../battle/battleEngine';
import { useBattle } from '../../context/BattleContext';
import Spinner from '../../components/ui/Spinner';
import TypeBadge from '../../components/ui/TypeBadge';
import { usePageMeta } from '../../hooks/usePageMeta';

const TYPE_FILTERS = ['Todos', 'fire', 'water', 'grass', 'electric', 'psychic', 'dragon', 'dark', 'fighting', 'normal', 'ghost'];

export default function BattleSelect() {
  usePageMeta('Selecionar Equipe', 'Escolha até 6 Pokémon para sua equipe de batalha.');
  const navigate = useNavigate();
  const { selectedTeam, addToTeam, removeFromTeam, clearTeam, isInTeam } = useBattle();

  const [pokemonList, setPokemonList] = useState([]);
  const [allPokemonIndex, setAllPokemonIndex] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [teamLoadingIds, setTeamLoadingIds] = useState(new Set());

  const LIMIT = 60;

  useEffect(() => {
    loadPokemon(0, true);
    fetchAllPokemon().then(setAllPokemonIndex).catch(console.error);
  }, []);

  // Busca indexada ultra-rápida via API
  useEffect(() => {
    if (search.trim().length > 0 && allPokemonIndex.length > 0) {
      const matches = allPokemonIndex.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
      const topMatches = matches.slice(0, 60);
      const toFetch = topMatches.filter(m => !pokemonList.some(p => p.name === m.name));
      
      if (toFetch.length > 0) {
        Promise.all(toFetch.map(m => fetchPokemonById(m.name).catch(() => null)))
          .then(details => setPokemonList(prev => {
            const valid = details.filter(Boolean);
            const newMap = new Map();
            [...prev, ...valid].forEach(d => newMap.set(d.id, d));
            return Array.from(newMap.values()).sort((a,b) => a.id - b.id);
          }))
          .catch(console.error);
      }
    }
  }, [search, allPokemonIndex]);

  async function loadPokemon(off, reset = false) {
    if (reset) setLoading(true);
    else setLoadingMore(true);

    try {
      const list = await fetchPokemon(LIMIT, off);
      const details = await Promise.all(
        list.results.map(p => fetchPokemonById(p.name))
      );
      if (reset) setPokemonList(details);
      else setPokemonList(prev => [...prev, ...details]);
      setOffset(off + LIMIT);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  const addWithMoves = useCallback(async (pokemon) => {
    if (isInTeam(pokemon.id) || selectedTeam.length >= 6) return;
    setTeamLoadingIds(prev => new Set([...prev, pokemon.id]));

    try {
      const fullData = await fetchPokemonById(pokemon.id);
      // Get first 4 moves with detail
      const moveRefs = (fullData.moves || []).slice(0, 8);
      const moveDetails = await Promise.all(
        moveRefs.map(m => fetchAPI(m.move.url).catch(() => null))
      );
      const validMoves = moveDetails
        .filter(m => m && m.power !== null && m.power > 0)
        .slice(0, 4)
        .map(m => ({
          name: m.name,
          power: m.power,
          accuracy: m.accuracy,
          pp: m.pp,
          type: m.type,
          damage_class: m.damage_class,
        }));

      // Fallback if no damaging moves found
      const allMoves = moveDetails.filter(Boolean).slice(0, 4).map(m => ({
        name: m.name,
        power: m.power || 40,
        accuracy: m.accuracy || 100,
        pp: m.pp || 10,
        type: m.type,
        damage_class: m.damage_class,
      }));

      const battlePoke = buildBattlePokemon(fullData, validMoves.length >= 2 ? validMoves : allMoves.slice(0, 4));
      addToTeam(battlePoke);
    } catch (e) {
      console.error(e);
    } finally {
      setTeamLoadingIds(prev => { const n = new Set(prev); n.delete(pokemon.id); return n; });
    }
  }, [isInTeam, selectedTeam.length, addToTeam]);

  const filtered = pokemonList.filter(p => {
    const nameMatch = p.name.toLowerCase().includes(search.toLowerCase());
    const typeMatch = typeFilter === 'Todos' || p.types?.some(t => t.type.name === typeFilter);
    return nameMatch && typeMatch;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Selecionar Equipe</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Escolha até 6 Pokémon para batalhar</p>
        </div>
        <Link to="/battle" className="btn-ghost text-sm">← Voltar ao Lobby</Link>
      </div>

      {/* Team preview */}
      <div className="card p-5 mb-8">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="font-bold text-slate-900 dark:text-white">
            Sua Equipe <span className={`ml-1 text-sm font-normal ${selectedTeam.length === 6 ? 'text-emerald-500' : 'text-slate-400'}`}>
              ({selectedTeam.length}/6)
            </span>
          </h2>
          <div className="flex gap-2">
            {selectedTeam.length > 0 && (
              <button onClick={clearTeam} className="btn-ghost text-xs text-red-500 hover:text-red-600">
                🗑️ Limpar
              </button>
            )}
            {selectedTeam.length === 6 && (
              <button onClick={() => navigate('/battle')} className="btn-battle text-sm py-1.5">
                ✅ Equipe pronta! →
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 6 }).map((_, i) => {
            const poke = selectedTeam[i];
            return (
              <div
                key={i}
                className={`relative flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all min-h-[80px] ${
                  poke
                    ? 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800'
                    : 'border-dashed border-slate-200 dark:border-slate-700 bg-transparent'
                }`}
              >
                {poke ? (
                  <>
                    <img src={poke.sprite} alt={poke.name} className="w-12 h-12 object-contain" />
                    <p className="text-[10px] font-medium text-slate-700 dark:text-slate-300 capitalize truncate w-full text-center mt-1">
                      {poke.name}
                    </p>
                    <button
                      onClick={() => removeFromTeam(poke.id)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition-colors leading-none"
                      aria-label={`Remover ${poke.name}`}
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <span className="text-2xl opacity-20">?</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="search"
          placeholder="Buscar Pokémon..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:border-red-400 transition-colors"
        />
        <div className="flex gap-2 flex-wrap">
          {TYPE_FILTERS.slice(0, 8).map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                typeFilter === t
                  ? 'bg-red-500 text-white'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-red-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? <Spinner text="Carregando Pokémon..." /> : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filtered.map(pokemon => {
              const inTeam  = isInTeam(pokemon.id);
              const loading = teamLoadingIds.has(pokemon.id);
              const full    = selectedTeam.length >= 6 && !inTeam;

              return (
                <button
                  key={pokemon.id}
                  id={`select-poke-${pokemon.id}`}
                  onClick={() => inTeam ? removeFromTeam(pokemon.id) : addWithMoves(pokemon)}
                  disabled={full || loading}
                  className={`card p-3 flex flex-col items-center gap-2 transition-all duration-200 relative group
                    ${inTeam ? 'border-emerald-400 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' : ''}
                    ${full ? 'opacity-50 cursor-not-allowed' : 'card-hover cursor-pointer'}
                  `}
                >
                  {inTeam && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  {loading ? (
                    <div className="w-16 h-16 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <img
                      src={pokemon.sprites?.other?.['official-artwork']?.front_default
                        || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                      alt={pokemon.name}
                      className="w-16 h-16 object-contain group-hover:scale-110 transition-transform"
                      loading="lazy"
                    />
                  )}
                  <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 capitalize truncate w-full text-center">
                    {pokemon.name}
                  </p>
                  <div className="flex gap-1 flex-wrap justify-center">
                    {pokemon.types?.map(t => (
                      <TypeBadge key={t.type.name} type={t.type.name} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Load more */}
          {filtered.length >= LIMIT && (
            <div className="text-center mt-8">
              <button
                onClick={() => loadPokemon(offset)}
                disabled={loadingMore}
                className="btn-secondary"
              >
                {loadingMore ? 'Carregando...' : 'Carregar mais Pokémon'}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
