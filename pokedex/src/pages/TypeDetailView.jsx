import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchType, formatName, getSpriteUrl, getIdFromUrl } from '../api/pokeapi';
import Spinner from '../components/ui/Spinner';
import TypeBadge from '../components/ui/TypeBadge';

export default function TypeDetailView() {
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
        const typeData = await fetchType(id);
        setData(typeData);
      } catch (e) {
        setError("Type not found.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="mt-20"><Spinner text="Loading type..." /></div>;
  if (error || !data) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold text-poke-red">{error}</h2>
      <button onClick={() => navigate(-1)} className="mt-4 text-poke-blue hover:underline font-bold">Voltar</button>
    </div>
  );

  const rel = data.damage_relations;

  const renderRelationList = (title, list, damageFactor) => {
    if (!list || list.length === 0) return null;
    return (
      <div className="mb-4">
        <h3 className="font-bold text-poke-dark mb-2 text-sm">{title} <span className="font-mono text-poke-gray-dark bg-poke-gray-light px-1 border border-poke-gray rounded">{damageFactor}</span></h3>
        <div className="flex flex-wrap gap-1">
          {list.map(t => (
            <Link key={t.name} to={`/type/${t.name}`} className="hover:brightness-110">
              <TypeBadge type={t.name} />
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4">
        <button onClick={() => navigate(-1)} className="text-sm font-bold text-poke-blue hover:text-poke-red hover:underline">&laquo; Back</button>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-2xl animate-slide-up mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-poke-red mb-6 capitalize flex items-center gap-4 drop-shadow-sm border-b border-poke-gray/50 pb-4">
          {formatName(data.name)} Type <TypeBadge type={data.name} size="lg" />
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-xl font-bold text-poke-dark mb-4 border-b-2 border-poke-gray-light pb-1">Offense (Attacking)</h2>
          <div className="bg-white border border-poke-gray rounded p-4">
            {renderRelationList("Super-effective against", rel.double_damage_to, "2x")}
            {renderRelationList("Not very effective against", rel.half_damage_to, "½x")}
            {renderRelationList("No effect against", rel.no_damage_to, "0x")}
            {(!rel.double_damage_to.length && !rel.half_damage_to.length && !rel.no_damage_to.length) && (
              <p className="text-poke-gray-dark text-sm">Normal effectiveness against all types.</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-poke-dark mb-4 border-b-2 border-poke-gray-light pb-1">Defense (Defending)</h2>
          <div className="bg-white border border-poke-gray rounded p-4">
            {renderRelationList("Weak to", rel.double_damage_from, "2x")}
            {renderRelationList("Resists", rel.half_damage_from, "½x")}
            {renderRelationList("Immune to", rel.no_damage_from, "0x")}
             {(!rel.double_damage_from.length && !rel.half_damage_from.length && !rel.no_damage_from.length) && (
              <p className="text-poke-gray-dark text-sm">Normal damage from all types.</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-poke-dark mb-4 border-b-2 border-poke-gray-light pb-1">Pokémon with this type ({data.pokemon.length})</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {data.pokemon.map(p => {
            const pokeId = getIdFromUrl(p.pokemon.url);
            return (
              <Link 
                key={p.pokemon.name} 
                to={`/pokemon/${p.pokemon.name}`}
                className="flex flex-col items-center p-3 border border-poke-gray rounded hover:bg-poke-gray-light transition-colors group"
              >
                <img 
                  src={getSpriteUrl(pokeId)} 
                  alt={p.pokemon.name} 
                  className="w-16 h-16 group-hover:scale-110 transition-transform mb-2"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <span className="text-xs text-poke-gray-dark mb-1">#{String(pokeId).padStart(4, '0')}</span>
                <span className="text-sm font-bold text-poke-blue group-hover:text-poke-red capitalize text-center">
                  {formatName(p.pokemon.name)}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

    </main>
  );
}
