import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchAbility, formatName, getSpriteUrl, getIdFromUrl } from '../api/pokeapi';
import Spinner from '../components/ui/Spinner';

export default function AbilityDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const abilityData = await fetchAbility(id);
        setData(abilityData);
      } catch (e) {
        setError("Ability not found.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="mt-20"><Spinner text="Loading ability..." /></div>;
  if (error || !data) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold text-poke-red">{error}</h2>
      <button onClick={() => navigate(-1)} className="mt-4 text-poke-blue hover:underline font-bold">Voltar</button>
    </div>
  );

  const effectEntry = data.effect_entries?.find(e => e.language.name === 'en');
  const flavorText = data.flavor_text_entries?.find(e => e.language.name === 'en')?.flavor_text.replace(/\n|\f/g, ' ');

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4">
        <button onClick={() => navigate(-1)} className="text-sm font-bold text-poke-blue hover:text-poke-red hover:underline">&laquo; Back</button>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-2xl animate-slide-up mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-poke-red mb-6 capitalize drop-shadow-sm border-b border-poke-gray/50 pb-4">
          {formatName(data.name)} (Ability)
        </h1>
        <div className="bg-white/40 border-l-4 border-poke-red p-6 mt-4 text-poke-dark rounded-r-lg shadow-sm">
          {flavorText && <p className="font-bold mb-2 italic">"{flavorText}"</p>}
          {effectEntry ? (
            <p className="text-sm">{effectEntry.effect}</p>
          ) : (
            <p className="text-sm italic">Detailed effect not available.</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-poke-dark mb-4 border-b-2 border-poke-gray-light pb-1">Pokémon with {formatName(data.name)} ({data.pokemon.length})</h2>
        <div className="border border-poke-gray bg-white rounded overflow-hidden">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-poke-gray-light border-b border-poke-gray">
              <tr>
                <th className="py-2 px-4 font-bold text-poke-gray-dark w-16">#</th>
                <th className="py-2 px-4 font-bold text-poke-gray-dark">Pokémon</th>
                <th className="py-2 px-4 font-bold text-poke-gray-dark w-32">Type</th>
              </tr>
            </thead>
            <tbody>
              {data.pokemon.map(p => {
                const pokeId = getIdFromUrl(p.pokemon.url);
                return (
                  <tr key={p.pokemon.name} className="border-b border-poke-gray last:border-0 hover:bg-poke-gray-light">
                    <td className="py-2 px-4 font-mono text-poke-gray-dark">#{String(pokeId).padStart(4, '0')}</td>
                    <td className="py-2 px-4 font-bold capitalize flex items-center gap-3">
                      <img 
                        src={getSpriteUrl(pokeId)} 
                        alt={p.pokemon.name} 
                        className="w-10 h-10 object-contain"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <Link to={`/pokemon/${p.pokemon.name}`} className="text-poke-blue hover:underline">
                        {formatName(p.pokemon.name)}
                      </Link>
                      {p.is_hidden && <span className="text-[10px] text-poke-gray-dark border border-poke-gray px-1 rounded uppercase tracking-wider">Hidden</span>}
                    </td>
                    <td className="py-2 px-4">
                      {/* Would need extra fetch for types per pokemon, skipping for performance on large lists, just showing simple info */}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </main>
  );
}
