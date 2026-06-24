const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: 'Enciclopédia Completa',
    desc: 'Mais de 1008 Pokémon com stats, habilidades, movimentos e cadeias evolutivas. Dados 100% atualizados via PokéAPI v2.',
    color: 'from-red-500 to-rose-600',
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-100 dark:border-red-900/50',
    textColor: 'text-red-600 dark:text-red-400',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
    title: 'Batalhas PvP Online',
    desc: 'Desafie amigos em tempo real via conexão P2P. Compartilhe um código de sala e batalhe com sua equipe de 6 Pokémon.',
    color: 'from-orange-500 to-amber-500',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    border: 'border-orange-100 dark:border-orange-900/50',
    textColor: 'text-orange-600 dark:text-orange-400',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
      </svg>
    ),
    title: 'VS Computador',
    desc: 'Treine suas habilidades contra a IA em três níveis de dificuldade. Aprenda cálculos de dano e efetividade de tipo.',
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-100 dark:border-blue-900/50',
    textColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    title: 'Busca Inteligente',
    desc: 'Pesquise entre milhares de Pokémon, itens, moves e regiões instantaneamente com o sistema de busca global.',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-100 dark:border-emerald-900/50',
    textColor: 'text-emerald-600 dark:text-emerald-400',
  },
];

export default function InfoSection() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="section-title mb-4">
          Tudo que um Treinador Precisa
        </h2>
        <p className="section-subtitle max-w-2xl mx-auto">
          Da Pokédex completa às batalhas online — uma plataforma feita para fãs de Pokémon que querem mais.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {FEATURES.map(({ icon, title, desc, bg, border, textColor }) => (
          <div
            key={title}
            className={`card card-hover p-6 flex flex-col gap-4 ${bg} ${border} border`}
          >
            <div className={`${textColor} w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900/50 shadow-sm border ${border}`}>
              {icon}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                {title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
