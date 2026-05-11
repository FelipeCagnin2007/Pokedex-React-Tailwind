const INFO_CARDS = [
  {
    icon: '💻',
    title: 'Ciência da Computação',
    desc: 'Projeto acadêmico desenvolvido pelos alunos Felipe e Paulo, do curso de Ciência da Computação da Universidade Paulista (UNIP) - Campus Jundiaí.',
    color: 'border-poke-red/30 hover:border-poke-red/60',
    glow: 'bg-poke-red/5',
  },
  {
    icon: '⚡',
    title: 'React & TailwindCSS',
    desc: 'Construído com tecnologias modernas de frontend. Interface responsiva com design em Glassmorphism baseado na identidade visual da Pokébola.',
    color: 'border-poke-yellow/30 hover:border-poke-yellow/60',
    glow: 'bg-poke-yellow/5',
  },
  {
    icon: '🔍',
    title: 'Busca Global',
    desc: 'Sistema inteligente de pesquisa em memória que permite buscar instantaneamente entre milhares de Pokémon, Itens, Golpes e Regiões.',
    color: 'border-poke-blue/30 hover:border-poke-blue/60',
    glow: 'bg-poke-blue/5',
  },
  {
    icon: '📚',
    title: 'Enciclopédia Completa',
    desc: 'Páginas dinâmicas interligadas (Deep Linking) permitindo navegação fluida entre atributos de Pokémon e detalhes de Itens.',
    color: 'border-gray-500/30 hover:border-gray-400/60',
    glow: 'bg-gray-500/5',
  },
];

export default function InfoSection() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="text-center mb-12 animate-slide-up">
        <h2 className="text-3xl sm:text-4xl font-bold text-poke-red mb-4 drop-shadow-sm">Sobre a Pokédex</h2>
        <p className="text-poke-dark-2 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed glass-panel p-4 rounded-xl border-poke-red/20 inline-block">
          Uma enciclopédia interativa desenvolvida com foco em alta performance e usabilidade, centralizando todos os dados essenciais para treinadores Pokémon em um só lugar.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {INFO_CARDS.map(({ icon, title, desc, color, glow }) => (
          <div
            key={title}
            className={`glass-panel p-6 border-b-4 ${color} ${glow} hover:-translate-y-2 transition-all duration-300 rounded-2xl flex flex-col items-center text-center`}
          >
            <div className="text-5xl mb-4 drop-shadow-md">{icon}</div>
            <h3 className="text-poke-dark font-bold text-lg mb-3">{title}</h3>
            <p className="text-poke-dark-2 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
