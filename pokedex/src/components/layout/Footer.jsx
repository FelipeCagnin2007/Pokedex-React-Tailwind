import { Link } from 'react-router-dom';

const FOOTER_LINKS = {
  'The Pokemon Atlas': [
    { to: '/pokemon',   label: 'Pokémon' },
    { to: '/moves',     label: 'Moves' },
    { to: '/items',     label: 'Itens' },
    { to: '/locations', label: 'Regiões' },
    { to: '/games',     label: 'Games' },
  ],
  Batalha: [
    { to: '/battle',        label: 'Lobby de Batalha' },
    { to: '/battle/cpu',    label: 'Vs Computador' },
    { to: '/battle/pvp',    label: 'PvP Online' },
    { to: '/battle/select', label: 'Selecionar Equipe' },
  ],
  Recursos: [
    { href: 'https://pokeapi.co/docs/v2', label: 'PokéAPI Docs', external: true },
    { href: 'https://github.com/PokeAPI/pokeapi', label: 'PokéAPI GitHub', external: true },
    { href: 'https://pokemondb.net', label: 'PokémonDB', external: true },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="47" fill="none" stroke="#DC2626" strokeWidth="6" />
                  <path d="M 3 50 A 47 47 0 0 1 97 50 Z" fill="#DC2626" />
                  <path d="M 3 50 A 47 47 0 0 0 97 50 Z" fill="#FFFFFF" />
                  <line x1="3" y1="50" x2="97" y2="50" stroke="#374151" strokeWidth="6" />
                  <circle cx="50" cy="50" r="14" fill="#374151" />
                  <circle cx="50" cy="50" r="9"  fill="#FFFFFF" />
                </svg>
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-lg">The Pokemon Atlas</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
              Enciclopédia Pokémon completa com dados em tempo real da{' '}
              <a
                href="https://pokeapi.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 dark:text-red-400 hover:underline font-medium"
              >
                PokéAPI v2
              </a>
              . Explore, estude e batalhe!
            </p>
            <p className="text-slate-400 dark:text-slate-500 text-xs leading-relaxed">
              Pokémon, nomes e imagens são propriedade da{' '}
              <strong className="text-slate-500 dark:text-slate-400">Nintendo, Game Freak & Creatures Inc.</strong>
              {' '}Este site não é afiliado ou endossado pela Nintendo.
            </p>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4 uppercase tracking-wider">
                {section}
              </h3>
              <ul className="space-y-2.5">
                {links.map(({ to, href, label, external }) => (
                  <li key={label}>
                    {external ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 text-sm transition-colors"
                      >
                        {label} ↗
                      </a>
                    ) : (
                      <Link
                        to={to}
                        className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 text-sm transition-colors"
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-400 dark:text-slate-500 text-xs">
            © {new Date().getFullYear()} The Pokemon Atlas. Desenvolvido por Cagnin Software Development.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-slate-300 dark:text-slate-600 text-xs">
              Dados via PokéAPI — CC0 1.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
