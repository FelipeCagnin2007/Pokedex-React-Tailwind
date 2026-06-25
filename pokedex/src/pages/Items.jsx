import TopicPage from '../components/TopicPage';
import {
  fetchItems, fetchItem,
  fetchBerries, fetchBerry,
  formatName
} from '../api/pokeapi';
import { Cherry } from 'lucide-react';


function BerryDetail({ data }) {
  return (
    <div className="bg-white border border-poke-gray p-6 rounded-lg animate-fade-in shadow-sm">
      <div className="flex items-center gap-4 mb-6 border-b border-poke-gray pb-4">
        <div className="bg-poke-gray-light p-3 rounded-full border border-poke-gray text-blue-500">
          <Cherry size={32} />
        </div>
        <div>
          <h2 className="text-poke-dark font-bold text-2xl capitalize">{formatName(data.name)} Berry</h2>
          <span className="text-poke-gray-dark text-sm font-mono tracking-wider">BERRY #{data.id}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
        <div>
          <h3 className="font-bold text-poke-dark mb-3 border-b border-poke-gray-light pb-1">Growth Data</h3>
          <table className="w-full text-left border-collapse">
            <tbody>
              {[
                ['Firmness', data.firmness?.name],
                ['Growth Time', `${data.growth_time} hours`],
                ['Max Harvest', data.max_harvest],
                ['Size', `${data.size} mm`],
                ['Smoothness', data.smoothness],
                ['Soil Dryness', data.soil_dryness],
              ].map(([label, val]) => (
                <tr key={label} className="border-b border-poke-gray-light hover:bg-poke-gray-light/50">
                  <th className="py-2 pr-4 text-poke-gray-dark font-normal">{label}</th>
                  <td className="py-2 capitalize font-medium text-poke-dark">{val || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h3 className="font-bold text-poke-dark mb-3 border-b border-poke-gray-light pb-1">Usage & Flavor</h3>
          <table className="w-full text-left border-collapse mb-4">
            <tbody>
              <tr className="border-b border-poke-gray-light hover:bg-poke-gray-light/50">
                <th className="py-2 pr-4 text-poke-gray-dark font-normal">Natural Gift Power</th>
                <td className="py-2 font-mono text-poke-dark">{data.natural_gift_power || '—'}</td>
              </tr>
              <tr className="border-b border-poke-gray-light hover:bg-poke-gray-light/50">
                <th className="py-2 pr-4 text-poke-gray-dark font-normal">Natural Gift Type</th>
                <td className="py-2 capitalize font-medium text-poke-dark">{data.natural_gift_type?.name || '—'}</td>
              </tr>
            </tbody>
          </table>

          {data.flavors?.length > 0 && (
            <div>
              <p className="text-poke-gray-dark mb-2 text-xs uppercase tracking-wider font-bold">Flavors Potency</p>
              <div className="flex flex-wrap gap-2">
                {data.flavors.map(({ flavor, potency }) => (
                  <span key={flavor.name} className="bg-poke-gray-light border border-poke-gray text-poke-dark-2 text-xs px-2 py-1 rounded capitalize">
                    {flavor.name}: <span className="font-bold text-poke-dark">{potency}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


const TABS = [
  {
    id: 'items',
    label: 'Items',
    fetchFn: fetchItems,
    detailFn: fetchItem,
    routePrefix: '/item',
  },
  {
    id: 'berries',
    label: 'Berries',
    fetchFn: fetchBerries,
    detailFn: fetchBerry,
    renderDetail: (d) => <BerryDetail data={d} />,
  },
];

export default function Items() {
  return (
    <TopicPage
      title="Items & Berries"
      description="Explore the complete catalog of Pokémon items — from Poké Balls and evolutionary stones to Berries and machines."
      tabs={TABS}
    />
  );
}
