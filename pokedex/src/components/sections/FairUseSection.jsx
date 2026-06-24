const FAIR_USE_RULES = [
  {
    icon: '💾',
    title: 'Use Cache Local',
    desc: 'Este site armazena respostas em localStorage por 1 hora. Isso reduz chamadas repetidas e melhora a performance.',
    highlight: true,
  },
  {
    icon: '⏱️',
    title: 'Limite Requisições',
    desc: 'Evite muitas chamadas consecutivas. Use paginação e não busque todos os recursos de uma só vez.',
    highlight: false,
  },
  {
    icon: '🚫',
    title: 'Não Faça Scraping',
    desc: 'A PokéAPI fornece os dados no formato correto. Não raspe o site pokeapi.co diretamente.',
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
    <section className="py-20 bg-slate-900 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-start">

          {/* Text */}
          <div className="lg:w-1/3">
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-1.5 mb-5">
              <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider">⚠️ Política de Uso</span>
            </div>
            <h2 className="font-bold text-white text-2xl sm:text-3xl mb-4 tracking-tight">
              Fair Use Policy
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm mb-6">
              A PokéAPI é mantida pela comunidade de forma voluntária. Para garantir que o serviço
              permaneça disponível e gratuito para todos, siga estas diretrizes ao usar a API em seus projetos.
            </p>
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400 text-xs font-semibold mb-1">⚠️ Aviso</p>
              <p className="text-slate-300 text-xs leading-relaxed">
                IPs com tráfego excessivo podem ser bloqueados temporariamente.
                Cache local é <strong className="text-white">obrigatório</strong> em produção.
              </p>
            </div>
          </div>

          {/* Rules Grid */}
          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FAIR_USE_RULES.map(({ icon, title, desc, highlight }) => (
              <div
                key={title}
                className={`p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 ${
                  highlight
                    ? 'bg-yellow-500/5 border-yellow-500/30 hover:border-yellow-400/60'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className={`font-bold text-sm mb-2 ${highlight ? 'text-yellow-400' : 'text-white'}`}>
                  {title}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
