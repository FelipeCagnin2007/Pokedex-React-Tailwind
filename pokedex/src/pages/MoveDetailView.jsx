import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchMove, formatName, getIdFromUrl, getSpriteUrl } from '../api/pokeapi';
import Spinner from '../components/ui/Spinner';
import TypeBadge from '../components/ui/TypeBadge';

export default function MoveDetailView() {
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
        const moveData = await fetchMove(id);
        setData(moveData);
      } catch (e) {
        setError("Move not found.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="mt-20"><Spinner text="Loading move..." /></div>;
  if (error || !data) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold text-poke-red">{error}</h2>
      <button onClick={() => navigate(-1)} className="mt-4 text-poke-blue hover:underline font-bold">Voltar</button>
    </div>
  );

  const flavorText = data.flavor_text_entries?.find(e => e.language.name === 'en')?.flavor_text.replace(/\n|\f/g, ' ');
  const effectEntry = data.effect_entries?.find(e => e.language.name === 'en');
  let effectText = effectEntry?.effect;
  
  // Replace $effect_chance variables in effect text
  if (effectText && data.effect_chance) {
    effectText = effectText.replace(/\$effect_chance/g, data.effect_chance);
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4">
        <button onClick={() => navigate(-1)} className="text-sm font-bold text-poke-blue hover:text-poke-red hover:underline">&laquo; Back</button>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-2xl animate-slide-up mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-poke-red mb-6 capitalize flex items-center gap-4 drop-shadow-sm border-b border-poke-gray/50 pb-4">
          {formatName(data.name)} 
          <Link to={`/type/${data.type.name}`} className="hover:scale-105 transition-transform">
            <TypeBadge type={data.type.name} size="lg" />
          </Link>
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-xl font-bold text-poke-dark mb-4 border-b-2 border-poke-gray-light pb-1">Move data</h2>
          <table className="w-full text-sm text-left border-collapse border border-poke-gray bg-white">
            <tbody>
              <tr className="border-b border-poke-gray">
                <th className="py-2 px-4 text-poke-gray-dark w-1/3 bg-poke-gray-light font-bold">Type</th>
                <td className="py-2 px-4"><Link to={`/type/${data.type.name}`} className="hover:brightness-110"><TypeBadge type={data.type.name} /></Link></td>
              </tr>
              <tr className="border-b border-poke-gray">
                <th className="py-2 px-4 text-poke-gray-dark bg-poke-gray-light font-bold">Category</th>
                <td className="py-2 px-4 font-bold capitalize text-poke-dark">{data.damage_class?.name}</td>
              </tr>
              <tr className="border-b border-poke-gray">
                <th className="py-2 px-4 text-poke-gray-dark bg-poke-gray-light font-bold">Power</th>
                <td className="py-2 px-4 font-mono">{data.power || '—'}</td>
              </tr>
              <tr className="border-b border-poke-gray">
                <th className="py-2 px-4 text-poke-gray-dark bg-poke-gray-light font-bold">Accuracy</th>
                <td className="py-2 px-4 font-mono">{data.accuracy ? `${data.accuracy}%` : '—'}</td>
              </tr>
              <tr className="border-b border-poke-gray">
                <th className="py-2 px-4 text-poke-gray-dark bg-poke-gray-light font-bold">PP</th>
                <td className="py-2 px-4 font-mono">{data.pp} (max. {Math.floor(data.pp * 1.6)})</td>
              </tr>
              <tr>
                <th className="py-2 px-4 text-poke-gray-dark bg-poke-gray-light font-bold">Target</th>
                <td className="py-2 px-4 capitalize">{data.target?.name.replace(/-/g, ' ')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h2 className="text-xl font-bold text-poke-dark mb-4 border-b-2 border-poke-gray-light pb-1">Effect</h2>
          <div className="bg-poke-gray-light border-l-4 border-poke-blue p-4 text-poke-dark-2">
            {flavorText && <p className="font-bold mb-4 italic text-poke-dark">"{flavorText}"</p>}
            {effectText ? (
              <p className="text-sm leading-relaxed">{effectText}</p>
            ) : (
              <p className="text-sm italic">Detailed effect not available.</p>
            )}
            
            {data.stat_changes?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-poke-gray">
                <p className="font-bold text-sm mb-2 text-poke-dark">Stat changes:</p>
                <ul className="list-disc pl-5 text-sm">
                  {data.stat_changes.map(s => (
                    <li key={s.stat.name}>
                      <span className="capitalize">{s.stat.name.replace(/-/g, ' ')}</span>: {s.change > 0 ? '+' : ''}{s.change}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-poke-dark mb-4 border-b-2 border-poke-gray-light pb-1">Pokémon that learn {formatName(data.name)} ({data.learned_by_pokemon?.length || 0})</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {data.learned_by_pokemon?.map(p => {
            const pokeId = getIdFromUrl(p.url);
            return (
              <Link 
                key={p.name} 
                to={`/pokemon/${p.name}`}
                className="flex flex-col items-center p-3 border border-poke-gray rounded hover:bg-poke-gray-light transition-colors group"
              >
                <img 
                  src={getSpriteUrl(pokeId)} 
                  alt={p.name} 
                  className="w-16 h-16 group-hover:scale-110 transition-transform mb-2"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <span className="text-xs text-poke-gray-dark mb-1">#{String(pokeId).padStart(4, '0')}</span>
                <span className="text-sm font-bold text-poke-blue group-hover:text-poke-red capitalize text-center">
                  {formatName(p.name)}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

    </main>
  );
}
