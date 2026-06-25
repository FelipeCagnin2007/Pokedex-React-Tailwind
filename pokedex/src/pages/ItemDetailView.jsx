import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchItem, formatName, getEnglishText } from '../api/pokeapi';
import Spinner from '../components/ui/Spinner';
import { Backpack } from 'lucide-react';

export default function ItemDetailView() {
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
        const itemData = await fetchItem(id);
        setData(itemData);
      } catch (e) {
        setError("Item not found.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="mt-20"><Spinner text="Loading item..." /></div>;
  if (error || !data) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold text-poke-red">{error}</h2>
      <button onClick={() => navigate(-1)} className="mt-4 text-poke-blue hover:underline font-bold">Voltar</button>
    </div>
  );

  const flavorText = getEnglishText(data.flavor_text_entries);
  const effect = data.effect_entries?.find(e => e.language.name === 'en')?.effect || '';

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div className="mb-4">
        <button onClick={() => navigate(-1)} className="text-sm font-bold text-poke-blue hover:text-poke-red hover:underline">&laquo; Back</button>
      </div>

      <div className="glass-panel p-8 rounded-2xl animate-slide-up">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 border-b border-poke-gray/50 pb-6">
          <div className="bg-white/50 p-6 rounded-full border border-poke-gray/30 shadow-inner">
            {data.sprites?.default ? (
              <img src={data.sprites.default} alt={data.name} className="w-24 h-24 object-contain animate-float" />
            ) : (
              <Backpack size={64} className="text-slate-400 drop-shadow-md" />
            )}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-poke-red font-bold text-4xl sm:text-5xl capitalize mb-2 drop-shadow-sm">{formatName(data.name)}</h1>
            <span className="bg-poke-dark text-white text-sm font-mono tracking-wider px-3 py-1 rounded-full shadow-md">ITEM #{String(data.id).padStart(4, '0')}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-sm">
          <div>
            <h3 className="font-bold text-poke-dark text-xl mb-4 border-b border-poke-red/20 pb-2">Item Data</h3>
            <div className="bg-white/40 rounded-xl overflow-hidden border border-white/50">
              <table className="w-full text-left border-collapse">
                <tbody>
                  <tr className="border-b border-poke-gray/30 hover:bg-white/60 transition-colors">
                    <th className="py-3 px-4 text-poke-gray-dark font-semibold">Category</th>
                    <td className="py-3 px-4 capitalize font-bold text-poke-dark">{data.category?.name?.replace(/-/g, ' ') || '—'}</td>
                  </tr>
                  <tr className="border-b border-poke-gray/30 hover:bg-white/60 transition-colors">
                    <th className="py-3 px-4 text-poke-gray-dark font-semibold">Cost</th>
                    <td className="py-3 px-4 font-mono font-bold text-poke-dark">{data.cost ? `₽${data.cost}` : 'Not for sale'}</td>
                  </tr>
                  <tr className="hover:bg-white/60 transition-colors">
                    <th className="py-3 px-4 text-poke-gray-dark font-semibold">Fling Power</th>
                    <td className="py-3 px-4 font-mono font-bold text-poke-dark">{data.fling_power || '—'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {data.attributes?.length > 0 && (
              <div className="mt-6">
                <p className="text-poke-gray-dark mb-3 text-xs uppercase tracking-wider font-bold">Attributes</p>
                <div className="flex flex-wrap gap-2">
                  {data.attributes.map(a => (
                    <span key={a.name} className="bg-white/60 border border-poke-gray/40 text-poke-dark-2 text-xs px-3 py-1.5 rounded-full capitalize shadow-sm hover:bg-poke-red hover:text-white hover:border-poke-red transition-colors cursor-default">
                      {a.name.replace(/-/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-bold text-poke-dark text-xl mb-4 border-b border-poke-red/20 pb-2">Effect</h3>
            <div className="bg-white/40 border border-white/50 p-6 rounded-xl text-poke-dark-2 shadow-sm">
              {flavorText && (
                <p className="font-bold mb-4 text-lg italic text-poke-dark border-l-4 border-poke-red pl-4">"{flavorText}"</p>
              )}
              {effect ? (
                <p className="leading-relaxed text-base">{effect}</p>
              ) : (
                <p className="italic text-poke-gray-dark">Detailed effect not available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
