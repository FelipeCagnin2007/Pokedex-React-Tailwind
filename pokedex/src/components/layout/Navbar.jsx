import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import GlobalSearch from '../ui/GlobalSearch';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

import {
  CircleDot,
  Zap,
  Backpack,
  Map as MapIcon,
  Gamepad2,
  Trophy,
  Swords,
  Users,
  Sun,
  Moon,
  User,
  LogIn,
  Menu,
  X
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/pokemon',   label: 'Pokémon',  icon: <CircleDot className="w-5 h-5" /> },
  { to: '/moves',     label: 'Moves',    icon: <Zap className="w-5 h-5" /> },
  { to: '/items',     label: 'Itens',    icon: <Backpack className="w-5 h-5" /> },
  { to: '/locations', label: 'Regiões',  icon: <MapIcon className="w-5 h-5" /> },
  { to: '/games',     label: 'Games',    icon: <Gamepad2 className="w-5 h-5" /> },
  { to: '/ranking',   label: 'Ranking',  icon: <Trophy className="w-5 h-5" /> },
  { to: '/battle/select', label: 'Equipe', icon: <Users className="w-5 h-5" /> },
  { to: '/battle',    label: 'Batalha',  icon: <Swords className="w-5 h-5" />, highlight: true },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggle } = useTheme();
  const { user, profile, signOut } = useAuth();
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
        <nav className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 xl:gap-4 h-16">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group flex-shrink-0"
              aria-label="The Pokemon Atlas — Página inicial"
            >
              <div className="w-8 h-8 drop-shadow-sm group-hover:animate-wiggle transition-transform">
                <PokeballSVG />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-lg tracking-tight hidden sm:block group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                The Pokemon Atlas
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center ml-1 xl:ml-2">
              {NAV_ITEMS.map(({ to, label, icon, highlight }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-2 xl:px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
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
            <div className="flex-1 min-w-[150px] max-w-xs sm:max-w-sm lg:max-w-md mx-2 lg:mx-3">
              <GlobalSearch />
            </div>

            {/* Desktop Auth & Theme */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-4 flex-shrink-0">
              <button
                onClick={toggle}
                aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {user ? (
                <div className="flex items-center ml-1">
                  <Link
                    to="/profile"
                    title={`Perfil de ${profile?.username || user.email}`}
                    className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-red-400 dark:hover:border-red-500 transition-all flex items-center justify-center overflow-hidden flex-shrink-0"
                  >
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Avatar" className="w-7 h-7 object-contain drop-shadow-sm" />
                    ) : (
                      <User className="w-5 h-5 text-slate-400" />
                    )}
                  </Link>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
                >
                  <LogIn className="w-4 h-4" /> <span>Login</span>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
                {icon}
                {label}
              </NavLink>
            ))}

            <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />

            {/* Mobile Auth & Theme Toggle inside Menu */}
            <div className="flex items-center justify-between px-4 py-2">
              <button
                onClick={toggle}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex-1 transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span>{isDark ? 'Modo Claro' : 'Modo Escuro'}</span>
              </button>
            </div>

            <div className="px-4 pb-4">
              {user ? (
                <div className="flex flex-col gap-2 mt-2">
                  <Link
                    to="/profile"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Avatar" className="w-5 h-5 object-contain" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    Perfil de {profile?.username || 'Usuário'}
                  </Link>
                  <Link
                    to="/ranking"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-medium hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                  >
                    <Trophy className="w-4 h-4" /> Ranking: {profile?.mmr || 1000}
                  </Link>
                  <button
                    onClick={signOut}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 font-medium transition-colors"
                  >
                    Sair da conta
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors mt-2"
                >
                  <LogIn className="w-5 h-5" /> Fazer Login
                </Link>
              )}
            </div>
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
