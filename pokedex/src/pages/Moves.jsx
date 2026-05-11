import TopicPage from '../components/TopicPage';
import {
  fetchMoves, fetchMoveAilments, fetchMoveCategories,
  fetchMoveDamageClasses, fetchMoveLearnMethods, fetchMoveTargets,
  fetchMove, fetchMoveAilment,
  formatName, getEnglishText,
} from '../api/pokeapi';

function MoveDetail({ data }) {
  const effect = data.effect_entries?.find(e => e.language.name === 'en')?.short_effect || '';
  return (
    <div className="animate-fade-in">
      <h2 className="text-white font-bold text-lg mb-4 capitalize">{formatName(data.name)}</h2>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          ['Type', data.type?.name],
          ['Damage Class', data.damage_class?.name],
          ['Power', data.power || '—'],
          ['Accuracy', data.accuracy ? `${data.accuracy}%` : '—'],
          ['PP', data.pp],
          ['Priority', data.priority],
          ['Target', data.target?.name],
          ['Generation', data.generation?.name],
        ].map(([label, val]) => (
          <div key={label} className="bg-poke-dark rounded-lg p-2">
            <p className="text-poke-gray-light text-xs mb-0.5">{label}</p>
            <p className="text-white text-xs font-bold capitalize">{val || '—'}</p>
          </div>
        ))}
      </div>
      {effect && (
        <div className="p-3 bg-poke-dark rounded-lg">
          <p className="text-poke-gray-light text-xs mb-1">Efeito:</p>
          <p className="text-white text-xs leading-relaxed">{effect}</p>
        </div>
      )}
    </div>
  );
}

const TABS = [
  { id: 'moves', label: 'Moves', icon: '⚡', fetchFn: fetchMoves, detailFn: fetchMove, accentColor: 'red', renderDetail: (d) => <MoveDetail data={d} />, routePrefix: '/move' },
];

export default function Moves() {
  return (
    <TopicPage
      title="Moves"
      emoji="⚡"
      description="Explore mais de 918 movimentos do universo Pokémon. Veja poder, precisão, PP, tipo, categoria de dano e muito mais para cada golpe."
      tabs={TABS}
    />
  );
}
