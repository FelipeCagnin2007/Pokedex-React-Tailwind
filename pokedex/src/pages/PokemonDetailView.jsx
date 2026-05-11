import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  fetchPokemonById, fetchSpeciesById, fetchAPI, formatName, getSpriteUrl,
} from '../api/pokeapi';
import TypeBadge from '../components/ui/TypeBadge';
import StatBar from '../components/ui/StatBar';
import Spinner from '../components/ui/Spinner';

// Base Type Chart
const TYPE_CHART = {
  normal: { weak: ['fighting'], resist: [], immune: ['ghost'] },
  fire: { weak: ['water', 'ground', 'rock'], resist: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'], immune: [] },
  water: { weak: ['electric', 'grass'], resist: ['fire', 'water', 'ice', 'steel'], immune: [] },
  electric: { weak: ['ground'], resist: ['electric', 'flying', 'steel'], immune: [] },
  grass: { weak: ['fire', 'ice', 'poison', 'flying', 'bug'], resist: ['water', 'electric', 'grass', 'ground'], immune: [] },
  ice: { weak: ['fire', 'fighting', 'rock', 'steel'], resist: ['ice'], immune: [] },
  fighting: { weak: ['flying', 'psychic', 'fairy'], resist: ['bug', 'rock', 'dark'], immune: [] },
  poison: { weak: ['ground', 'psychic'], resist: ['grass', 'fighting', 'poison', 'bug', 'fairy'], immune: [] },
  ground: { weak: ['water', 'grass', 'ice'], resist: ['poison', 'rock'], immune: ['electric'] },
  flying: { weak: ['electric', 'ice', 'rock'], resist: ['grass', 'fighting', 'bug'], immune: ['ground'] },
  psychic: { weak: ['bug', 'ghost', 'dark'], resist: ['fighting', 'psychic'], immune: [] },
  bug: { weak: ['fire', 'flying', 'rock'], resist: ['grass', 'fighting', 'ground'], immune: [] },
  rock: { weak: ['water', 'grass', 'fighting', 'ground', 'steel'], resist: ['normal', 'fire', 'poison', 'flying'], immune: [] },
  ghost: { weak: ['ghost', 'dark'], resist: ['poison', 'bug'], immune: ['normal', 'fighting'] },
  dragon: { weak: ['ice', 'dragon', 'fairy'], resist: ['fire', 'water', 'electric', 'grass'], immune: [] },
  dark: { weak: ['fighting', 'bug', 'fairy'], resist: ['ghost', 'dark'], immune: ['psychic'] },
  steel: { weak: ['fire', 'fighting', 'ground'], resist: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'], immune: ['poison'] },
  fairy: { weak: ['poison', 'steel'], resist: ['fighting', 'bug', 'dark'], immune: ['dragon'] },
};

function calculateDefenses(types, activeAbility) {
  const defenses = {};
  Object.keys(TYPE_CHART).forEach(t => defenses[t] = 1);

  types.forEach(typeObj => {
    const t = typeObj.type.name;
    const chart = TYPE_CHART[t];
    if (!chart) return;
    
    chart.weak.forEach(w => defenses[w] *= 2);
    chart.resist.forEach(r => defenses[r] *= 0.5);
    chart.immune.forEach(i => defenses[i] *= 0);
  });

  // Apply ability modifiers
  if (activeAbility === 'levitate') defenses['ground'] = 0;
  if (activeAbility === 'water-absorb' || activeAbility === 'dry-skin' || activeAbility === 'storm-drain') defenses['water'] = 0;
  if (activeAbility === 'volt-absorb' || activeAbility === 'motor-drive' || activeAbility === 'lightning-rod') defenses['electric'] = 0;
  if (activeAbility === 'flash-fire' || activeAbility === 'well-baked-body') defenses['fire'] = 0;
  if (activeAbility === 'sap-sipper') defenses['grass'] = 0;
  if (activeAbility === 'earth-eater') defenses['ground'] = 0;
  if (activeAbility === 'thick-fat') {
    defenses['fire'] *= 0.5;
    defenses['ice'] *= 0.5;
  }
  if (activeAbility === 'purifying-salt') defenses['ghost'] *= 0.5;
  if (activeAbility === 'fluffy') defenses['fire'] *= 2; // Actually also resists contact, but simplifies here

  return defenses;
}

export default function PokemonDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [data, setData] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolution, setEvolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeAbility, setActiveAbility] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      setActiveAbility(null);
      try {
        const pokeData = await fetchPokemonById(id);
        setData(pokeData);
        
        try {
          const specData = await fetchSpeciesById(pokeData.id);
          setSpecies(specData);
          if (specData.evolution_chain?.url) {
            const evoData = await fetchAPI(specData.evolution_chain.url);
            setEvolution(evoData);
          }
        } catch (e) {
          console.warn("No species data found", e);
        }
      } catch (e) {
        setError("Pokémon não encontrado.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="mt-20"><Spinner text="Loading Pokémon..." /></div>;
  if (error || !data) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold text-poke-red">{error}</h2>
      <button onClick={() => navigate(-1)} className="mt-4 text-poke-blue hover:underline font-bold">Voltar</button>
    </div>
  );

  const spriteUrl = data.sprites?.other?.['official-artwork']?.front_default || getSpriteUrl(data.id);
  const totalStats = data.stats?.reduce((acc, s) => acc + s.base_stat, 0) || 0;
  const defenses = calculateDefenses(data.types || [], activeAbility);
  
  const englishEntries = species?.flavor_text_entries?.filter(e => e.language.name === 'en') || [];
  const uniqueEntries = [];
  const seen = new Set();
  englishEntries.forEach(e => {
    const text = e.flavor_text.replace(/\f|\n/g, ' ');
    if (!seen.has(text)) {
      seen.add(text);
      uniqueEntries.push({ text, version: e.version.name });
    }
  });

  // Extract Moves
  // Filter for most recent common version group like 'scarlet-violet' or fallback
  const allMoves = data.moves || [];
  const getMovesByMethod = (method) => {
    return allMoves.map(m => {
      // Find latest version detail
      const versionDetails = m.version_group_details.filter(v => v.move_learn_method.name === method);
      if (versionDetails.length === 0) return null;
      // Sort to get the most recent generation if possible (higher version group id usually, or just take the last one)
      const latest = versionDetails[versionDetails.length - 1];
      return {
        name: m.move.name,
        level: latest.level_learned_at,
      };
    }).filter(Boolean).sort((a, b) => a.level - b.level);
  };

  const levelUpMoves = getMovesByMethod('level-up');
  const tmHMoves = getMovesByMethod('machine');

  function renderEvolutionChain(chain) {
    if (!chain) return null;
    const speciesName = chain.species.name;
    const isCurrent = speciesName === data.name || speciesName === species?.name;
    
    return (
      <div key={speciesName} className="flex flex-col items-center">
        <div className="text-center w-24">
          <Link to={`/pokemon/${speciesName}`}>
            <img src={getSpriteUrl(chain.species.url.split('/').at(-2))} alt={speciesName} className="w-16 h-16 mx-auto mb-1 hover:scale-110 transition-transform" />
            <p className={`text-xs uppercase font-bold ${isCurrent ? 'text-poke-red' : 'text-poke-blue hover:underline cursor-pointer'}`}>
              {formatName(speciesName)}
            </p>
          </Link>
        </div>
        {chain.evolves_to?.length > 0 && (
          <div className="flex items-center gap-4 mt-2 border-t border-poke-gray pt-4 relative">
            {chain.evolves_to.map(child => (
              <div key={child.species.name} className="flex items-center">
                <div className="mx-2 text-poke-gray-dark text-xs font-bold">&rarr;</div>
                {renderEvolutionChain(child)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4">
        <button onClick={() => navigate(-1)} className="text-sm font-bold text-poke-blue hover:text-poke-red hover:underline">&laquo; Back</button>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-2xl animate-slide-up mb-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-poke-red mb-2 capitalize drop-shadow-sm flex flex-col sm:flex-row items-start sm:items-end gap-2 sm:gap-4">
          {data.name.replace(/-/g, ' ')} 
          <span className="text-poke-gray-dark text-xl sm:text-2xl font-mono bg-white px-2 py-1 rounded shadow-sm border border-poke-gray">#{String(data.id).padStart(4, '0')}</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image */}
        <div className="lg:col-span-1 text-center">
          <img src={spriteUrl} alt={data.name} className="w-full max-w-[300px] h-auto mx-auto drop-shadow-md" />
        </div>

        {/* Right Column: Pokedex Data & Stats */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-poke-dark mb-2 border-b-2 border-poke-gray-light pb-1">Pokédex Data</h2>
          <table className="w-full text-sm mb-8 text-left border-collapse">
            <tbody>
              <tr className="border-b border-poke-gray">
                <th className="py-2 text-poke-gray-dark w-1/4 font-normal">Type</th>
                <td className="py-2 flex gap-1">
                  {data.types?.map(t => (
                    <Link key={t.type.name} to={`/type/${t.type.name}`}>
                      <TypeBadge type={t.type.name} />
                    </Link>
                  ))}
                </td>
              </tr>
              <tr className="border-b border-poke-gray">
                <th className="py-2 text-poke-gray-dark font-normal">Species</th>
                <td className="py-2 font-medium">{species ? species.genera.find(g => g.language.name === 'en')?.genus : '—'}</td>
              </tr>
              <tr className="border-b border-poke-gray">
                <th className="py-2 text-poke-gray-dark font-normal">Height</th>
                <td className="py-2 font-medium">{(data.height / 10).toFixed(1)} m</td>
              </tr>
              <tr className="border-b border-poke-gray">
                <th className="py-2 text-poke-gray-dark font-normal">Weight</th>
                <td className="py-2 font-medium">{(data.weight / 10).toFixed(1)} kg</td>
              </tr>
              <tr className="border-b border-poke-gray">
                <th className="py-2 text-poke-gray-dark align-top font-normal">Abilities</th>
                <td className="py-2">
                  <ol className="list-decimal pl-4">
                    {data.abilities?.map(a => (
                      <li key={a.ability.name} className={`capitalize ${a.is_hidden ? 'text-poke-gray-dark text-xs mt-1' : 'font-bold'}`}>
                        <Link to={`/ability/${a.ability.name}`} className="text-poke-blue hover:underline">
                          {a.ability.name.replace(/-/g, ' ')}
                        </Link>
                        {a.is_hidden && ' (hidden ability)'}
                      </li>
                    ))}
                  </ol>
                </td>
              </tr>
            </tbody>
          </table>

          <h2 className="text-xl font-bold text-poke-dark mb-2 border-b-2 border-poke-gray-light pb-1">Base stats</h2>
          <table className="w-full text-sm mb-2 text-left border-collapse">
            <tbody>
              {data.stats?.map(s => (
                <tr key={s.stat.name} className="border-b border-poke-gray hover:bg-poke-gray-light">
                  <th className="py-1 text-poke-gray-dark w-1/5 font-normal">{s.stat.name === 'special-attack' ? 'Sp. Atk' : s.stat.name === 'special-defense' ? 'Sp. Def' : s.stat.name.charAt(0).toUpperCase() + s.stat.name.slice(1)}</th>
                  <td className="py-1 font-mono w-12 text-right pr-4">{s.base_stat}</td>
                  <td className="py-1 w-full">
                    <div className="w-full bg-poke-gray-light h-3 rounded-full border border-poke-gray overflow-hidden">
                      <div className={`h-full ${s.base_stat > 90 ? 'bg-green-500' : s.base_stat > 50 ? 'bg-yellow-400' : 'bg-red-500'}`} style={{ width: `${Math.min((s.base_stat / 255) * 100, 100)}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
              <tr>
                <th className="py-2 text-poke-gray-dark font-bold">Total</th>
                <td className="py-2 font-bold font-mono text-right pr-4">{totalStats}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        {/* Type Defenses */}
        <div>
          <div className="flex justify-between items-end mb-4 border-b-2 border-poke-gray-light pb-1">
            <h2 className="text-xl font-bold text-poke-dark">Type defenses</h2>
            {data.abilities?.length > 0 && (
              <select 
                className="text-xs border border-poke-gray rounded px-2 py-1 bg-white outline-none focus:border-poke-blue"
                value={activeAbility || ''}
                onChange={(e) => setActiveAbility(e.target.value || null)}
              >
                <option value="">Standard defenses</option>
                {data.abilities.map(a => (
                  <option key={a.ability.name} value={a.ability.name}>With {a.ability.name.replace(/-/g, ' ')}</option>
                ))}
              </select>
            )}
          </div>
          <p className="text-sm text-poke-dark-2 mb-4">The effectiveness of each type on <span className="capitalize">{data.name.replace(/-/g, ' ')}</span>.</p>
          <div className="grid grid-cols-6 gap-1">
            {Object.keys(TYPE_CHART).map(type => {
              const mult = defenses[type] || 1;
              let display = mult;
              if (mult === 0.5) display = '½';
              if (mult === 0.25) display = '¼';
              if (mult === 1) display = '';
              
              let bg = 'bg-white';
              if (mult > 1) bg = 'bg-red-100 text-red-800 font-bold border-red-200';
              else if (mult < 1 && mult > 0) bg = 'bg-green-100 text-green-800 font-bold border-green-200';
              else if (mult === 0) bg = 'bg-gray-200 text-gray-800 font-bold border-gray-300';

              return (
                <div key={type} className={`flex flex-col text-center border ${bg === 'bg-white' ? 'border-poke-gray' : ''} ${bg}`}>
                  <Link to={`/type/${type}`} className={`text-[10px] uppercase font-bold text-white py-1 hover:brightness-110 ${TYPE_CHART[type] ? `bg-type-${type}` : 'bg-poke-gray'}`}>
                    {type.substring(0, 3)}
                  </Link>
                  <div className={`text-xs py-2 min-h-[30px] flex items-center justify-center`}>
                    {display}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Evolution Chart */}
        {evolution && (
          <div>
            <h2 className="text-xl font-bold text-poke-dark mb-4 border-b-2 border-poke-gray-light pb-1">Evolution chart</h2>
            <div className="bg-white border border-poke-gray rounded-lg p-6 flex justify-center items-center overflow-auto min-h-[200px]">
              {renderEvolutionChain(evolution.chain)}
            </div>
          </div>
        )}
      </div>

      {/* Moves tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div>
          <h2 className="text-xl font-bold text-poke-dark mb-4 border-b-2 border-poke-gray-light pb-1">Moves learnt by level up</h2>
          <div className="border border-poke-gray bg-white rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-poke-gray-light border-b border-poke-gray">
                <tr>
                  <th className="py-2 px-4 font-bold text-poke-gray-dark w-16">Lv.</th>
                  <th className="py-2 px-4 font-bold text-poke-gray-dark">Move</th>
                </tr>
              </thead>
              <tbody>
                {levelUpMoves.length > 0 ? levelUpMoves.map((m, i) => (
                  <tr key={`${m.name}-${i}`} className="border-b border-poke-gray last:border-0 hover:bg-poke-gray-light">
                    <td className="py-2 px-4 font-mono">{m.level === 0 ? 'Evo' : m.level}</td>
                    <td className="py-2 px-4 font-bold capitalize">
                      <Link to={`/move/${m.name}`} className="text-poke-blue hover:underline">{m.name.replace(/-/g, ' ')}</Link>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="2" className="py-4 px-4 text-center text-poke-gray-dark">No data available for recent generations.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-poke-dark mb-4 border-b-2 border-poke-gray-light pb-1">Moves learnt by TM</h2>
          <div className="border border-poke-gray bg-white rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-poke-gray-light border-b border-poke-gray">
                <tr>
                  <th className="py-2 px-4 font-bold text-poke-gray-dark">Move</th>
                </tr>
              </thead>
              <tbody>
                {tmHMoves.length > 0 ? tmHMoves.map((m, i) => (
                  <tr key={`${m.name}-${i}`} className="border-b border-poke-gray last:border-0 hover:bg-poke-gray-light">
                    <td className="py-2 px-4 font-bold capitalize">
                      <Link to={`/move/${m.name}`} className="text-poke-blue hover:underline">{m.name.replace(/-/g, ' ')}</Link>
                    </td>
                  </tr>
                )) : (
                  <tr><td className="py-4 px-4 text-center text-poke-gray-dark">No data available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </main>
  );
}
