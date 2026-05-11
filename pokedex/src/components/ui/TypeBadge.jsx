const TYPE_COLORS = {
  normal: 'bg-type-normal text-white',
  fire: 'bg-type-fire text-white',
  water: 'bg-type-water text-white',
  electric: 'bg-type-electric text-poke-dark', // Dark text for yellow
  grass: 'bg-type-grass text-poke-dark',
  ice: 'bg-type-ice text-poke-dark',
  fighting: 'bg-type-fighting text-white',
  poison: 'bg-type-poison text-white',
  ground: 'bg-type-ground text-poke-dark',
  flying: 'bg-type-flying text-white',
  psychic: 'bg-type-psychic text-white',
  bug: 'bg-type-bug text-white',
  rock: 'bg-type-rock text-white',
  ghost: 'bg-type-ghost text-white',
  dragon: 'bg-type-dragon text-white',
  dark: 'bg-type-dark text-white',
  steel: 'bg-type-steel text-poke-dark',
  fairy: 'bg-type-fairy text-poke-dark',
};

export default function TypeBadge({ type, size = 'sm' }) {
  const color = TYPE_COLORS[type?.toLowerCase()] || 'bg-poke-gray text-poke-dark';
  const sizeClass = size === 'lg'
    ? 'px-3 py-1 text-sm'
    : 'px-2 py-0.5 text-xs';

  return (
    <span
      className={`${color} ${sizeClass} rounded-md font-bold uppercase tracking-wide border border-black/10 inline-block text-center min-w-[60px]`}
      style={{ textShadow: color.includes('text-white') ? '0 1px 1px rgba(0,0,0,0.3)' : 'none' }}
    >
      {type}
    </span>
  );
}
