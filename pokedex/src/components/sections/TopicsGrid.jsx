import { Link } from 'react-router-dom';

const TOPICS = [
  {
    to: '/berries',
    emoji: '🫐',
    title: 'Berries',
    desc: 'Frutas usadas em batalhas, coordenação e culinária',
    color: 'hover:border-green-500/60 hover:bg-green-500/5',
    count: '64 Berries',
  },
  {
    to: '/contests',
    emoji: '🏆',
    title: 'Contests',
    desc: 'Concursos Pokémon, efeitos e super concursos',
    color: 'hover:border-pink-500/60 hover:bg-pink-500/5',
    count: '5 Contest Types',
  },
  {
    to: '/encounters',
    emoji: '🌿',
    title: 'Encounters',
    desc: 'Métodos e condições de encontro com Pokémon selvagens',
    color: 'hover:border-green-600/60 hover:bg-green-600/5',
    count: '7 Methods',
  },
  {
    to: '/evolution',
    emoji: '✨',
    title: 'Evolution',
    desc: 'Cadeias evolutivas e gatilhos de evolução',
    color: 'hover:border-purple-500/60 hover:bg-purple-500/5',
    count: '549 Chains',
  },
  {
    to: '/games',
    emoji: '🎮',
    title: 'Games',
    desc: 'Gerações, Pokédexes, versões e grupos de versões',
    color: 'hover:border-blue-500/60 hover:bg-blue-500/5',
    count: '9 Generations',
  },
  {
    to: '/items',
    emoji: '🎒',
    title: 'Items',
    desc: 'Catálogo completo de itens, categorias e bolsos',
    color: 'hover:border-orange-500/60 hover:bg-orange-500/5',
    count: '954 Items',
  },
  {
    to: '/locations',
    emoji: '🗺️',
    title: 'Locations',
    desc: 'Regiões, locais, áreas e Pal Park',
    color: 'hover:border-teal-500/60 hover:bg-teal-500/5',
    count: '8 Regions',
  },
  {
    to: '/machines',
    emoji: '💿',
    title: 'Machines',
    desc: 'TMs e HMs que ensinam movimentos aos Pokémon',
    color: 'hover:border-gray-400/60 hover:bg-gray-400/5',
    count: '1700+ MTs',
  },
  {
    to: '/moves',
    emoji: '⚡',
    title: 'Moves',
    desc: 'Golpes, categorias, alvos e métodos de aprendizado',
    color: 'hover:border-yellow-500/60 hover:bg-yellow-500/5',
    count: '918 Moves',
  },
  {
    to: '/pokemon',
    emoji: '⭐',
    title: 'Pokémon',
    desc: 'Pokémon, habilidades, tipos, naturezas e muito mais',
    color: 'hover:border-poke-red/60 hover:bg-poke-red/5',
    count: '898+ Pokémon',
  },
];

export default function TopicsGrid() {
  return (
    <section className="py-20 bg-poke-dark-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">Explorar por Tópico</h2>
          <p className="text-poke-gray-light text-sm max-w-xl mx-auto">
            Acesse cada categoria da PokéAPI com listagem paginada, detalhes completos e busca rápida.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {TOPICS.map(({ to, emoji, title, desc, color, count }) => (
            <Link
              key={to}
              to={to}
              className={`glass-card p-5 border border-poke-gray ${color} hover:-translate-y-1 transition-all duration-300 group block`}
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">
                {emoji}
              </div>
              <h3 className="text-white font-bold text-sm mb-1 group-hover:text-poke-yellow transition-colors duration-200">
                {title}
              </h3>
              <p className="text-poke-gray-light text-xs leading-relaxed mb-3">{desc}</p>
              <span className="text-xs bg-poke-dark px-2 py-1 rounded-full text-poke-gray-light border border-poke-gray">
                {count}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
