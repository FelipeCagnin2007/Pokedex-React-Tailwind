import { Link } from 'react-router-dom';
import { Star, Swords, Backpack, Zap, Map, Gamepad2, Disc, Trophy } from 'lucide-react';

const TOPICS = [
  {
    to: '/pokemon',
    icon: <Star size={36} className="text-red-500" />,
    title: 'Pokémon',
    desc: 'Pokémon, habilidades, tipos, naturezas e muito mais',
    colorClass: 'hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-950/30',
    badge: '1008+ Pokémon',
    badgeColor: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400',
  },
  {
    to: '/battle',
    icon: <Swords size={36} className="text-orange-500" />,
    title: 'Batalhas',
    desc: 'PvP online com amigos ou desafie a IA. Forme sua equipe de 6 Pokémon',
    colorClass: 'hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30',
    badge: 'PvP + CPU',
    badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400',
    highlight: true,
  },
  {
    to: '/items',
    icon: <Backpack size={36} className="text-blue-500" />,
    title: 'Itens & Berries',
    desc: 'Catálogo completo de itens, frutas e equipamentos',
    colorClass: 'hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30',
    badge: '954 itens',
    badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400',
  },
  {
    to: '/moves',
    icon: <Zap size={36} className="text-yellow-500" />,
    title: 'Moves',
    desc: 'Golpes, categorias, poder e precisão',
    colorClass: 'hover:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950/30',
    badge: '918 moves',
    badgeColor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-400',
  },
  {
    to: '/locations',
    icon: <Map size={36} className="text-emerald-500" />,
    title: 'Regiões',
    desc: 'Regiões, locais e áreas geográficas do mundo Pokémon',
    colorClass: 'hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30',
    badge: '8 regiões',
    badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400',
  },
  {
    to: '/games',
    icon: <Gamepad2 size={36} className="text-purple-500" />,
    title: 'Games',
    desc: 'Gerações, Pokédexes regionais e versões dos jogos',
    colorClass: 'hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30',
    badge: '9 gerações',
    badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400',
  },
  {
    to: '/machines',
    icon: <Disc size={36} className="text-slate-500" />,
    title: 'Machines',
    desc: 'TMs e HMs que ensinam movimentos especiais',
    colorClass: 'hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50',
    badge: '1700+ MTs',
    badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  },
  {
    to: '/contests',
    icon: <Trophy size={36} className="text-pink-500" />,
    title: 'Contests',
    desc: 'Concursos Pokémon com efeitos especiais',
    colorClass: 'hover:border-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/30',
    badge: '5 Contest Types',
    badgeColor: 'bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-400',
  },
];

export default function TopicsGrid() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="section-title mb-3">Navegar por Tópico</h2>
        <p className="section-subtitle">Acesso rápido a todas as seções da Pokédex</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {TOPICS.map(({ to, icon, title, desc, colorClass, badge, badgeColor, highlight }) => (
          <Link
            key={to}
            to={to}
            className={`card card-hover p-5 border flex flex-col gap-3 group
              ${highlight
                ? 'border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 dark:border-orange-900/50'
                : `border-slate-200 dark:border-slate-700 ${colorClass}`
              }
              transition-all duration-300`}
          >
            <div className="flex items-start justify-between">
              <span className="group-hover:scale-110 transition-transform duration-200 block">
                {icon}
              </span>
              {highlight && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-500 text-white px-2 py-0.5 rounded-full">
                  Novo
                </span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                {title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                {desc}
              </p>
            </div>
            <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColor}`}>
              {badge}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
