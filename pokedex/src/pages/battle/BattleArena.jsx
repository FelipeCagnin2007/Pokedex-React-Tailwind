import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBattle } from '../../context/BattleContext';
import { useBattleState } from '../../battle/useBattleState';
import { hpPercent, hpBarClass } from '../../battle/battleEngine';
import TypeBadge from '../../components/ui/TypeBadge';
import { usePageMeta } from '../../hooks/usePageMeta';

export default function BattleArena({ mode = 'cpu', enemyTeam = [], onSendAction, waitingForOpponent = false }) {
  usePageMeta('Arena de Batalha', 'Lute com sua equipe na arena Pokémon!');
  const navigate = useNavigate();
  const { selectedTeam, difficulty } = useBattle();
  const logRef = useRef(null);
  const [showLog, setShowLog] = useState(false);
  const [switchMenu, setSwitchMenu] = useState(false);

  const battle = useBattleState({ mode, difficulty });

  useEffect(() => {
    if (selectedTeam.length > 0 && enemyTeam.length > 0) {
      battle.initBattle(selectedTeam, enemyTeam);
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [battle.log]);

  const { playerPoke, enemyPoke, phase, log, winner, animation, PHASES } = battle;

  if (!playerPoke || !enemyPoke) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-slate-400">Sua equipe ou equipe inimiga está vazia.</p>
        <Link to="/battle/select" className="btn-primary">Selecionar equipe</Link>
      </div>
    );
  }

  function handleSelectMove(move) {
    setSwitchMenu(false);
    if (mode === 'pvp' && onSendAction) onSendAction({ type: 'attack', move });
    else battle.selectMove(move);
  }

  function handleSwitch(idx) {
    setSwitchMenu(false);
    if (mode === 'pvp' && onSendAction) onSendAction({ type: 'switch', index: idx });
    else battle.switchPokemon(idx);
  }

  const isPlayerTurn = phase === PHASES.PLAYER && !waitingForOpponent;
  const lastMsg = log[log.length - 1]?.msg || '...';

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-slate-100 select-none" style={{ fontFamily: "'Press Start 2P', monospace" }}>

      {/* ── Top HUD ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200 shadow-sm z-20 flex-shrink-0">
        <button
          onClick={() => { if (window.confirm('Deseja sair da batalha?')) navigate('/battle'); }}
          className="text-slate-500 hover:text-red-500 text-[9px] transition-colors"
        >
          ✕ SAIR
        </button>
        {/* Party dots */}
        <div className="flex gap-1.5">
          {battle.playerTeam.map((p, i) => (
            <div key={p.id} title={p.name}
              className={`w-3 h-3 rounded-full border-2 transition-all ${
                p.currentHp <= 0       ? 'bg-transparent border-slate-300' :
                i === battle.playerIdx ? 'bg-red-400 border-red-500 shadow-[0_0_6px_rgba(248,113,113,0.6)]' :
                                         'bg-emerald-400 border-emerald-500'
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => setShowLog(v => !v)}
          className={`text-[9px] transition-colors ${showLog ? 'text-red-500' : 'text-slate-400 hover:text-slate-700'}`}
        >
          {showLog ? '■ LOG' : '▶ LOG'}
        </button>
      </div>

      {/* ── Battle field ─────────────────────────────────────────── */}
      <div className="relative flex-1 overflow-hidden flex flex-col sm:flex-row items-center justify-center gap-4 p-4">

        {/* ── Enemy side ─────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4 w-full">
          {/* Enemy Status Box */}
          <EnemyStatusBox pokemon={enemyPoke} team={battle.enemyTeam} activeIdx={battle.enemyIdx} />
          {/* Enemy sprite */}
          <div className={`relative transition-all duration-500
            ${animation?.target === 'enemy' && animation.type === 'hit' ? 'animate-battle-flash' : ''}
            ${animation?.target === 'enemy' && animation.type === 'miss' ? 'opacity-40' : 'opacity-100'}
          `}>
            <div className="w-40 h-40 sm:w-48 sm:h-48 relative">
              {/* Soft shadow under sprite */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-4 bg-black/10 rounded-full blur-md" />
              <img
                key={`enemy-${enemyPoke.id}`}
                src={enemyPoke.animatedSprite || enemyPoke.sprite}
                alt={enemyPoke.name}
                className="w-full h-full object-contain drop-shadow-xl animate-enter-right"
                style={{ imageRendering: enemyPoke.animatedSprite ? 'pixelated' : 'auto', animationFillMode: 'both' }}
              />
            </div>
          </div>
        </div>

        {/* Divider / VS */}
        <div className="hidden sm:flex flex-col items-center gap-2">
          <div className="w-px h-24 bg-slate-200" />
          <span className="font-pixel text-[10px] text-slate-300">VS</span>
          <div className="w-px h-24 bg-slate-200" />
        </div>

        {/* ── Player side ────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4 w-full">
          {/* Player sprite */}
          <div className={`relative transition-all duration-500
            ${animation?.target === 'player' && animation.type === 'hit' ? 'animate-battle-flash' : ''}
            ${animation?.target === 'player' && animation.type === 'miss' ? 'opacity-40' : 'opacity-100'}
          `}>
            <div className="w-40 h-40 sm:w-48 sm:h-48 relative">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-4 bg-black/10 rounded-full blur-md" />
              <img
                key={`player-${playerPoke.id}`}
                src={playerPoke.animatedSprite || playerPoke.sprite}
                alt={playerPoke.name}
                className="w-full h-full object-contain drop-shadow-xl animate-enter-left"
                style={{ imageRendering: playerPoke.animatedSprite ? 'pixelated' : 'auto', animationFillMode: 'both' }}
              />
            </div>
          </div>
          {/* Player Status Box */}
          <PlayerStatusBox pokemon={playerPoke} team={battle.playerTeam} activeIdx={battle.playerIdx} />
        </div>

        {/* CPU thinking indicator */}
        {phase === PHASES.CPU && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="bg-white border border-slate-200 shadow-lg rounded-2xl px-6 py-3 text-center animate-fade-in">
              <p className="text-slate-700 text-[10px]">🤖 CPU pensando...</p>
            </div>
          </div>
        )}

        {/* Log overlay */}
        {showLog && (
          <div className="absolute top-2 right-2 bottom-2 w-56 z-20 flex flex-col">
            <div
              ref={logRef}
              className="flex-1 bg-white/95 border border-slate-200 shadow-xl rounded-xl p-3 overflow-y-auto no-scrollbar flex flex-col gap-1"
            >
              {log.map(entry => (
                <LogLine key={entry.id} entry={entry} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom panel ─────────────────────────────────────────── */}
      <div className="flex-shrink-0 z-20" style={{ fontFamily: "'Press Start 2P', monospace" }}>

        {/* Dialog box */}
        <div className="bg-gradient-to-r from-slate-50 to-white border-t-2 border-b border-slate-200 px-5 py-3 min-h-[52px] flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0 animate-pulse" />
          <p className="text-slate-800 text-[11px] leading-relaxed flex-1">
            {waitingForOpponent ? '⏳ Aguardando oponente...' : lastMsg}
          </p>
        </div>

        {/* Switch Pokémon panel */}
        {switchMenu && (
          <div className="bg-slate-800 border-b border-slate-700 animate-slide-up">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 text-[9px] uppercase tracking-widest">Trocar Pokémon</span>
                <button
                  onClick={() => setSwitchMenu(false)}
                  className="text-slate-400 hover:text-white text-[9px] transition-colors"
                >
                  ESC / VOLTAR
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {battle.playerTeam.map((p, i) => (
                  p.id !== playerPoke.id ? (
                    <button
                      key={p.id}
                      onClick={() => handleSwitch(i)}
                      disabled={p.currentHp <= 0}
                      title={p.name}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all duration-200
                        ${ p.currentHp <= 0
                          ? 'border-slate-700 bg-slate-800/50 opacity-40 cursor-not-allowed'
                          : 'border-slate-600 bg-slate-700/60 hover:bg-slate-600 hover:border-emerald-400 cursor-pointer hover:scale-105 active:scale-95'
                        }`}
                    >
                      <img src={p.sprite} alt={p.name} className="w-10 h-10 object-contain" />
                      <span className="text-[8px] text-white capitalize truncate w-full text-center">{p.name}</span>
                      <span className={`text-[8px] font-bold ${p.currentHp <= 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {p.currentHp <= 0 ? 'KO' : `${p.currentHp}HP`}
                      </span>
                    </button>
                  ) : (
                    <div key={p.id} className="flex flex-col items-center gap-1 p-2 rounded-xl border-2 border-red-500/50 bg-red-900/20 opacity-60">
                      <img src={p.sprite} alt={p.name} className="w-10 h-10 object-contain" />
                      <span className="text-[8px] text-red-300 capitalize truncate w-full text-center">{p.name}</span>
                      <span className="text-[8px] text-red-400">EM CAMPO</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action panel */}
        {!switchMenu && (
          <div className="flex">
            {/* Moves grid — 2x2 */}
            <div className="flex-1 grid grid-cols-2">
              {(playerPoke.moves || []).slice(0, 4).map((move, i) => (
                <MoveButton
                  key={i}
                  move={move}
                  index={i}
                  onClick={() => handleSelectMove(move)}
                  disabled={!isPlayerTurn}
                />
              ))}
              {Array.from({ length: Math.max(0, 4 - (playerPoke.moves?.length || 0)) }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-slate-50 border border-slate-100 min-h-[64px]" />
              ))}
            </div>

            {/* Side actions */}
            <div className="flex flex-col w-36 border-l-2 border-slate-200">
              <SideAction
                label="POKÉMON"
                icon={
                  <svg viewBox="0 0 100 100" className="w-5 h-5">
                    <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="8" />
                    <path d="M 3 50 A 47 47 0 0 1 97 50 Z" fill="currentColor" opacity="0.6" />
                    <line x1="3" y1="50" x2="97" y2="50" stroke="currentColor" strokeWidth="8" />
                    <circle cx="50" cy="50" r="13" fill="currentColor" />
                  </svg>
                }
                active={isPlayerTurn}
                accent="text-red-600"
                bg="hover:bg-red-50"
                onClick={() => setSwitchMenu(v => !v)}
              />
              <SideAction
                label="FUGIR"
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                }
                active={isPlayerTurn}
                accent="text-slate-500"
                bg="hover:bg-slate-50"
                onClick={() => { if (window.confirm('Fugir da batalha?')) navigate('/battle'); }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Game Over overlay ──────────────────────────────────── */}
      {winner && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in">
          <div className="text-center animate-bounce-in px-8">
            <div className="text-7xl mb-6 animate-float">
              {winner === 'player' ? '🏆' : '😞'}
            </div>
            <h2
              className="text-3xl text-white mb-3 animate-slide-up"
              style={{ fontFamily: "'Press Start 2P', monospace", textShadow: winner === 'player' ? '0 0 30px rgba(250,204,21,0.8)' : 'none' }}
            >
              {winner === 'player' ? 'VITÓRIA!' : 'DERROTA!'}
            </h2>
            <p className="text-slate-400 mb-8 text-[11px] leading-relaxed" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              {winner === 'player'
                ? 'Todos os Pokémon inimigos\ndesmaiaram!'
                : 'Todos os seus Pokémon\ndesmaiaram...'}
            </p>
            <div className="flex flex-col gap-3 items-center">
              <button
                onClick={() => battle.initBattle(selectedTeam, battle.enemyTeam.map(p => ({ ...p, currentHp: p.maxHp })))}
                className="btn-battle px-10 py-3 text-[11px]"
              >
                🔄 REVANCHE
              </button>
              <Link to="/battle" className="btn-secondary px-8 py-2.5 text-[10px]">
                ← LOBBY
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Enemy Status Box ─────────────────────────────────────────────────────────
function EnemyStatusBox({ pokemon, team, activeIdx }) {
  const pct = hpPercent(pokemon.currentHp, pokemon.maxHp);
  const bar = hpBarClass(pct);

  return (
    <div className="w-full max-w-xs bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden animate-slide-in-left">
      <div className="px-3 pt-2.5 pb-1">
        {/* Name row */}
        <div className="flex items-center justify-between mb-1">
          <span className="font-pixel text-slate-900 text-[10px] capitalize leading-none tracking-tight">
            {pokemon.name}
          </span>
          <div className="flex gap-0.5">
            {team.map((p, i) => (
              <div key={p.id}
                className={`w-2 h-2 rounded-full ${
                  p.currentHp <= 0       ? 'bg-slate-300' :
                  i === activeIdx        ? 'bg-red-400' :
                                           'bg-green-400'
                }`}
              />
            ))}
          </div>
        </div>
        {/* Types */}
        <div className="flex gap-1 mb-1.5">
          {pokemon.types?.map(t => <TypeBadge key={t} type={t} />)}
        </div>
        {/* HP label */}
        <div className="flex items-center justify-between">
          <span className="font-pixel text-slate-500 text-[8px]">HP</span>
          <span className={`font-pixel text-[8px] ${
            pct > 50 ? 'text-emerald-500' : pct > 20 ? 'text-yellow-500' : 'text-red-500'
          }`}>{Math.max(0, pokemon.currentHp)}/{pokemon.maxHp}</span>
        </div>
        {/* HP bar */}
        <div className="mt-1 mb-2 h-3 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
          <div
            className={`h-full rounded-full hp-bar-fill ${bar} transition-all duration-700`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Player Status Box ────────────────────────────────────────────────────────
function PlayerStatusBox({ pokemon, team, activeIdx }) {
  const pct = hpPercent(pokemon.currentHp, pokemon.maxHp);
  const bar = hpBarClass(pct);

  return (
    <div className="w-full max-w-xs bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden animate-slide-in-right">
      <div className="px-3 pt-2.5 pb-1">
        {/* Name */}
        <div className="flex items-center justify-between mb-1">
          <span className="font-pixel text-slate-900 text-[10px] capitalize leading-none tracking-tight">
            {pokemon.name}
          </span>
          <span className="font-pixel text-[8px] text-slate-400">LV.50</span>
        </div>
        {/* Types */}
        <div className="flex gap-1 mb-1.5">
          {pokemon.types?.map(t => <TypeBadge key={t} type={t} />)}
        </div>
        <div className="flex items-center justify-between">
          <span className="font-pixel text-slate-500 text-[8px]">HP</span>
          <span className={`font-pixel text-[8px] ${
            pct > 50 ? 'text-emerald-500' : pct > 20 ? 'text-yellow-500' : 'text-red-500'
          }`}>{Math.max(0, pokemon.currentHp)}/{pokemon.maxHp}</span>
        </div>
        <div className="mt-1 mb-2 h-3 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
          <div
            className={`h-full rounded-full hp-bar-fill ${bar} transition-all duration-700`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex gap-1 justify-end">
          {team.map((p, i) => (
            <div key={p.id}
              className={`w-2.5 h-2.5 rounded-full border ${
                p.currentHp <= 0 ? 'bg-transparent border-slate-300' :
                i === activeIdx  ? 'bg-red-400 border-red-500' :
                                   'bg-green-400 border-green-500'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Move Button ─────────────────────────────────────────────────────────────────
const MOVE_TYPE_PALETTE = {
  fire:     { pill: 'bg-orange-500',  text: 'text-orange-700', bg: 'bg-orange-50',  hover: 'hover:bg-orange-100',  border: 'border-orange-200',  accent: 'bg-orange-500/10' },
  water:    { pill: 'bg-blue-500',    text: 'text-blue-700',   bg: 'bg-blue-50',    hover: 'hover:bg-blue-100',    border: 'border-blue-200',    accent: 'bg-blue-500/10' },
  grass:    { pill: 'bg-green-500',   text: 'text-green-700',  bg: 'bg-green-50',   hover: 'hover:bg-green-100',   border: 'border-green-200',   accent: 'bg-green-500/10' },
  electric: { pill: 'bg-yellow-400',  text: 'text-yellow-700', bg: 'bg-yellow-50',  hover: 'hover:bg-yellow-100',  border: 'border-yellow-200',  accent: 'bg-yellow-400/10' },
  psychic:  { pill: 'bg-pink-500',    text: 'text-pink-700',   bg: 'bg-pink-50',    hover: 'hover:bg-pink-100',    border: 'border-pink-200',    accent: 'bg-pink-500/10' },
  ice:      { pill: 'bg-cyan-400',    text: 'text-cyan-700',   bg: 'bg-cyan-50',    hover: 'hover:bg-cyan-100',    border: 'border-cyan-200',    accent: 'bg-cyan-400/10' },
  fighting: { pill: 'bg-red-600',     text: 'text-red-700',    bg: 'bg-red-50',     hover: 'hover:bg-red-100',     border: 'border-red-200',     accent: 'bg-red-600/10' },
  poison:   { pill: 'bg-purple-500',  text: 'text-purple-700', bg: 'bg-purple-50',  hover: 'hover:bg-purple-100',  border: 'border-purple-200',  accent: 'bg-purple-500/10' },
  ghost:    { pill: 'bg-violet-600',  text: 'text-violet-700', bg: 'bg-violet-50',  hover: 'hover:bg-violet-100',  border: 'border-violet-200',  accent: 'bg-violet-600/10' },
  dragon:   { pill: 'bg-indigo-600',  text: 'text-indigo-700', bg: 'bg-indigo-50',  hover: 'hover:bg-indigo-100',  border: 'border-indigo-200',  accent: 'bg-indigo-600/10' },
  dark:     { pill: 'bg-slate-700',   text: 'text-slate-700',  bg: 'bg-slate-100',  hover: 'hover:bg-slate-200',   border: 'border-slate-300',   accent: 'bg-slate-500/10' },
  steel:    { pill: 'bg-slate-400',   text: 'text-slate-600',  bg: 'bg-slate-50',   hover: 'hover:bg-slate-100',   border: 'border-slate-200',   accent: 'bg-slate-400/10' },
  ground:   { pill: 'bg-amber-500',   text: 'text-amber-700',  bg: 'bg-amber-50',   hover: 'hover:bg-amber-100',   border: 'border-amber-200',   accent: 'bg-amber-500/10' },
  rock:     { pill: 'bg-stone-500',   text: 'text-stone-700',  bg: 'bg-stone-50',   hover: 'hover:bg-stone-100',   border: 'border-stone-200',   accent: 'bg-stone-500/10' },
  bug:      { pill: 'bg-lime-500',    text: 'text-lime-700',   bg: 'bg-lime-50',    hover: 'hover:bg-lime-100',    border: 'border-lime-200',    accent: 'bg-lime-500/10' },
  flying:   { pill: 'bg-sky-400',     text: 'text-sky-700',    bg: 'bg-sky-50',     hover: 'hover:bg-sky-100',     border: 'border-sky-200',     accent: 'bg-sky-400/10' },
  fairy:    { pill: 'bg-pink-400',    text: 'text-pink-700',   bg: 'bg-pink-50',    hover: 'hover:bg-pink-100',    border: 'border-pink-200',    accent: 'bg-pink-400/10' },
  normal:   { pill: 'bg-slate-400',   text: 'text-slate-600',  bg: 'bg-slate-50',   hover: 'hover:bg-slate-100',   border: 'border-slate-200',   accent: 'bg-slate-400/10' },
  default:  { pill: 'bg-slate-300',   text: 'text-slate-600',  bg: 'bg-white',      hover: 'hover:bg-slate-50',    border: 'border-slate-200',   accent: 'bg-slate-200/50' },
};

function MoveButton({ move, onClick, disabled, index }) {
  const pal = MOVE_TYPE_PALETTE[move.type?.name] || MOVE_TYPE_PALETTE.default;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative flex flex-col justify-between p-3 min-h-[64px] text-left group
        ${pal.bg} ${!disabled ? pal.hover : ''}
        border-r border-b ${pal.border}
        ${!disabled ? 'cursor-pointer active:scale-[0.98] active:brightness-95' : 'cursor-not-allowed opacity-50'}
        transition-all duration-150 overflow-hidden
      `}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${pal.pill} opacity-70`} />
      <span
        className={`font-pixel text-[9px] capitalize leading-snug ${pal.text} pl-2 transition-all group-hover:pl-3 duration-150`}
        style={{ letterSpacing: '-0.01em', maxWidth: '100%' }}
      >
        {(move.name || '---').replace(/-/g, ' ')}
      </span>
      <div className="flex items-center justify-between mt-1.5 pl-2">
        <div className="flex items-center gap-1.5">
          {move.type && (
            <span className={`${pal.pill} text-white text-[7px] font-bold px-1.5 py-0.5 rounded-full capitalize leading-none`}>
              {move.type.name}
            </span>
          )}
        </div>
        {move.power && (
          <span className="text-[8px] text-slate-400 font-pixel">
            {move.power}
          </span>
        )}
      </div>
    </button>
  );
}

// ─── Side Action Button ────────────────────────────────────────────────────────
function SideAction({ label, icon, active, accent, bg, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={!active}
      className={`
        flex-1 flex flex-col items-center justify-center gap-1.5 py-3
        border-b border-slate-200 bg-white
        font-pixel text-[8px] tracking-tight transition-all duration-150
        ${active ? `${accent} ${bg} cursor-pointer hover:shadow-inner active:scale-95` : 'text-slate-300 cursor-not-allowed'}
      `}
    >
      <span className={`transition-transform duration-150 ${active ? 'group-hover:scale-110' : ''}`}>
        {icon}
      </span>
      {label}
    </button>
  );
}

// ─── Log line ─────────────────────────────────────────────────────────────────
function LogLine({ entry }) {
  const colors = {
    player:  'text-emerald-600',
    enemy:   'text-red-500',
    effect:  'text-amber-500',
    faint:   'text-orange-500',
    system:  'text-blue-500',
    damage:  'text-slate-600',
    miss:    'text-slate-400',
    info:    'text-slate-500',
  };
  return (
    <p className={`text-[9px] leading-relaxed animate-fade-in ${colors[entry.type] || colors.info}`}
       style={{ fontFamily: "'Press Start 2P', monospace" }}>
      {entry.msg}
    </p>
  );
}
