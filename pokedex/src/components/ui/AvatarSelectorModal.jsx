import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { fetchAllPokemon, getSpriteUrl } from '../../api/pokeapi';
import Spinner from './Spinner';

export default function AvatarSelectorModal({ isOpen, onClose, onSelect }) {
  const [allPokemon, setAllPokemon] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && allPokemon.length === 0) {
      setLoading(true);
      fetchAllPokemon()
        .then(setAllPokemon)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen, allPokemon.length]);

  if (!isOpen) return null;

  // Filter
  const query = search.toLowerCase();
  const filtered = allPokemon
    .filter(p => p.name.includes(query))
    .slice(0, 50); // Limit to 50 for performance

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Escolha seu Avatar</h2>
          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar Pokémon pelo nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-red-400 text-slate-900 dark:text-white rounded-xl py-3 pl-10 pr-4 outline-none transition-all"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
          {loading ? (
            <div className="flex justify-center py-12"><Spinner text="Carregando Pokédex..." /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500">Nenhum Pokémon encontrado.</div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {filtered.map(pokemon => {
                // Extract ID from URL to get the high-res sprite
                // url: "https://pokeapi.co/api/v2/pokemon/25/"
                const id = pokemon.url.split('/').filter(Boolean).pop();
                const spriteUrl = getSpriteUrl(id);

                return (
                  <button
                    key={pokemon.name}
                    onClick={() => {
                      onSelect(spriteUrl);
                      onClose();
                    }}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-red-400 dark:hover:border-red-500 hover:shadow-glow-red transition-all group aspect-square"
                  >
                    <img 
                      src={spriteUrl} 
                      alt={pokemon.name} 
                      className="w-16 h-16 object-contain group-hover:scale-110 transition-transform drop-shadow-md mb-2" 
                      loading="lazy"
                    />
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 capitalize truncate w-full text-center">
                      {pokemon.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
