import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const FEATURED = [
  { id: 6,   name: 'Charizard' },
  { id: 25,  name: 'Pikachu' },
  { id: 150, name: 'Mewtwo' },
  { id: 249, name: 'Lugia' },
  { id: 384, name: 'Rayquaza' },
];

const STATS = [
  { value: '1008+', label: 'Pokémon' },
  { value: '900+',  label: 'Moves' },
  { value: 'PvP',   label: 'Batalhas Online' },
  { value: '100%',  label: 'Gratuito' },
];

export default function HeroSection() {
  const [featured, setFeatured] = useState(FEATURED[0]);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        i = (i + 1) % FEATURED.length;
        setFeatured(FEATURED[i]);
        setFade(true);
      }, 350);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${featured.id}.png`;

  return (
    <section className="relative overflow-hidden min-h-[88vh] flex items-center">
      {/* Background blobs */}
      <div className="absolute inset-0 hero-bg" aria-hidden="true" />

      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-16 left-[10%] w-72 h-72 bg-red-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-16 right-[8%] w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-[45%] w-64 h-64 bg-yellow-400/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

        {/* Large decorative pokeball */}
        <div className="absolute -right-16 top-1/2 -translate-y-1/2 w-[420px] h-[420px] opacity-[0.04] dark:opacity-[0.07]">
          <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
            <circle cx="50" cy="50" r="47" fill="none" stroke="#111" strokeWidth="5" />
            <path d="M 3 50 A 47 47 0 0 1 97 50 Z" fill="#DC2626" />
            <path d="M 3 50 A 47 47 0 0 0 97 50 Z" fill="#fff" />
            <line x1="3" y1="50" x2="97" y2="50" stroke="#111" strokeWidth="5" />
            <circle cx="50" cy="50" r="14" fill="#111" />
            <circle cx="50" cy="50" r="9"  fill="#fff" />
          </svg>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Text */}
          <div>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-full px-4 py-1.5 mb-6 animate-fade-in"
            >
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-600 dark:text-red-400 text-xs font-semibold uppercase tracking-wider">
                PokéAPI v2 • Dados em Tempo Real
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.1] mb-5 animate-slide-up tracking-tight">
              A Pokédex que{' '}
              <span className="gradient-text">
                Treinadores
              </span>{' '}
              Merecem
            </h1>

            {/* Subtitle */}
            <p
              className="text-slate-500 dark:text-slate-400 text-lg sm:text-xl leading-relaxed mb-8 max-w-lg animate-slide-up"
              style={{ animationDelay: '0.1s' }}
            >
              Explore <strong className="text-slate-700 dark:text-slate-200">1008+ Pokémon</strong>, moves,
              itens e regiões — e desafie amigos em batalhas{' '}
              <strong className="text-slate-700 dark:text-slate-200">PvP online</strong> em tempo real.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-3 animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              <Link to="/pokemon" id="hero-explore-btn" className="btn-primary text-base px-6 py-3">
                ⭐ Explorar Pokédex
              </Link>
              <Link to="/battle" id="hero-battle-btn" className="btn-battle text-base px-6 py-3">
                ⚔️ Iniciar Batalha
              </Link>
            </div>

            {/* Stats row */}
            <div
              className="grid grid-cols-4 gap-4 mt-10 pt-8 border-t border-slate-200 dark:border-slate-700 animate-fade-in"
              style={{ animationDelay: '0.4s' }}
            >
              {STATS.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="font-extrabold text-slate-900 dark:text-white text-xl sm:text-2xl leading-none">
                    {value}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 leading-tight">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Featured Pokémon */}
          <div className="hidden lg:flex flex-col items-center justify-center relative">
            <div className="relative w-72 h-72 xl:w-80 xl:h-80">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400/20 to-orange-400/20 blur-2xl scale-110" />

              {/* Pokémon image */}
              <img
                key={featured.id}
                src={spriteUrl}
                alt={featured.name}
                className={`w-full h-full object-contain relative z-10 transition-all duration-350 drop-shadow-2xl ${
                  fade ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                }`}
                loading="eager"
                fetchpriority="high"
              />

              {/* Name badge */}
              <div
                className={`absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-full px-5 py-1.5 shadow-card transition-all duration-300 ${
                  fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <span className="font-bold text-slate-900 dark:text-white text-sm capitalize">
                  {featured.name}
                </span>
              </div>

              {/* Rotating ring decoration */}
              <div className="absolute inset-[-20px] border-2 border-dashed border-slate-200/50 dark:border-slate-600/30 rounded-full animate-spin-slow pointer-events-none" />
            </div>

            {/* Dots indicator */}
            <div className="flex gap-2 mt-10">
              {FEATURED.map((p, i) => (
                <div
                  key={p.id}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    p.id === featured.id
                      ? 'w-6 bg-red-500'
                      : 'w-1.5 bg-slate-300 dark:bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
