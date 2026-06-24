import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const CACHE_KEY = 'pokeapi_search_cache';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 1 week

const CATEGORY_META = {
  pokemon: { label: 'Pokémon', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400', emoji: '⭐' },
  item:    { label: 'Item',    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400', emoji: '🎒' },
  move:    { label: 'Move',   color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400', emoji: '⚡' },
  region:  { label: 'Região', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400', emoji: '🗺️' },
};

function highlight(text, query) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 dark:bg-yellow-800 text-inherit rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function GlobalSearch() {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen]   = useState(false);
  const [data, setData]       = useState({ pokemon: [], items: [], moves: [], regions: [] });
  const [loading, setLoading] = useState(true);
  const [focusIdx, setFocusIdx] = useState(-1);

  const wrapperRef = useRef(null);
  const inputRef   = useRef(null);
  const navigate   = useNavigate();

  useEffect(() => {
    async function loadSearchData() {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < CACHE_EXPIRY) {
            setData(parsed.data);
            setLoading(false);
            return;
          }
        } catch { /* invalid cache */ }
      }

      try {
        const [pokemonRes, itemsRes, movesRes, regionRes] = await Promise.all([
          fetch('https://pokeapi.co/api/v2/pokemon?limit=2000').then(r => r.json()),
          fetch('https://pokeapi.co/api/v2/item?limit=2000').then(r => r.json()),
          fetch('https://pokeapi.co/api/v2/move?limit=1000').then(r => r.json()),
          fetch('https://pokeapi.co/api/v2/region?limit=100').then(r => r.json()),
        ]);

        const searchData = {
          pokemon: pokemonRes.results.map(r => r.name),
          items:   itemsRes.results.map(r => r.name),
          moves:   movesRes.results.map(r => r.name),
          regions: regionRes.results.map(r => r.name),
        };

        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: searchData }));
        } catch { /* quota exceeded */ }

        setData(searchData);
      } catch (err) {
        console.error('Failed to load search data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSearchData();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const q = query.toLowerCase();
    const searchCat = (arr, category) =>
      (arr || []).filter(name => name.includes(q)).slice(0, 4).map(name => ({ name, category }));

    const res = [
      ...searchCat(data.pokemon, 'pokemon'),
      ...searchCat(data.items,   'item'),
      ...searchCat(data.moves,   'move'),
      ...searchCat(data.regions, 'region'),
    ].slice(0, 10);

    setResults(res);
    setIsOpen(true);
    setFocusIdx(-1);
  }, [query, data]);

  const handleSelect = (item) => {
    setQuery('');
    setIsOpen(false);
    const routes = { pokemon: `/pokemon/${item.name}`, move: `/move/${item.name}`, item: `/item/${item.name}`, region: `/region/${item.name}` };
    navigate(routes[item.category] || '/');
  };

  const handleKeyDown = (e) => {
    if (!isOpen || !results.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocusIdx(i => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setFocusIdx(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && focusIdx >= 0) { handleSelect(results[focusIdx]); }
    if (e.key === 'Escape') setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          {loading
            ? <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
            : <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
          }
        </div>
        <input
          ref={inputRef}
          id="global-search-input"
          type="search"
          className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 rounded-xl py-2 pl-9 pr-4
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            focus:outline-none focus:border-red-400 dark:focus:border-red-500 focus:bg-white dark:focus:bg-slate-700
            transition-all text-sm"
          placeholder={loading ? 'Carregando índice...' : 'Buscar Pokémon, Moves...'}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => { if (query.length >= 2) setIsOpen(true); }}
          onKeyDown={handleKeyDown}
          disabled={loading}
          autoComplete="off"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setIsOpen(false); inputRef.current?.focus(); }}
            className="absolute inset-y-0 right-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && (results.length > 0 || query.length >= 2) && (
        <div className="absolute z-50 mt-1.5 w-full bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-card-hover overflow-hidden animate-slide-up">
          {results.length === 0 ? (
            <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-sm">
              Nenhum resultado para "{query}"
            </div>
          ) : (
            <ul role="listbox">
              {results.map((item, idx) => {
                const meta = CATEGORY_META[item.category] || CATEGORY_META.item;
                return (
                  <li
                    key={`${item.category}-${item.name}`}
                    role="option"
                    aria-selected={focusIdx === idx}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setFocusIdx(idx)}
                    className={`flex items-center justify-between px-3.5 py-2.5 cursor-pointer border-b border-slate-100 dark:border-slate-700 last:border-0 transition-colors
                      ${focusIdx === idx ? 'bg-slate-50 dark:bg-slate-700' : 'hover:bg-slate-50 dark:hover:bg-slate-700/60'}
                    `}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base flex-shrink-0">{meta.emoji}</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100 text-sm capitalize truncate">
                        {highlight(item.name.replace(/-/g, ' '), query.replace(/-/g, ' '))}
                      </span>
                    </div>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ${meta.color}`}>
                      {meta.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
