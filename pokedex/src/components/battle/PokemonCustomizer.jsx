/**
 * PokemonCustomizer.jsx
 * Modal that opens when a Pokémon is clicked in BattleSelect,
 * allowing the player to pick 4 moves and 1 item before adding to team.
 */
import { useState, useEffect } from 'react';
import { fetchAPI, fetchPokemonById } from '../../api/pokeapi';
import { buildBattlePokemon } from '../../battle/battleEngine';
import { ITEMS } from '../../data/items.jsx';
import TypeBadge from '../ui/TypeBadge';
import { Swords, Sparkles, Moon, HelpCircle, Check, Ban, X } from 'lucide-react';

const MOVE_CLASS_ICON = { 
  physical: <Swords size={14} className="text-red-500" />, 
  special: <Sparkles size={14} className="text-amber-500" />, 
  status: <Moon size={14} className="text-indigo-500" /> 
};

export default function PokemonCustomizer({ pokemon, onConfirm, onClose }) {
  const [fullData, setFullData] = useState(null);
  const [allMoves, setAllMoves] = useState([]);
  const [selectedMoves, setSelectedMoves] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loadingMoves, setLoadingMoves] = useState(true);
  const [moveSearch, setMoveSearch] = useState('');

  useEffect(() => {
    async function load() {
      setLoadingMoves(true);
      try {
        const data = await fetchPokemonById(pokemon.id);
        setFullData(data);

        // Fetch move details in parallel (limit 30 to avoid hammering API)
        const moveRefs = (data.moves || []).slice(0, 30);
        const details = await Promise.all(
          moveRefs.map(m => fetchAPI(m.move.url).catch(() => null))
        );
        const parsed = details
          .filter(Boolean)
          .map(m => ({
            name: m.name,
            power: m.power,
            accuracy: m.accuracy,
            pp: m.pp,
            type: m.type,
            damage_class: m.damage_class,
          }))
          .sort((a, b) => (b.power || 0) - (a.power || 0));
        setAllMoves(parsed);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingMoves(false);
      }
    }
    load();
  }, [pokemon.id]);

  function toggleMove(move) {
    setSelectedMoves(prev => {
      const idx = prev.findIndex(m => m.name === move.name);
      if (idx >= 0) return prev.filter(m => m.name !== move.name);
      if (prev.length >= 4) return prev; // max 4
      return [...prev, move];
    });
  }

  function handleConfirm() {
    if (selectedMoves.length < 1) return;
    const battlePoke = buildBattlePokemon(fullData, selectedMoves);
    if (selectedItem) battlePoke.item = selectedItem;
    onConfirm(battlePoke);
  }

  const filteredMoves = allMoves.filter(m =>
    m.name.replace(/-/g, ' ').includes(moveSearch.toLowerCase())
  );

  const sprite = pokemon.sprites?.other?.['official-artwork']?.front_default
    || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">

        {/* Header */}
        <div className="flex items-center gap-4 p-5 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <img src={sprite} alt={pokemon.name} className="w-20 h-20 object-contain drop-shadow-md" />
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold capitalize text-slate-900 dark:text-white">{pokemon.name}</h2>
            <div className="flex gap-1 mt-1">
              {(fullData?.types || pokemon.types || []).map(t => {
                const typeName = t.type?.name || t;
                return <TypeBadge key={typeName} type={typeName} />;
              })}
            </div>
            <p className="text-xs text-slate-400 mt-1">Selecione de 1 a 4 ataques</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 flex items-center justify-center text-lg font-bold transition-colors"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Moves */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">
                Ataques <span className={`ml-1 ${selectedMoves.length === 4 ? 'text-emerald-500' : 'text-slate-400'}`}>({selectedMoves.length}/4)</span>
              </h3>
              <input
                type="search"
                placeholder="Buscar ataque..."
                value={moveSearch}
                onChange={e => setMoveSearch(e.target.value)}
                className="px-3 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 outline-none focus:border-red-400"
              />
            </div>

            {/* Selected moves chips */}
            {selectedMoves.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {selectedMoves.map(m => (
                  <button
                    key={m.name}
                    onClick={() => toggleMove(m)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-semibold hover:bg-red-100 hover:text-red-600 transition-colors group"
                  >
                    <span className="capitalize">{m.name.replace(/-/g, ' ')}</span>
                    <X size={12} className="opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            )}

            {loadingMoves ? (
              <div className="flex items-center justify-center py-8 gap-2 text-slate-400 text-sm">
                <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                Carregando ataques...
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-52 overflow-y-auto pr-1">
                {filteredMoves.map(move => {
                  const isSelected = selectedMoves.some(m => m.name === move.name);
                  const isFull = selectedMoves.length >= 4 && !isSelected;
                  return (
                    <button
                      key={move.name}
                      onClick={() => toggleMove(move)}
                      disabled={isFull}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all text-xs border
                        ${isSelected
                          ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                          : isFull
                          ? 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-400 text-slate-700 dark:text-slate-300 cursor-pointer'
                        }`}
                    >
                      <span className="flex items-center justify-center w-5 h-5">{MOVE_CLASS_ICON[move.damage_class?.name] || <HelpCircle size={14} className="text-slate-400" />}</span>
                      <span className="flex-1 capitalize font-medium truncate">{move.name.replace(/-/g, ' ')}</span>
                      {move.type && (
                        <TypeBadge type={move.type.name} small />
                      )}
                      {move.power && (
                        <span className="text-[10px] text-slate-400 shrink-0">{move.power}</span>
                      )}
                      {isSelected && <Check size={16} className="text-emerald-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Item */}
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-2">Item equipado</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              <button
                onClick={() => setSelectedItem(null)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs border transition-all text-left
                  ${!selectedItem
                    ? 'border-slate-400 bg-slate-100 dark:bg-slate-700 font-semibold text-slate-700 dark:text-white'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:border-slate-400'
                  }`}
              >
                <Ban size={16} className="text-slate-400" />
                <span>Sem item</span>
              </button>
              {Object.values(ITEMS).map(item => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(isSelected ? null : item)}
                    title={item.description}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs border transition-all text-left
                      ${isSelected
                        ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-300 cursor-pointer'
                      }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="truncate">{item.name}</span>
                    {isSelected && <Check size={16} className="text-blue-500 ml-auto shrink-0" />}
                  </button>
                );
              })}
            </div>
            {selectedItem && (
              <p className="text-xs text-slate-400 mt-2 italic">{selectedItem.description}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
          <button onClick={onClose} className="flex-1 btn-ghost">
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedMoves.length < 1}
            className={`flex-2 btn-battle px-8 flex items-center justify-center gap-2 ${selectedMoves.length < 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Check size={18} /> Adicionar ao time
          </button>
        </div>
      </div>
    </div>
  );
}
