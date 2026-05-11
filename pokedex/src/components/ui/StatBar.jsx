const STAT_COLORS = {
  hp: 'bg-[#FF5959]',
  attack: 'bg-[#F5AC78]',
  defense: 'bg-[#FAE078]',
  'special-attack': 'bg-[#9DB7F5]',
  'special-defense': 'bg-[#A7DB8D]',
  speed: 'bg-[#FA92B2]',
};

const STAT_LABELS = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};

export default function StatBar({ name, value, max = 255 }) {
  const percentage = Math.min((value / max) * 100, 100);
  const color = STAT_COLORS[name] || 'bg-poke-blue';
  const label = STAT_LABELS[name] || name;

  return (
    <div className="flex items-center gap-3 py-1 border-b border-poke-gray/50 last:border-0">
      <span className="text-poke-dark-dark text-sm w-20 flex-shrink-0">
        {label}
      </span>
      <span className="text-poke-dark text-sm font-bold w-8 text-right flex-shrink-0">{value}</span>
      <div className="flex-1 bg-poke-gray-light rounded-sm h-3 overflow-hidden">
        <div
          className={`${color} h-full rounded-sm border border-black/10`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
