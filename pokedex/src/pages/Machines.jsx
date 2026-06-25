import TopicPage from '../components/TopicPage';
import { fetchMachines, fetchMachine, formatName } from '../api/pokeapi';
import { Disc } from 'lucide-react';

function MachineDetail({ data }) {
  return (
    <div className="animate-fade-in">
      <h2 className="text-white font-bold text-lg mb-4">Machine #{data.id}</h2>
      <div className="space-y-2 text-xs">
        {[
          ['Move', data.move?.name],
          ['Version Group', data.version_group?.name],
          ['Item', data.item?.name],
        ].map(([label, val]) => (
          <div key={label} className="flex justify-between border-b border-poke-gray pb-1.5">
            <span className="text-poke-gray-light">{label}</span>
            <span className="text-white capitalize">{val || '—'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const TABS = [
  {
    id: 'machines',
    label: 'Machines (TMs/HMs)',
    icon: <Disc size={24} />,
    fetchFn: fetchMachines,
    detailFn: fetchMachine,
    accentColor: 'red',
    renderDetail: (d) => <MachineDetail data={d} />,
  },
];

export default function Machines() {
  return (
    <TopicPage
      title="Machines"
      description="Machines (TMs e HMs) são itens que ensinam movimentos específicos aos Pokémon. Explore quais movimentos cada MT/MO ensina em cada geração."
      tabs={TABS}
    />
  );
}
