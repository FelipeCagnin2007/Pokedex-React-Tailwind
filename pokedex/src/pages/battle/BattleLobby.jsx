import { Link, useNavigate } from 'react-router-dom';
import { usePageMeta } from '../../hooks/usePageMeta';
import { useBattle } from '../../context/BattleContext';
import { useSeason } from '../../context/SeasonContext';
import { Bot, Globe, Play, Users, Trophy, Dices, Flame, RefreshCw, Plus } from 'lucide-react';

export default function BattleLobby() {
  usePageMeta('Batalha Pokémon', 'Desafie amigos em batalhas PvP online ou treine contra a IA. Forme sua equipe de 6 Pokémon e entre na arena!');
  const { selectedTeam } = useBattle();
  const { currentSeason, validate } = useSeason();
  const navigate = useNavigate();
  const hasTeam = selectedTeam.length === 6;

  const handlePvPClick = (e, mode, matchType) => {
    e.preventDefault();
    if (mode === 'seasonal') {
      const violations = validate(selectedTeam);
      if (violations.length > 0) {
        return alert('Equipe inválida para Batalha Sazonal:\n\n' + violations.join('\n'));
      }
    }
    navigate(`/battle/pvp?mode=${mode}&match=${matchType}`);
  };

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Animated bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" aria-hidden="true" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float-slow" />
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-5 py-2 mb-6">
            <span className="text-red-400 font-bold uppercase tracking-wider text-sm">Arena de Batalha</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Escolha seu <span className="gradient-text">Destino</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-lg mx-auto">
            Monte sua equipe de 6 Pokémon e entre na arena. Desafie um amigo ou enfrente a IA.
          </p>
        </div>

        {/* Team status */}
        {selectedTeam.length > 0 && (
          <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-xl mx-auto shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
              <div>
                <p className="text-slate-900 dark:text-white font-semibold text-sm">
                  {hasTeam ? 'Equipe completa!' : `${selectedTeam.length}/6 Pokémon selecionados`}
                </p>
                <div className="flex justify-center sm:justify-start gap-1 mt-2 sm:mt-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <img
                      key={i}
                      src={selectedTeam[i]?.sprite || undefined}
                      className={`w-8 h-8 sm:w-7 sm:h-7 object-contain rounded-full bg-slate-700 ${!selectedTeam[i] ? 'opacity-20' : ''}`}
                      alt={selectedTeam[i]?.name || 'vazio'}
                    />
                  ))}
                </div>
              </div>
            </div>
            <Link to="/battle/select" className="btn-secondary text-xs py-2 px-4 whitespace-nowrap w-full sm:w-auto text-center">
              Editar equipe
            </Link>
          </div>
        )}

        {/* Mode cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* CPU */}
          <div className="relative group flex flex-col h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 dark:from-blue-600/20 dark:to-indigo-600/20 rounded-3xl blur-lg group-hover:from-blue-600/20 group-hover:to-indigo-600/20 dark:group-hover:from-blue-600/30 dark:group-hover:to-indigo-600/30 transition-all duration-300" />
            <div className="relative flex flex-col h-full border border-blue-200 dark:border-blue-500/30 rounded-3xl p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:border-blue-300 dark:hover:border-blue-400/60 transition-all duration-300 shadow-sm">
              <div className="mb-5 text-blue-500 dark:text-blue-400"><Bot size={48} strokeWidth={1.5} /></div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">VS Computador</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                Enfrente a IA Pokémon em três níveis de dificuldade. Aprenda estratégias e pratique
                sem pressão. Ideal para iniciantes e para testar novas equipes.
              </p>
              <div className="flex gap-2 flex-wrap mb-6">
                {['Fácil', 'Normal', 'Difícil'].map(d => (
                  <span key={d} className="text-xs bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 px-2.5 py-1 rounded-full font-medium">
                    {d}
                  </span>
                ))}
              </div>
              <div className="mt-auto">
                {hasTeam ? (
                  <Link to="/battle/cpu" id="battle-cpu-btn" className="btn-primary w-full justify-center flex items-center gap-2">
                    <Play size={18} /> Batalhar contra CPU
                  </Link>
                ) : (
                  <Link to="/battle/select" id="battle-cpu-select-btn" className="btn-secondary w-full justify-center">
                    Selecionar equipe primeiro
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* PvP */}
          <div className="relative group flex flex-col h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-orange-600/10 dark:from-red-600/20 dark:to-orange-600/20 rounded-3xl blur-lg group-hover:from-red-600/20 group-hover:to-orange-600/20 dark:group-hover:from-red-600/30 dark:group-hover:to-orange-600/30 transition-all duration-300" />
            <div className="relative flex flex-col h-full border border-red-200 dark:border-red-500/30 rounded-3xl p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:border-red-300 dark:hover:border-red-400/60 transition-all duration-300 shadow-sm">
              <div className="mb-5 text-red-500 dark:text-red-400"><Globe size={48} strokeWidth={1.5} /></div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Batalha PvP Online</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                Desafie um amigo em tempo real via conexão P2P direta no navegador. Crie uma sala,
                compartilhe o código e batalhe de qualquer lugar.
              </p>
              <div className="flex gap-2 flex-wrap mb-6">
                {['Normal', 'Sazonal', 'Grupo', 'Aleatório'].map(t => (
                  <span key={t} className="text-xs bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-300 border border-red-200 dark:border-red-500/30 px-2.5 py-1 rounded-full font-medium">
                    {t}
                  </span>
                ))}
              </div>
              
              <div className="mt-auto">
                {hasTeam ? (
                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={(e) => handlePvPClick(e, 'normal', 'group')} className="btn-secondary text-xs px-2 py-2 flex flex-col items-center gap-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600">
                        <Users size={20} /> Normal (Grupo)
                      </button>
                      <button onClick={(e) => handlePvPClick(e, 'seasonal', 'group')} className="btn-battle text-xs px-2 py-2 flex flex-col items-center gap-1">
                        <Trophy size={20} /> Sazonal (Grupo)
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={(e) => handlePvPClick(e, 'normal', 'random')} className="btn-secondary text-xs px-2 py-2 flex flex-col items-center gap-1 bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700 dark:bg-indigo-500/20 dark:hover:bg-indigo-500/30 dark:border-indigo-500/30 dark:text-indigo-300">
                        <Dices size={20} /> Normal (Fila)
                      </button>
                      <button onClick={(e) => handlePvPClick(e, 'seasonal', 'random')} className="btn-battle text-xs px-2 py-2 flex flex-col items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 dark:from-amber-600 dark:to-orange-600 border-none text-white shadow-md">
                        <Flame size={20} /> Sazonal (Fila)
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link to="/battle/select" id="battle-pvp-select-btn" className="btn-secondary w-full justify-center">
                    Selecionar equipe primeiro
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/battle/select" className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium hover:underline underline-offset-4">
            {hasTeam ? <><RefreshCw size={16} /> Trocar equipe</> : <><Plus size={16} /> Selecionar equipe de 6 Pokémon</>}
          </Link>
        </div>
      </div>
    </main>
  );
}
