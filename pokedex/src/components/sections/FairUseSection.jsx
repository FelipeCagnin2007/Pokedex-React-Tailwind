const FAIR_USE_RULES = [
  {
    icon: '💾',
    title: 'Implemente Cache Local',
    desc: 'Armazene as respostas em localStorage ou sessionStorage. Este site usa cache de 1 hora para todas as chamadas.',
    highlight: true,
  },
  {
    icon: '⏱️',
    title: 'Limite suas Requisições',
    desc: 'Evite fazer muitas chamadas consecutivas. Use paginação e não busque todos os recursos de uma vez.',
    highlight: false,
  },
  {
    icon: '🚫',
    title: 'Não Faça Web Scraping',
    desc: 'A API fornece os dados no formato correto. Não raspe o site pokeapi.co diretamente.',
    highlight: false,
  },
  {
    icon: '🤝',
    title: 'Contribua com a Comunidade',
    desc: 'A PokéAPI é open source. Se encontrar bugs ou tiver dados para contribuir, abra um PR no GitHub.',
    highlight: false,
  },
];

export default function FairUseSection() {
  return (
    <section className="py-20 bg-poke-dark-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Text */}
          <div className="lg:w-1/3">
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-poke-yellow/30 rounded-full px-4 py-1.5 mb-4">
              <span className="text-poke-yellow text-xs font-bold uppercase tracking-wider">⚠️ Política de Uso</span>
            </div>
            <h2 className="section-title mb-4">Fair Use Policy</h2>
            <p className="text-poke-gray-light leading-relaxed text-sm">
              A PokéAPI é mantida pela comunidade de forma voluntária. Para garantir que o serviço
              permaneça disponível e gratuito para todos, siga estas diretrizes.
            </p>
            <div className="mt-6 p-4 bg-poke-red/10 border border-poke-red/30 rounded-xl">
              <p className="text-poke-red text-xs font-semibold mb-1">⚠️ Aviso de Banimento</p>
              <p className="text-gray-300 text-xs leading-relaxed">
                IPs que gerarem tráfego excessivo podem ser bloqueados temporariamente. 
                O cache local é <strong className="text-white">obrigatório</strong> para aplicações em produção.
              </p>
            </div>
          </div>

          {/* Rules Grid */}
          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FAIR_USE_RULES.map(({ icon, title, desc, highlight }) => (
              <div
                key={title}
                className={`p-5 rounded-2xl border transition-all duration-300 ${
                  highlight
                    ? 'bg-poke-yellow/5 border-poke-yellow/40 hover:border-poke-yellow/70'
                    : 'glass-card border-poke-gray hover:border-poke-gray-light'
                }`}
              >
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className={`font-bold text-sm mb-2 ${highlight ? 'text-poke-yellow' : 'text-white'}`}>
                  {title}
                </h3>
                <p className="text-poke-gray-light text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
