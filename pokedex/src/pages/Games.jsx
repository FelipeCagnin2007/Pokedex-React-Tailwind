import TopicPage from '../components/TopicPage';
import {
  fetchGenerations, fetchPokedexes, fetchVersions, fetchVersionGroups,
  fetchGeneration, fetchPokedex, fetchVersion,
  formatName,
} from '../api/pokeapi';

function GenerationDetail({ data }) {
  return (
    <div className="bg-white border border-poke-gray p-6 rounded-lg animate-fade-in shadow-sm">
      <h2 className="text-poke-dark font-bold text-2xl mb-6 capitalize border-b border-poke-gray pb-2">
        {formatName(data.name)}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
        <div>
          <table className="w-full text-left border-collapse mb-6">
            <tbody>
              <tr className="border-b border-poke-gray-light hover:bg-poke-gray-light/50">
                <th className="py-2 pr-4 text-poke-gray-dark font-normal">Main Region</th>
                <td className="py-2 capitalize font-medium text-poke-dark">{data.main_region?.name || '—'}</td>
              </tr>
            </tbody>
          </table>

          {data.versions?.length > 0 && (
            <div>
              <p className="text-poke-gray-dark mb-2 text-xs uppercase tracking-wider font-bold">Game Versions:</p>
              <div className="flex flex-wrap gap-2">
                {data.versions.map(v => (
                  <span key={v.name} className="bg-poke-gray-light border border-poke-gray text-poke-dark text-xs px-2 py-1 rounded capitalize">
                    {v.name.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <p className="text-poke-gray-dark mb-2 text-xs uppercase tracking-wider font-bold">New Pokémon Species ({data.pokemon_species?.length || 0}):</p>
          <div className="bg-poke-gray-light border border-poke-gray rounded p-3 max-h-60 overflow-auto flex flex-wrap gap-1">
            {data.pokemon_species?.map(p => (
              <span key={p.name} className="bg-white border border-poke-gray text-poke-dark text-xs px-2 py-0.5 rounded capitalize">
                {p.name.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PokedexDetail({ data }) {
  const englishDescription = data.descriptions?.find(d => d.language.name === 'en')?.description;
  
  return (
    <div className="bg-white border border-poke-gray p-6 rounded-lg animate-fade-in shadow-sm">
      <h2 className="text-poke-dark font-bold text-2xl mb-4 capitalize border-b border-poke-gray pb-2">
        {formatName(data.name)} Pokédex
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
        <div>
          {englishDescription && (
            <div className="bg-poke-gray-light p-3 rounded border border-poke-gray mb-6">
              <p className="text-poke-dark-2 italic">"{englishDescription}"</p>
            </div>
          )}
          
          <table className="w-full text-left border-collapse mb-6">
            <tbody>
              <tr className="border-b border-poke-gray-light hover:bg-poke-gray-light/50">
                <th className="py-2 pr-4 text-poke-gray-dark font-normal">Region</th>
                <td className="py-2 capitalize font-medium text-poke-dark">{data.region?.name || '—'}</td>
              </tr>
              <tr className="border-b border-poke-gray-light hover:bg-poke-gray-light/50">
                <th className="py-2 pr-4 text-poke-gray-dark font-normal">Main Series</th>
                <td className="py-2 font-medium text-poke-dark">{data.is_main_series ? 'Yes' : 'No'}</td>
              </tr>
            </tbody>
          </table>

          <div>
            <p className="text-poke-gray-dark mb-2 text-xs uppercase tracking-wider font-bold">Version Groups:</p>
            <div className="flex flex-wrap gap-2">
              {data.version_groups?.map(v => (
                <span key={v.name} className="bg-poke-gray-light border border-poke-gray text-poke-dark text-xs px-2 py-1 rounded capitalize">
                  {v.name.replace(/-/g, ' ')}
                </span>
              ))}
              {(!data.version_groups || data.version_groups.length === 0) && (
                <span className="text-poke-gray-dark italic text-xs">—</span>
              )}
            </div>
          </div>
        </div>

        <div>
          <p className="text-poke-gray-dark mb-2 text-xs uppercase tracking-wider font-bold">Pokémon Entries ({data.pokemon_entries?.length || 0}):</p>
          <div className="border border-poke-gray rounded bg-white max-h-80 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-poke-gray-light border-b border-poke-gray sticky top-0">
                <tr>
                  <th className="py-2 px-3 text-poke-gray-dark font-bold text-xs">#</th>
                  <th className="py-2 px-3 text-poke-gray-dark font-bold text-xs">Pokémon</th>
                </tr>
              </thead>
              <tbody>
                {data.pokemon_entries?.map(entry => (
                  <tr key={entry.entry_number} className="border-b border-poke-gray-light hover:bg-poke-gray-light/50 last:border-0">
                    <td className="py-2 px-3 font-mono text-poke-gray-dark text-xs">#{String(entry.entry_number).padStart(3, '0')}</td>
                    <td className="py-2 px-3 font-bold text-poke-dark capitalize">{entry.pokemon_species.name.replace(/-/g, ' ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const TABS = [
  {
    id: 'generations',
    label: 'Generations',
    icon: '🕹️',
    fetchFn: fetchGenerations,
    detailFn: fetchGeneration,
    renderDetail: (d) => <GenerationDetail data={d} />,
  },
  {
    id: 'pokedexes',
    label: 'Pokédexes',
    icon: '📖',
    fetchFn: fetchPokedexes,
    detailFn: fetchPokedex,
    renderDetail: (d) => <PokedexDetail data={d} />,
  },
];

export default function Games() {
  return (
    <TopicPage
      title="Games"
      emoji="🎮"
      description="Explore the generations of Pokémon games, regional Pokédexes, individual versions, and version groups."
      tabs={TABS}
    />
  );
}
