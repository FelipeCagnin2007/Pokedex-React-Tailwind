import { 
  Flame, Droplets, Leaf, Zap, Snowflake, Swords, Skull, Mountain, 
  Wind, Eye, Bug, Hexagon, Ghost, ShieldAlert, Moon, Cog, Sparkles, Circle
} from 'lucide-react';

const TYPE_STYLES = {
  normal:   'bg-slate-400 text-white',
  fire:     'bg-orange-500 text-white',
  water:    'bg-blue-500 text-white',
  electric: 'bg-yellow-400 text-yellow-900',
  grass:    'bg-green-500 text-white',
  ice:      'bg-cyan-400 text-cyan-900',
  fighting: 'bg-red-600 text-white',
  poison:   'bg-purple-500 text-white',
  ground:   'bg-amber-500 text-white',
  flying:   'bg-indigo-400 text-white',
  psychic:  'bg-pink-500 text-white',
  bug:      'bg-lime-500 text-white',
  rock:     'bg-stone-500 text-white',
  ghost:    'bg-violet-700 text-white',
  dragon:   'bg-violet-600 text-white',
  dark:     'bg-stone-700 text-white',
  steel:    'bg-slate-400 text-white',
  fairy:    'bg-pink-400 text-white',
};

const TYPE_ICONS = {
  fire:     Flame,
  water:    Droplets,
  grass:    Leaf,
  electric: Zap,
  ice:      Snowflake,
  fighting: Swords,
  poison:   Skull,
  ground:   Mountain,
  flying:   Wind,
  psychic:  Eye,
  bug:      Bug,
  rock:     Hexagon,
  ghost:    Ghost,
  dragon:   ShieldAlert,
  dark:     Moon,
  steel:    Cog,
  fairy:    Sparkles,
  normal:   Circle,
};

export default function TypeBadge({ type, showEmoji = false, size = 'sm', small = false }) {
  const style = TYPE_STYLES[type] || 'bg-slate-400 text-white';
  const Icon = TYPE_ICONS[type] || Circle;

  const sizeClass = small
    ? 'px-1.5 py-0.5 text-[9px] gap-0.5'
    : size === 'lg'
    ? 'px-3.5 py-1 text-sm gap-1.5'
    : 'px-2.5 py-0.5 text-xs gap-1';

  return (
    <span
      className={`type-badge ${style} ${sizeClass} capitalize shadow-sm`}
      title={type}
    >
      {showEmoji && <Icon size={small ? 10 : size === 'lg' ? 16 : 12} className="inline mr-1" />}
      {type}
    </span>
  );
}
