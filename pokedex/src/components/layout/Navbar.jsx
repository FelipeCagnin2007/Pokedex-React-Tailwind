import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import GlobalSearch from '../ui/GlobalSearch';

const NAV_ITEMS = [
  { to: '/pokemon', label: 'Pokémon' },
  { to: '/moves', label: 'Moves' },
  { to: '/items', label: 'Items' },
  { to: '/locations', label: 'Locations' },
  { to: '/games', label: 'Games' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b-2 border-poke-red shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0" onClick={() => setMenuOpen(false)}>
            <div className="w-6 h-6">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path d="M 5 50 A 45 45 0 0 1 95 50 Z" fill="#E3350D" />
                <path d="M 5 50 A 45 45 0 0 0 95 50 Z" fill="#FFFFFF" />
                <line x1="5" y1="50" x2="95" y2="50" stroke="#111" strokeWidth="6" />
                <circle cx="50" cy="50" r="13" fill="#111" />
                <circle cx="50" cy="50" r="8" fill="#FFFFFF" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#111" strokeWidth="5" />
              </svg>
            </div>
            <span className="font-bold text-poke-dark text-lg tracking-tight group-hover:text-poke-red transition-colors duration-150 hidden sm:block">
              Pokédex
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center mx-4">
            {NAV_ITEMS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-4 py-4 text-sm font-bold transition-colors duration-150 border-b-2 ${
                    isActive
                      ? 'border-poke-red text-poke-red'
                      : 'border-transparent text-poke-dark hover:text-poke-red hover:bg-poke-gray-light'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-sm ml-4 mr-2 lg:mx-0">
            <GlobalSearch />
          </div>

          {/* Mobile menu button */}
          <button
            id="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-poke-dark hover:bg-poke-gray-light transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-poke-gray">
            <div className="flex flex-col">
              {NAV_ITEMS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 text-sm font-bold border-b border-poke-gray ${
                      isActive
                        ? 'bg-poke-red text-white'
                        : 'bg-white text-poke-dark hover:bg-poke-gray-light hover:text-poke-red'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
