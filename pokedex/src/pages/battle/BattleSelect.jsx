import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchPokemon, fetchPokemonById, fetchAllPokemon, fetchAPI } from '../../api/pokeapi';
import { useBattle } from '../../context/BattleContext';
import { useAuth } from '../../context/AuthContext';
import { useSeason } from '../../context/SeasonContext';
import { generateRandomTeam } from '../../battle/teamGenerator';
import { saveTeamToCloud, loadTeamFromCloud } from '../../lib/teamService';
import Spinner from '../../components/ui/Spinner';
import TypeBadge from '../../components/ui/TypeBadge';
import PokemonCustomizer from '../../components/battle/PokemonCustomizer';
import { usePageMeta } from '../../hooks/usePageMeta';
import { ITEMS } from '../../data/items';

const TYPE_FILTERS = [
  'Todos', 'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

export default function BattleSelect() {
  usePageMeta('Selecionar Equipe', 'Escolha até 6 Pokémon para sua equipe de batalha.');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedTeam, setSelectedTeam, addToTeam, removeFromTeam, clearTeam, isInTeam } = useBattle();
  const { currentSeason, validate } = useSeason();

  // Re-validate team whenever it changes
  const seasonViolations = currentSeason ? validate(selectedTeam) : [];
  const teamIsValid = selectedTeam.length === 6 && seasonViolations.length === 0;

  const [pokemonList, setPokemonList] = useState([]);
  const [allPokemonIndex, setAllPokemonIndex] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [cloudStatus, setCloudStatus] = useState(''); // 'saving', 'saved', 'error', ''
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [customizerTarget, setCustomizerTarget] = useState(null); // pokemon to customize

  const LIMIT = 60;

  useEffect(() => {
    loadPokemon(0, true);
    fetchAllPokemon().then(setAllPokemonIndex).catch(console.error);
  }, []);

  // Unified search and filter effect
  useEffect(() => {
    let active = true;

    async function loadFiltered() {
      if (allPokemonIndex.length === 0) return;
      setLoading(true);

      try {
        let matches = [...allPokemonIndex];

        // 1. Filter by Type using API
        if (typeFilter !== 'Todos') {
          const typeData = await fetchAPI(`https://pokeapi.co/api/v2/type/${typeFilter}`);
          const typeNames = new Set(typeData.pokemon.map(p => p.pokemon.name));
          matches = matches.filter(p => typeNames.has(p.name));
        }

        // 2. Filter by Search Text
        if (search.trim().length > 0) {
          matches = matches.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        }

        if (!active) return;

        // Fetch details for the top 60 matches
        const topMatches = matches.slice(0, 60);
        const toFetch = topMatches.filter(m => !pokemonList.some(p => p.name === m.name));

        if (toFetch.length > 0) {
          const details = await Promise.all(toFetch.map(m => fetchPokemonById(m.name).catch(() => null)));
          if (!active) return;
          
          setPokemonList(prev => {
            const valid = details.filter(Boolean);
            const newMap = new Map();
            [...prev, ...valid].forEach(d => newMap.set(d.id, d));
            return Array.from(newMap.values()).sort((a, b) => a.id - b.id);
          });
        }
      } catch (err) {
        console.error('Filter fetch error:', err);
      } finally {
        if (active) setLoading(false);
      }
    }

    // Debounce the search/filter loading slightly
    const timer = setTimeout(loadFiltered, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [search, typeFilter, allPokemonIndex]);

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

  function handleCardClick(pokemon) {
    if (isInTeam(pokemon.id)) {
      removeFromTeam(pokemon.id);
    } else if (selectedTeam.length < 6) {
      setCustomizerTarget(pokemon);
    }
  }

  function handleCustomizerConfirm(battlePoke) {
    addToTeam(battlePoke);
    setCustomizerTarget(null);
  }

  const filtered = pokemonList.filter(p => {
    const nameMatch = p.name.toLowerCase().includes(search.toLowerCase());
    const typeMatch = typeFilter === 'Todos' || p.types?.some(t => t.type.name === typeFilter);
    return nameMatch && typeMatch;
  });

  const handleSaveTeam = async () => {
    if (!user) return alert('Faça login para salvar seu time na nuvem!');
    if (selectedTeam.length !== 6) return alert('Seu time precisa ter exatamente 6 Pokémon para salvar!');
    setCloudStatus('saving');
    const success = await saveTeamToCloud(user.id, selectedTeam);
    if (success) {
      setCloudStatus('saved');
      setTimeout(() => setCloudStatus(''), 2000);
    } else {
      setCloudStatus('error');
      alert('Erro ao salvar. Verifique se a tabela "profiles" tem a coluna "saved_team" (JSONB).');
      setTimeout(() => setCloudStatus(''), 2000);
    }
  };

  const handleLoadTeam = async () => {
    if (!user) return alert('Faça login para carregar seu time!');
    setCloudStatus('saving');
    const team = await loadTeamFromCloud(user.id);
    if (team && team.length > 0) {
      setSelectedTeam(team);
      setCloudStatus('saved');
      setTimeout(() => setCloudStatus(''), 2000);
    } else {
      alert('Nenhum time salvo encontrado na nuvem.');
      setCloudStatus('error');
      setTimeout(() => setCloudStatus(''), 2000);
    }
  };

  const handleGenerateRandom = async (seasonal = false) => {
    setGenerating(true);
    const team = await generateRandomTeam(seasonal ? currentSeason : null);
    setSelectedTeam(team);
    setGenerating(false);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Customizer Modal */}
      {customizerTarget && (
        <PokemonCustomizer
          pokemon={customizerTarget}
          onConfirm={handleCustomizerConfirm}
          onClose={() => setCustomizerTarget(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Montar Equipe</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Selecione seus 6 Pokémon para a batalha.</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <Link to="/battle" className="btn-secondary whitespace-nowrap">← Voltar</Link>
          <button onClick={() => handleGenerateRandom(false)} disabled={generating} className="btn-secondary bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 whitespace-nowrap">
            {generating ? 'Gerando...' : '🎲 Time Aleatório'}
          </button>
          {currentSeason && (
            <button onClick={() => handleGenerateRandom(true)} disabled={generating} className="btn-battle whitespace-nowrap px-3 py-1.5 text-sm">
              {generating ? 'Gerando...' : `${currentSeason.emoji} Time Sazonal`}
            </button>
          )}
        </div>
      </div>

      {/* Season Banner */}
      {currentSeason && (
        <div className={`mb-8 p-4 sm:p-6 rounded-2xl border bg-${currentSeason.color}-50 border-${currentSeason.color}-200 dark:bg-${currentSeason.color}-900/20 dark:border-${currentSeason.color}-800`}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="text-4xl">{currentSeason.icon}</div>
            <div className="text-center sm:text-left flex-1">
              <h2 className={`text-xl font-bold text-${currentSeason.color}-700 dark:text-${currentSeason.color}-400 mb-1`}>
                Temporada Competitiva: {currentSeason.name}
              </h2>
              <p className={`text-sm text-${currentSeason.color}-600 dark:text-${currentSeason.color}-300`}>
                {currentSeason.description} Se você quiser jogar Batalhas Sazonais Ranqueadas, sua equipe precisa cumprir esta regra.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Team preview */}
      <div className="card p-5 mb-8">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="font-bold text-slate-900 dark:text-white">
            Sua Equipe <span className={`ml-1 text-sm font-normal ${selectedTeam.length === 6 ? 'text-emerald-500' : 'text-slate-400'}`}>
              ({selectedTeam.length}/6)
            </span>
          </h2>
          <div className="flex flex-wrap gap-2 justify-end">
            {user && (
              <>
                <button onClick={handleLoadTeam} className="btn-ghost text-xs text-blue-500 hover:text-blue-600">
                  ☁️ Carregar
                </button>
                {selectedTeam.length === 6 && (
                  <button onClick={handleSaveTeam} disabled={cloudStatus === 'saving'} className="btn-ghost text-xs text-emerald-500 hover:text-emerald-600">
                    {cloudStatus === 'saving' ? 'Salvando...' : cloudStatus === 'saved' ? '✅ Salvo!' : '💾 Salvar Time'}
                  </button>
                )}
              </>
            )}
            {selectedTeam.length > 0 && (
              <button onClick={clearTeam} className="btn-ghost text-xs text-red-500 hover:text-red-600">
                🗑️ Limpar
              </button>
            )}
          </div>
        </div>
        
        {/* Seasonal rule validation */}
        {currentSeason && selectedTeam.length > 0 && (
          <div className={`mb-4 px-4 py-3 rounded-xl border ${
            seasonViolations.length === 0 
              ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300' 
              : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
          }`}>
            {seasonViolations.length === 0 ? (
              <p className="font-bold">{currentSeason.emoji} Time válido para Batalhas Sazonais de {currentSeason.name}!</p>
            ) : (
              <>
                <p className="font-bold mb-1">⚠️ Equipe incompatível com a Temporada (permitida apenas em Batalhas Casuais):</p>
                {seasonViolations.map((v, i) => <p key={i} className="text-xs ml-4">• {v}</p>)}
              </>
            )}
          </div>
        )}
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 6 }).map((_, i) => {
            const poke = selectedTeam[i];
            return (
              <div
                key={i}
                className={`relative flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all min-h-[90px] ${
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
                    {poke.item && (
                      <span className="text-sm" title={ITEMS[poke.item.id]?.name}>{poke.item.icon}</span>
                    )}
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
        
        {/* Equipe pronta button */}
        {selectedTeam.length === 6 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigate('/battle')}
              className="btn-battle w-full sm:w-auto text-lg py-3 px-8 shadow-xl hover:scale-105 transition-transform"
            >
              ✅ Equipe pronta! Batalhar →
            </button>
          </div>
        )}
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
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:border-red-400 transition-colors capitalize cursor-pointer appearance-none"
          style={{ minWidth: '150px' }}
        >
          {TYPE_FILTERS.map(t => (
            <option key={t} value={t} className="capitalize">{t}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {loading ? <Spinner text="Carregando Pokémon..." /> : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filtered.map(pokemon => {
              const inTeam  = isInTeam(pokemon.id);
              const full    = selectedTeam.length >= 6 && !inTeam;

              return (
                <button
                  key={pokemon.id}
                  id={`select-poke-${pokemon.id}`}
                  onClick={() => handleCardClick(pokemon)}
                  disabled={full}
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
                  <img
                    src={pokemon.sprites?.other?.['official-artwork']?.front_default
                      || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                    alt={pokemon.name}
                    className="w-16 h-16 object-contain group-hover:scale-110 transition-transform"
                    loading="lazy"
                  />
                  <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 capitalize truncate w-full text-center">
                    {pokemon.name}
                  </p>
                  <div className="flex gap-1 flex-wrap justify-center">
                    {pokemon.types?.map(t => (
                      <TypeBadge key={t.type.name} type={t.type.name} />
                    ))}
                  </div>
                  {!inTeam && !full && (
                    <span className="text-[9px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Clique para customizar →
                    </span>
                  )}
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
