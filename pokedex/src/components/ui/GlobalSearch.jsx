import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const CACHE_KEY = 'pokeapi_search_cache';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 1 week

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({ pokemon: [], items: [], moves: [] });
  const [loading, setLoading] = useState(true);
  
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadSearchData() {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_EXPIRY) {
          setData(parsed.data);
          setLoading(false);
          return;
        }
      }

      try {
        const [pokemonRes, itemsRes, movesRes, regionRes] = await Promise.all([
          fetch('https://pokeapi.co/api/v2/pokemon?limit=2000').then(r => r.json()),
          fetch('https://pokeapi.co/api/v2/item?limit=2000').then(r => r.json()),
          fetch('https://pokeapi.co/api/v2/move?limit=1000').then(r => r.json()),
          fetch('https://pokeapi.co/api/v2/region?limit=100').then(r => r.json())
        ]);

        const searchData = {
          pokemon: pokemonRes.results.map(r => r.name),
          items: itemsRes.results.map(r => r.name),
          moves: movesRes.results.map(r => r.name),
          regions: regionRes.results.map(r => r.name),
        };

        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            data: searchData
          }));
        } catch (e) {
          console.warn("Could not cache search data to localStorage (quota exceeded or disabled). Falling back to memory.", e);
        }

        setData(searchData);
      } catch (err) {
        console.error("Failed to load search data:", err);
      } finally {
        setLoading(false);
      }
    }
    
    loadSearchData();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const searchCategory = (arr, category) => 
      (arr || []).filter(name => name.includes(q))
         .slice(0, 5) // top 5 per category
         .map(name => ({ name, category }));

    const res = [
      ...searchCategory(data.pokemon, 'pokemon'),
      ...searchCategory(data.items, 'item'),
      ...searchCategory(data.moves, 'move'),
      ...searchCategory(data.regions, 'region'),
    ];
    
    setResults(res.slice(0, 8)); // top 8 total
    setIsOpen(true);
  }, [query, data]);

  const handleSelect = (item) => {
    setQuery('');
    setIsOpen(false);
    
    if (item.category === 'pokemon') {
      navigate(`/pokemon/${item.name}`);
    } else if (item.category === 'move') {
      navigate(`/move/${item.name}`);
    } else if (item.category === 'item') {
      navigate(`/item/${item.name}`);
    } else if (item.category === 'region') {
      navigate(`/region/${item.name}`);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-sm">
      <div className="relative">
        <input
          type="text"
          className="w-full bg-poke-gray-light border-2 border-poke-gray text-poke-dark rounded-full py-1.5 pl-10 pr-4 focus:outline-none focus:border-poke-blue focus:bg-white transition-colors text-sm"
          placeholder={loading ? "Loading index..." : "Search Pokémon, Moves..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (query.length >= 2) setIsOpen(true); }}
          disabled={loading}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-poke-gray-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded border border-poke-gray shadow-lg overflow-hidden">
          <ul>
            {results.map((item, idx) => (
              <li 
                key={`${item.category}-${item.name}-${idx}`}
                className="px-4 py-2 hover:bg-poke-gray-light cursor-pointer border-b border-poke-gray last:border-0"
                onClick={() => handleSelect(item)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-poke-blue text-sm capitalize">{item.name.replace(/-/g, ' ')}</span>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-poke-gray-dark bg-poke-gray-light px-1 border border-poke-gray rounded">
                    {item.category}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded border border-poke-gray shadow-lg p-4 text-center">
          <span className="text-sm text-poke-gray-dark">No results found.</span>
        </div>
      )}
    </div>
  );
}
