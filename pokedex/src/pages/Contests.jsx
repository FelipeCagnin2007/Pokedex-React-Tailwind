import TopicPage from '../components/TopicPage';
import {
  fetchContestTypes, fetchContestEffects, fetchSuperContestEffects,
  fetchContestType, fetchContestEffect, fetchSuperContestEffect,
  formatName, getEnglishText,
} from '../api/pokeapi';

function ContestTypeDetail({ data }) {
  return (
    <div className="animate-fade-in">
      <h2 className="text-white font-bold text-lg mb-4 capitalize">{formatName(data.name)}</h2>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between border-b border-poke-gray pb-1.5">
          <span className="text-poke-gray-light">Berry Flavor</span>
          <span className="text-white capitalize">{data.berry_flavor?.name || '—'}</span>
        </div>
        <div className="pt-2">
          <p className="text-poke-gray-light mb-2">Names by language:</p>
          {data.names?.filter(n => ['en', 'ja'].includes(n.language.name)).map(n => (
            <div key={n.language.name} className="flex justify-between text-xs pb-1">
              <span className="text-poke-gray-light uppercase">{n.language.name}</span>
              <span className="text-white">{n.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContestEffectDetail({ data }) {
  return (
    <div className="animate-fade-in">
      <h2 className="text-white font-bold text-lg mb-4">Effect #{data.id}</h2>
      <div className="space-y-3">
        <div className="flex justify-between text-xs border-b border-poke-gray pb-1.5">
          <span className="text-poke-gray-light">Appeal</span>
          <span className="text-poke-yellow font-bold">{data.appeal}</span>
        </div>
        <div className="flex justify-between text-xs border-b border-poke-gray pb-1.5">
          <span className="text-poke-gray-light">Jam</span>
          <span className="text-poke-red font-bold">{data.jam}</span>
        </div>
        <div>
          <p className="text-poke-gray-light text-xs mb-1">Flavor Text:</p>
          <p className="text-white text-xs leading-relaxed">
            {getEnglishText(data.flavor_text_entries) || '—'}
          </p>
        </div>
        <div>
          <p className="text-poke-gray-light text-xs mb-1">Effect:</p>
          <p className="text-white text-xs leading-relaxed">
            {getEnglishText(data.effect_entries, 'effect') || '—'}
          </p>
        </div>
      </div>
    </div>
  );
}

const TABS = [
  {
    id: 'types',
    label: 'Contest Types',
    fetchFn: fetchContestTypes,
    detailFn: fetchContestType,
    accentColor: 'red',
    renderDetail: (d) => <ContestTypeDetail data={d} />,
  },
  {
    id: 'effects',
    label: 'Contest Effects',
    fetchFn: fetchContestEffects,
    detailFn: fetchContestEffect,
    accentColor: 'yellow',
    renderDetail: (d) => <ContestEffectDetail data={d} />,
  },
  {
    id: 'super',
    label: 'Super Contest Effects',
    fetchFn: fetchSuperContestEffects,
    detailFn: fetchSuperContestEffect,
    accentColor: 'blue',
  },
];

export default function Contests() {
  return (
    <TopicPage
      title="Contests"
      description="Os Pokémon Contests são competições em que os Pokémon exibem seus atributos. Explore os tipos de concurso, efeitos e super concursos."
      tabs={TABS}
    />
  );
}
