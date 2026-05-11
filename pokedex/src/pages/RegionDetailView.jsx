import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchRegion, formatName } from '../api/pokeapi';
import Spinner from '../components/ui/Spinner';

export default function RegionDetailView() {
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
        const regionData = await fetchRegion(id);
        setData(regionData);
      } catch (e) {
        setError("Region not found.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="mt-20"><Spinner text="Loading region..." /></div>;
  if (error || !data) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold text-poke-red">{error}</h2>
      <button onClick={() => navigate(-1)} className="mt-4 text-poke-blue hover:underline font-bold">Voltar</button>
    </div>
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div className="mb-4">
        <button onClick={() => navigate(-1)} className="text-sm font-bold text-poke-blue hover:text-poke-red hover:underline">&laquo; Back</button>
      </div>

      <div className="glass-panel p-8 rounded-2xl animate-slide-up">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 border-b border-poke-gray/50 pb-6">
          <div className="bg-white/50 p-6 rounded-full border border-poke-gray/30 shadow-inner flex items-center justify-center">
            <span className="text-6xl animate-float">🗺️</span>
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-poke-red font-bold text-4xl sm:text-5xl capitalize mb-2 drop-shadow-sm">{formatName(data.name)} Region</h1>
            <span className="bg-poke-dark text-white text-sm font-mono tracking-wider px-3 py-1 rounded-full shadow-md">REGION #{String(data.id).padStart(2, '0')}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-sm">
          <div className="lg:col-span-1">
            <h3 className="font-bold text-poke-dark text-xl mb-4 border-b border-poke-red/20 pb-2">Geographic Data</h3>
            <div className="bg-white/40 rounded-xl overflow-hidden border border-white/50 mb-6">
              <table className="w-full text-left border-collapse">
                <tbody>
                  <tr className="border-b border-poke-gray/30 hover:bg-white/60 transition-colors">
                    <th className="py-3 px-4 text-poke-gray-dark font-semibold">Introduced In</th>
                    <td className="py-3 px-4 capitalize font-bold text-poke-dark">{data.main_generation?.name?.replace(/-/g, ' ') || '—'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {data.pokedexes?.length > 0 && (
              <div>
                <p className="text-poke-gray-dark mb-3 text-xs uppercase tracking-wider font-bold">Regional Pokédexes</p>
                <div className="flex flex-col gap-2">
                  {data.pokedexes.map(p => (
                    <span key={p.name} className="bg-white/60 border border-poke-gray/40 text-poke-dark font-bold text-sm px-4 py-2 rounded-lg capitalize shadow-sm text-center">
                      {p.name.replace(/-/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-bold text-poke-dark text-xl mb-4 border-b border-poke-red/20 pb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-poke-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Locations ({data.locations?.length || 0})
            </h3>
            
            <div className="bg-white/40 border border-white/50 p-6 rounded-xl shadow-sm">
              <div className="flex flex-wrap gap-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {data.locations?.map(l => (
                  <span 
                    key={l.name} 
                    className="bg-white/80 border border-poke-gray/40 text-poke-dark text-sm px-3 py-1.5 rounded-full capitalize shadow-sm hover:bg-poke-red hover:text-white hover:border-poke-red transition-colors cursor-default"
                  >
                    {l.name.replace(/-/g, ' ')}
                  </span>
                ))}
                {(!data.locations || data.locations.length === 0) && (
                  <span className="italic text-poke-gray-dark">No specific locations recorded for this region.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
