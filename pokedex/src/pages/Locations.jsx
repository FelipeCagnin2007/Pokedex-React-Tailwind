import TopicPage from '../components/TopicPage';
import { Map } from 'lucide-react';
import {
  fetchLocations, fetchLocationAreas, fetchPalParkAreas, fetchRegions,
  fetchLocation, fetchRegion,
  formatName,
} from '../api/pokeapi';

function RegionDetail({ data }) {
  return (
    <div className="bg-white border border-poke-gray p-6 rounded-lg animate-fade-in shadow-sm">
      <h2 className="text-poke-dark font-bold text-2xl mb-6 capitalize border-b border-poke-gray pb-2">
        {formatName(data.name)} Region
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
        <div>
          <table className="w-full text-left border-collapse mb-6">
            <tbody>
              <tr className="border-b border-poke-gray-light hover:bg-poke-gray-light/50">
                <th className="py-2 pr-4 text-poke-gray-dark font-normal">Main Generation</th>
                <td className="py-2 capitalize font-medium text-poke-dark">{data.main_generation?.name.replace(/-/g, ' ') || '—'}</td>
              </tr>
            </tbody>
          </table>

          {data.pokedexes?.length > 0 && (
            <div>
              <p className="text-poke-gray-dark mb-2 text-xs uppercase tracking-wider font-bold">Regional Pokédexes:</p>
              <div className="flex flex-wrap gap-2">
                {data.pokedexes.map(p => (
                  <span key={p.name} className="bg-poke-gray-light border border-poke-gray text-poke-dark text-xs px-2 py-1 rounded capitalize">
                    {p.name.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <p className="text-poke-gray-dark mb-2 text-xs uppercase tracking-wider font-bold">Locations ({data.locations?.length || 0}):</p>
          <div className="bg-poke-gray-light border border-poke-gray rounded p-3 max-h-60 overflow-auto flex flex-wrap gap-2">
            {data.locations?.map(l => (
              <span key={l.name} className="bg-white border border-poke-gray text-poke-dark text-xs px-2 py-0.5 rounded capitalize">
                {l.name.replace(/-/g, ' ')}
              </span>
            ))}
            {(!data.locations || data.locations.length === 0) && (
              <span className="text-poke-gray-dark italic">No locations data available.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'regions', label: 'Regions', icon: <Map size={24} />, fetchFn: fetchRegions, detailFn: fetchRegion, routePrefix: '/region' },
];

export default function Locations() {
  return (
    <TopicPage
      title="Locations"
      description="Explore the regions of the Pokémon world — Kanto, Johto, Hoenn, Sinnoh, Unova, Kalos, Alola, and Galar — and their respective locations."
      tabs={TABS}
    />
  );
}
