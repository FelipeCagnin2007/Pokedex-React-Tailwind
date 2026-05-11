import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Animated background */}
      <div className="absolute inset-0 bg-poke-hero" />
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-poke-red/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-poke-blue/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-poke-yellow/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.75s' }} />
      </div>

      {/* Floating Pokeballs decoration */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block opacity-20">
        <PokeballSVG size={300} className="animate-spin-slow" />
      </div>
      <div className="absolute left-4 bottom-8 hidden lg:block opacity-10">
        <PokeballSVG size={120} className="animate-float" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 z-10">
        <div className="max-w-3xl">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-poke-red/20 border border-poke-red/40 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-poke-red rounded-full animate-pulse" />
            <span className="text-poke-red text-xs font-semibold uppercase tracking-wider">Projeto Acadêmico</span>
          </div>

          {/* Title */}
          <h1 className="font-pixel text-poke-yellow text-2xl sm:text-3xl lg:text-4xl leading-relaxed mb-6 animate-slide-up">
            Pokédex<br />
            <span className="text-white">UNIP Jundiaí</span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-300 text-lg sm:text-xl leading-relaxed mb-8 animate-slide-up max-w-2xl" style={{ animationDelay: '0.1s' }}>
            Desenvolvido por <span className="text-white font-bold">Felipe e Paulo</span>, do curso de Ciência da Computação da UNIP Jundiaí. Este projeto é uma <span className="text-poke-yellow font-semibold">Pokédex Interativa</span> com um banco de dados completo sobre o universo Pokémon, focada em usabilidade e design moderno.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/pokemon" id="hero-explore-btn" className="btn-primary text-center text-sm sm:text-base">
              ⭐ Explorar Pokémon
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {[
              { value: 'Felipe', label: 'Desenvolvedor' },
              { value: 'Paulo', label: 'Desenvolvedor' },
              { value: 'CC', label: 'UNIP Jundiaí' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-pixel text-poke-yellow text-lg sm:text-2xl">{value}</p>
                <p className="text-poke-gray-light text-xs sm:text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PokeballSVG({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      <path d="M 5 50 A 45 45 0 0 1 95 50 Z" fill="#CC0000" />
      <path d="M 5 50 A 45 45 0 0 0 95 50 Z" fill="#F8F8F8" />
      <line x1="5" y1="50" x2="95" y2="50" stroke="#111" strokeWidth="5" />
      <circle cx="50" cy="50" r="13" fill="#111" />
      <circle cx="50" cy="50" r="8" fill="#F8F8F8" />
      <circle cx="50" cy="50" r="45" fill="none" stroke="#111" strokeWidth="5" />
    </svg>
  );
}
