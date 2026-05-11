import { Link } from 'react-router-dom';

const TOPICS = [
  {
    to: '/pokemon',
    emoji: '⭐',
    title: 'Pokémon',
    desc: 'Pokémon, habilidades, tipos, naturezas e muito mais',
    color: 'hover:border-poke-red hover:bg-poke-red/10',
    count: '898+ Pokémon',
  },
  {
    to: '/items',
    emoji: '🎒',
    title: 'Items & Berries',
    desc: 'Catálogo completo de itens, frutas e equipamentos',
    color: 'hover:border-poke-blue hover:bg-poke-blue/10',
    count: '954 Items',
  },
  {
    to: '/moves',
    emoji: '⚡',
    title: 'Moves',
    desc: 'Golpes, categorias e alvos',
    color: 'hover:border-poke-yellow hover:bg-poke-yellow/10',
    count: '918 Moves',
  },
  {
    to: '/locations',
    emoji: '🗺️',
    title: 'Locations',
    desc: 'Regiões, locais e áreas geográficas',
    color: 'hover:border-green-500 hover:bg-green-500/10',
    count: '8 Regions',
  },
  {
    to: '/games',
    emoji: '🎮',
    title: 'Games',
    desc: 'Gerações, Pokédexes regionais e versões',
    color: 'hover:border-purple-500 hover:bg-purple-500/10',
    count: '9 Generations',
  },
  {
    to: '/machines',
    emoji: '💿',
    title: 'Machines',
    desc: 'TMs e HMs que ensinam movimentos aos Pokémon',
    color: 'hover:border-gray-400 hover:bg-gray-400/10',
    count: '1700+ MTs',
  },
  {
    to: '/contests',
    emoji: '🏆',
    title: 'Contests',
    desc: 'Concursos Pokémon e efeitos',
    color: 'hover:border-pink-500 hover:bg-pink-500/10',
    count: '5 Contest Types',
  },
  {
    to: '/encounters',
    emoji: '🌿',
    title: 'Encounters',
    desc: 'Métodos de encontro com Pokémon selvagens',
    color: 'hover:border-green-600 hover:bg-green-600/10',
    count: '7 Methods',
  },
];

export default function TopicsGrid() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-poke-red mb-4 drop-shadow-sm">Navegar por Tópico</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {TOPICS.map(({ to, emoji, title, desc, color, count }) => (
          <Link
            key={to}
            to={to}
            className={`glass-panel p-6 border-b-4 border-t-0 border-l-0 border-r-0 ${color} hover:-translate-y-2 transition-all duration-300 group block rounded-2xl`}
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-200 drop-shadow-md">
              {emoji}
            </div>
            <h3 className="text-poke-dark font-bold text-lg mb-2 group-hover:text-poke-red transition-colors duration-200">
              {title}
            </h3>
            <p className="text-poke-dark-2 text-sm leading-relaxed mb-4">{desc}</p>
            <span className="text-xs font-mono bg-white px-3 py-1 rounded-full text-poke-gray-dark border border-poke-gray shadow-sm">
              {count}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
