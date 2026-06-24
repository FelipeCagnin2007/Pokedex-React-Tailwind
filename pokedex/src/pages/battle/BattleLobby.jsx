import { Link } from 'react-router-dom';
import { usePageMeta } from '../../hooks/usePageMeta';
import { useBattle } from '../../context/BattleContext';

export default function BattleLobby() {
  usePageMeta('Batalha Pokémon', 'Desafie amigos em batalhas PvP online ou treine contra a IA. Forme sua equipe de 6 Pokémon e entre na arena!');
  const { selectedTeam } = useBattle();
  const hasTeam = selectedTeam.length === 6;

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Animated bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" aria-hidden="true" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float-slow" />
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-5 py-2 mb-6">
            <span className="text-2xl">⚔️</span>
            <span className="text-red-400 font-bold uppercase tracking-wider text-sm">Arena de Batalha</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Escolha seu <span className="gradient-text">Destino</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-lg mx-auto">
            Monte sua equipe de 6 Pokémon e entre na arena. Desafie um amigo ou enfrente a IA.
          </p>
        </div>

        {/* Team status */}
        {selectedTeam.length > 0 && (
          <div className="glass-dark rounded-2xl p-4 mb-8 flex items-center justify-between gap-4 max-w-xl mx-auto">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎯</span>
              <div>
                <p className="text-white font-semibold text-sm">
                  {hasTeam ? 'Equipe completa!' : `${selectedTeam.length}/6 Pokémon selecionados`}
                </p>
                <div className="flex gap-1 mt-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <img
                      key={i}
                      src={selectedTeam[i]?.sprite || undefined}
                      className={`w-7 h-7 object-contain rounded-full bg-slate-700 ${!selectedTeam[i] ? 'opacity-20' : ''}`}
                      alt={selectedTeam[i]?.name || 'vazio'}
                    />
                  ))}
                </div>
              </div>
            </div>
            <Link to="/battle/select" className="btn-secondary text-xs py-1.5 px-3 whitespace-nowrap">
              Editar equipe
            </Link>
          </div>
        )}

        {/* Mode cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CPU */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-3xl blur-lg group-hover:from-blue-600/30 group-hover:to-indigo-600/30 transition-all duration-300" />
            <div className="relative border border-blue-500/30 rounded-3xl p-8 bg-slate-800/80 backdrop-blur-sm hover:border-blue-400/60 transition-all duration-300">
              <div className="text-5xl mb-5">🤖</div>
              <h2 className="text-2xl font-bold text-white mb-3">VS Computador</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Enfrente a IA Pokémon em três níveis de dificuldade. Aprenda estratégias e pratique
                sem pressão. Ideal para iniciantes e para testar novas equipes.
              </p>
              <div className="flex gap-2 flex-wrap mb-6">
                {['Fácil', 'Normal', 'Difícil'].map(d => (
                  <span key={d} className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-full font-medium">
                    {d}
                  </span>
                ))}
              </div>
              {hasTeam ? (
                <Link to="/battle/cpu" id="battle-cpu-btn" className="btn-primary w-full justify-center">
                  ▶ Batalhar contra CPU
                </Link>
              ) : (
                <Link to="/battle/select" id="battle-cpu-select-btn" className="btn-secondary w-full justify-center">
                  Selecionar equipe primeiro
                </Link>
              )}
            </div>
          </div>

          {/* PvP */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-orange-600/20 rounded-3xl blur-lg group-hover:from-red-600/30 group-hover:to-orange-600/30 transition-all duration-300" />
            <div className="relative border border-red-500/30 rounded-3xl p-8 bg-slate-800/80 backdrop-blur-sm hover:border-red-400/60 transition-all duration-300">
              <div className="text-5xl mb-5">🌐</div>
              <h2 className="text-2xl font-bold text-white mb-3">Batalha PvP Online</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Desafie um amigo em tempo real via conexão P2P direta no navegador. Crie uma sala,
                compartilhe o código e batalhe de qualquer lugar.
              </p>
              <div className="flex gap-2 flex-wrap mb-6">
                {['Conexão direta', 'Sem cadastro', 'Tempo real'].map(t => (
                  <span key={t} className="text-xs bg-red-500/20 text-red-300 border border-red-500/30 px-2.5 py-1 rounded-full font-medium">
                    {t}
                  </span>
                ))}
              </div>
              {hasTeam ? (
                <Link to="/battle/pvp" id="battle-pvp-btn" className="btn-battle w-full justify-center">
                  ⚔️ Batalha PvP
                </Link>
              ) : (
                <Link to="/battle/select" id="battle-pvp-select-btn" className="btn-secondary w-full justify-center">
                  Selecionar equipe primeiro
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Select team link */}
        <div className="text-center mt-8">
          <Link to="/battle/select" className="text-slate-400 hover:text-white transition-colors text-sm underline underline-offset-4">
            {hasTeam ? '🔄 Trocar equipe' : '➕ Selecionar equipe de 6 Pokémon'}
          </Link>
        </div>
      </div>
    </main>
  );
}
