import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import GlobalSearch from '../ui/GlobalSearch';
import { useTheme } from '../../context/ThemeContext';

const NAV_ITEMS = [
  { to: '/pokemon',   label: 'Pokémon',  icon: '🔴' },
  { to: '/moves',     label: 'Moves',    icon: '⚡' },
  { to: '/items',     label: 'Itens',    icon: '🎒' },
  { to: '/locations', label: 'Regiões',  icon: '🗺️' },
  { to: '/games',     label: 'Games',    icon: '🎮' },
  { to: '/battle',    label: 'Batalha',  icon: '⚔️', highlight: true },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggle } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-md border-b border-slate-200/60 dark:border-slate-700/60'
            : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200/40 dark:border-slate-700/40'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 h-16">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group flex-shrink-0"
              aria-label="Pokédex — Página inicial"
            >
              <div className="w-8 h-8 drop-shadow-sm group-hover:animate-wiggle transition-transform">
                <PokeballSVG />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-lg tracking-tight hidden sm:block group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                Pokédex
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center ml-2">
              {NAV_ITEMS.map(({ to, label, icon, highlight }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      highlight
                        ? isActive
                          ? 'bg-red-600 text-white shadow-glow-red'
                          : 'bg-gradient-to-r from-red-600 to-orange-500 text-white hover:shadow-glow-red hover:scale-105'
                        : isActive
                          ? 'bg-slate-100 dark:bg-slate-800 text-red-600 dark:text-red-400'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`
                  }
                >
                  <span className="text-base leading-none">{icon}</span>
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Search — flex-1 */}
            <div className="flex-1 max-w-xs sm:max-w-sm mx-2 lg:mx-3">
              <GlobalSearch />
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 flex-shrink-0"
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 110 10A5 5 0 0112 7z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile slide-down menu */}
      <div
        className={`fixed top-16 left-0 right-0 z-40 lg:hidden transition-all duration-300 ease-out ${
          menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map(({ to, label, icon, highlight }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    highlight
                      ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white'
                      : isActive
                        ? 'bg-slate-100 dark:bg-slate-800 text-red-600 dark:text-red-400'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`
                }
              >
                <span className="text-lg">{icon}</span>
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function PokeballSVG() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="47" fill="none" stroke="#0F172A" strokeWidth="6" />
      <path d="M 3 50 A 47 47 0 0 1 97 50 Z" fill="#DC2626" />
      <path d="M 3 50 A 47 47 0 0 0 97 50 Z" fill="#FFFFFF" />
      <line x1="3" y1="50" x2="97" y2="50" stroke="#0F172A" strokeWidth="6" />
      <circle cx="50" cy="50" r="14" fill="#0F172A" />
      <circle cx="50" cy="50" r="9"  fill="#FFFFFF" />
    </svg>
  );
}
