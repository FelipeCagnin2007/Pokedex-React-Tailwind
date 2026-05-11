import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-poke-gray bg-poke-gray-light mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-poke-dark mb-3 uppercase tracking-wider text-xs">About</h3>
            <p className="text-poke-dark-2 leading-relaxed">
              Site não oficial que consome a{' '}
              <a
                href="https://pokeapi.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-poke-blue hover:text-poke-red hover:underline font-semibold"
              >
                PokéAPI v2
              </a>
              . Todos os dados, nomes e imagens de Pokémon são propriedade da{' '}
              <span className="font-semibold text-poke-dark">Nintendo, Game Freak e Creatures Inc.</span>
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold text-poke-dark mb-3 uppercase tracking-wider text-xs">Site Sections</h3>
            <ul className="space-y-1">
              {[
                { to: '/pokemon', label: 'Pokémon data' },
                { to: '/moves', label: 'Moves learned' },
                { to: '/items', label: 'Items & Berries' },
                { to: '/locations', label: 'Regions & Locations' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-poke-blue hover:text-poke-red hover:underline transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* API Info */}
          <div>
            <h3 className="font-bold text-poke-dark mb-3 uppercase tracking-wider text-xs">Resources</h3>
            <ul className="space-y-1">
              {[
                { href: 'https://pokeapi.co/docs/v2', label: 'PokéAPI Documentation' },
                { href: 'https://github.com/PokeAPI/pokeapi', label: 'PokéAPI GitHub' },
                { href: 'https://pokemondb.net', label: 'Pokémon Database (Reference)' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-poke-blue hover:text-poke-red hover:underline transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-poke-gray mt-8 pt-6">
          <p className="text-poke-gray-dark text-xs text-center">
            © {new Date().getFullYear()} Pokédex Explorer. Created for educational purposes. Built with React and PokéAPI v2.
          </p>
        </div>
      </div>
    </footer>
  );
}
