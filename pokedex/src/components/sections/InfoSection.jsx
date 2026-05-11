const INFO_CARDS = [
  {
    icon: '🔓',
    title: 'API Aberta e Gratuita',
    desc: 'A PokéAPI é 100% pública. Não requer autenticação, API keys ou cadastro. Basta fazer requisições HTTP GET.',
    color: 'border-green-500/30 hover:border-green-400/60',
    glow: 'bg-green-500/5',
  },
  {
    icon: '⚡',
    title: 'Apenas HTTP GET',
    desc: 'API somente de leitura (consumo). Não é possível criar, editar ou deletar dados. Perfeita para projetos front-end.',
    color: 'border-poke-yellow/30 hover:border-poke-yellow/60',
    glow: 'bg-poke-yellow/5',
  },
  {
    icon: '🌐',
    title: 'REST + JSON',
    desc: 'Respostas em JSON puro. Suporte completo a CORS, podendo ser consumida diretamente do browser sem proxy.',
    color: 'border-poke-blue/30 hover:border-poke-blue-light/60',
    glow: 'bg-poke-blue/5',
  },
  {
    icon: '📦',
    title: 'Mais de 50 Endpoints',
    desc: 'Cobre Pokémon, Moves, Items, Locations, Berries, Evolution, Contests, Games, Machines e muito mais.',
    color: 'border-purple-500/30 hover:border-purple-400/60',
    glow: 'bg-purple-500/5',
  },
];

export default function InfoSection() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="section-title mb-4">O que é a PokéAPI?</h2>
        <p className="text-poke-gray-light max-w-2xl mx-auto text-base leading-relaxed">
          Uma RESTful API repleta de dados do universo Pokémon, mantida pela comunidade e usada por
          desenvolvedores do mundo todo para criar apps, bots e sites incríveis.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {INFO_CARDS.map(({ icon, title, desc, color, glow }) => (
          <div
            key={title}
            className={`glass-card p-6 border ${color} ${glow} hover:-translate-y-1 transition-all duration-300`}
          >
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-white font-bold text-base mb-2">{title}</h3>
            <p className="text-poke-gray-light text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Base URL highlight */}
      <div className="mt-10 p-6 glass-card border border-poke-red/30 text-center">
        <p className="text-poke-gray-light text-sm mb-2">URL Base da API</p>
        <code className="text-poke-yellow font-pixel text-xs sm:text-sm bg-poke-dark px-4 py-2 rounded-lg border border-poke-gray inline-block">
          https://pokeapi.co/api/v2/
        </code>
        <p className="text-poke-gray-light text-xs mt-3">
          Exemplo: <code className="text-green-400">/pokemon/pikachu</code> retorna todos os dados do Pikachu
        </p>
      </div>
    </section>
  );
}
