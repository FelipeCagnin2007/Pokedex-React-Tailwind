import { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBattle } from '../../context/BattleContext';
import { usePeerBattle, PVP_MSG } from '../../battle/usePeerBattle';
import BattleArena from './BattleArena';
import TypeBadge from '../../components/ui/TypeBadge';
import { usePageMeta } from '../../hooks/usePageMeta';
import { ITEMS } from '../../data/items';

const STATUS_LABELS = {
  idle:         { text: 'Pronto para conectar', color: 'text-slate-400' },
  creating:     { text: 'Criando sala...', color: 'text-yellow-400' },
  waiting:      { text: '⏳ Aguardando oponente...', color: 'text-yellow-400' },
  connecting:   { text: 'Conectando...', color: 'text-blue-400' },
  connected:    { text: '✅ Conectado!', color: 'text-emerald-400' },
  error:        { text: 'Erro na conexão', color: 'text-red-400' },
  disconnected: { text: 'Desconectado', color: 'text-slate-500' },
};

const PREVIEW_TIME  = 30; // seconds for team preview
const WO_TIME       = 30; // seconds to auto W.O. after disconnect

export default function BattlePvP() {
  usePageMeta('Batalha PvP Online', 'Desafie um amigo em batalha Pokémon online via P2P.');
  const { selectedTeam } = useBattle();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const pvpMode = searchParams.get('mode') || 'normal'; // 'normal' | 'seasonal'
  const pvpMatch = searchParams.get('match') || 'group'; // 'group' | 'random'

  const [role, setRole] = useState(null); // 'host' | 'guest' | 'random'
  const [joinCode, setJoinCode] = useState('');
  const [opponentTeam, setOpponentTeam] = useState(null);
  const [myAction, setMyAction] = useState(null);
  const [opponentAction, setOpponentAction] = useState(null);
  const [opponentReady, setOpponentReady] = useState(false);
  const [iAmReady, setIAmReady] = useState(false);

  // Team Preview Phase
  const [previewPhase, setPreviewPhase] = useState(false); // show team preview
  const [previewTimer, setPreviewTimer] = useState(PREVIEW_TIME);
  const previewIntervalRef = useRef(null);

  // Battle
  const [started, setStarted] = useState(false);
  const arenaRef = useRef(null);

  // W.O. on disconnect
  const [woCountdown, setWoCountdown] = useState(null); // null or number
  const [woWin, setWoWin] = useState(false);
  const woIntervalRef = useRef(null);

  const handleDisconnect = useCallback(() => {
    if (started && !woWin) {
      // Start W.O. countdown
      let remaining = WO_TIME;
      setWoCountdown(remaining);
      woIntervalRef.current = setInterval(() => {
        remaining -= 1;
        setWoCountdown(remaining);
        if (remaining <= 0) {
          clearInterval(woIntervalRef.current);
          setWoWin(true);
          setWoCountdown(0);
        }
      }, 1000);
    }
  }, [started, woWin]);

  const handleMessage = useCallback((msg) => {
    switch (msg.type) {
      case PVP_MSG.TEAM_SYNC:
        setOpponentTeam(msg.payload.map(p => ({ ...p })));
        break;
      case PVP_MSG.READY:
        setOpponentReady(true);
        break;
      case PVP_MSG.ACTION:
        setOpponentAction(msg.payload);
        break;
      case PVP_MSG.REPLACE:
        if (arenaRef.current) arenaRef.current.forceOpponentSwitch(msg.payload);
        break;
      case PVP_MSG.FORFEIT:
        // Opponent forfeited immediately (no countdown)
        setWoWin(true);
        setWoCountdown(0);
        break;
      default: break;
    }
  }, []);

  const handleConnect = useCallback(() => {
    peer.sendMessage({ type: PVP_MSG.TEAM_SYNC, payload: selectedTeam });
  }, [selectedTeam]);

  const peer = usePeerBattle({
    onMessage: handleMessage,
    onConnect: handleConnect,
    onDisconnect: handleDisconnect,
  });

  // Auto-start random matchmaking
  useEffect(() => {
    if (pvpMatch === 'random' && !role && selectedTeam.length === 6) {
      setRole('random');
      peer.startRandomMatchmaking(pvpMode);
    }
  }, [pvpMatch, role, selectedTeam, peer, pvpMode]);

  // Both ready → start 30s team preview
  useEffect(() => {
    if (iAmReady && opponentReady && opponentTeam && !previewPhase && !started) {
      setPreviewPhase(true);
      setPreviewTimer(PREVIEW_TIME);

      let t = PREVIEW_TIME;
      previewIntervalRef.current = setInterval(() => {
        t -= 1;
        setPreviewTimer(t);
        if (t <= 0) {
          clearInterval(previewIntervalRef.current);
          setPreviewPhase(false);
          setStarted(true);
        }
      }, 1000);
    }
    return () => clearInterval(previewIntervalRef.current);
  }, [iAmReady, opponentReady, opponentTeam]);

  // Actions sync
  useEffect(() => {
    if (myAction && opponentAction && arenaRef.current) {
      arenaRef.current.resolvePvPTurn(myAction, opponentAction);
      setMyAction(null);
      setOpponentAction(null);
    }
  }, [myAction, opponentAction]);

  function handleReady() {
    peer.sendMessage({ type: PVP_MSG.READY });
    setIAmReady(true);
  }

  function handleSendAction(action) {
    setMyAction(action);
    peer.sendMessage({ type: PVP_MSG.ACTION, payload: action });
  }

  function handleSendReplace(idx) {
    peer.sendMessage({ type: PVP_MSG.REPLACE, payload: idx });
  }

  function dismissWo() {
    clearInterval(woIntervalRef.current);
    setWoCountdown(null);
    setWoWin(false);
    setStarted(false);
    setPreviewPhase(false);
    setOpponentTeam(null);
    setOpponentReady(false);
    setIAmReady(false);
    setMyAction(null);
    setOpponentAction(null);
    setMyAction(null);
    setOpponentAction(null);
    setRole(null);
  }

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(peer.roomId || '');
    } catch { /* fallback */ }
  }

  // ── Not enough pokemon guard ──────────────────────────────────────────────
  if (selectedTeam.length < 6) {
    return (
      <main className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Equipe incompleta</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Você precisa selecionar 6 Pokémon antes de batalhar.
        </p>
        <Link to="/battle/select" className="btn-primary">Selecionar equipe →</Link>
      </main>
    );
  }

  // ── W.O. overlay ──────────────────────────────────────────────────────────
  if (woCountdown !== null || woWin) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="card p-10 text-center max-w-md w-full mx-4 animate-bounce-in">
          {woWin ? (
            <>
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                W.O.!
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                Oponente desconectou. Vitória por W.O.!
              </p>
              <button onClick={dismissWo} className="btn-battle px-8">
                ← Voltar ao Lobby
              </button>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">📡</div>
              <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                Oponente desconectou
              </h2>
              <div className={`text-5xl font-bold mb-3 ${woCountdown <= 10 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`}
                style={{ fontFamily: "'Press Start 2P', monospace" }}>
                {woCountdown}s
              </div>
              <p className="text-slate-400 text-xs mb-6">
                Se não reconectar em {woCountdown}s, você vence por W.O.
              </p>
              <button onClick={dismissWo} className="btn-ghost text-sm">
                Desistir
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── Team Preview Phase ────────────────────────────────────────────────────
  if (previewPhase && opponentTeam) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center p-6 z-40">
        <div className="text-center mb-6">
          <h2 className="text-white font-bold text-xl mb-1" style={{ fontFamily: "'Press Start 2P', monospace" }}>
            PRÉVIA DAS EQUIPES
          </h2>
          <div className={`text-4xl font-bold ${previewTimer <= 10 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`}
            style={{ fontFamily: "'Press Start 2P', monospace" }}>
            {previewTimer}s
          </div>
          <p className="text-slate-400 text-xs mt-1">A batalha começa automaticamente</p>
        </div>

        <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
          {/* My team */}
          <div className="card p-4">
            <h3 className="text-sm font-bold text-emerald-400 mb-3">⚔️ Seu Time</h3>
            <div className="space-y-2">
              {selectedTeam.map((p) => (
                <div key={p.id} className="flex items-center gap-2">
                  <img src={p.sprite} alt={p.name} className="w-8 h-8 object-contain" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white capitalize truncate">{p.name}</p>
                    <div className="flex gap-1 flex-wrap">
                      {p.types.map(t => <TypeBadge key={t} type={t} small />)}
                    </div>
                  </div>
                  {p.item && <span className="text-base" title={p.item.name}>{p.item.icon}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Opponent team */}
          <div className="card p-4">
            <h3 className="text-sm font-bold text-red-400 mb-3">🛡️ Oponente</h3>
            <div className="space-y-2">
              {opponentTeam.map((p) => (
                <div key={p.id} className="flex items-center gap-2">
                  <img src={p.sprite} alt={p.name} className="w-8 h-8 object-contain" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white capitalize truncate">{p.name}</p>
                    <div className="flex gap-1 flex-wrap">
                      {p.types.map(t => <TypeBadge key={t} type={t} small />)}
                    </div>
                  </div>
                  {p.item && <span className="text-base" title={p.item.name}>{p.item.icon}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            clearInterval(previewIntervalRef.current);
            setPreviewPhase(false);
            setStarted(true);
          }}
          className="mt-6 btn-battle px-10"
        >
          ▶️ Iniciar Agora
        </button>
      </div>
    );
  }

  // ── Battle ────────────────────────────────────────────────────────────────
  if (started && opponentTeam) {
    return (
      <BattleArena
        ref={arenaRef}
        mode="pvp"
        enemyTeam={opponentTeam}
        onSendAction={handleSendAction}
        onSendReplace={handleSendReplace}
        waitingForOpponent={!!myAction && !opponentAction}
      />
    );
  }

  // ── Lobby ─────────────────────────────────────────────────────────────────
  const statusInfo = STATUS_LABELS[peer.status] || STATUS_LABELS.idle;

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <Link to="/battle" className="btn-ghost mb-6 inline-flex">← Voltar ao Lobby</Link>

      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
        {pvpMode === 'seasonal' ? '🏆 Batalha Sazonal' : '⚔️ Batalha PvP'} {pvpMatch === 'random' ? 'Aleatória' : 'com Amigo'}
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
        {pvpMatch === 'random' 
          ? 'Buscando oponente no mundo inteiro via matchmaking...'
          : 'Jogue contra um amigo via conexão P2P direta no navegador. Sem cadastro necessário.'}
      </p>

      {/* Random Matchmaking UI */}
      {role === 'random' && (
        <div className="card p-10 text-center flex flex-col items-center">
          <div className="text-6xl mb-6 animate-pulse">🌍</div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Procurando Oponente...
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-6">
            Aguarde enquanto encontramos outro jogador buscando uma partida no modo {pvpMode === 'seasonal' ? 'Sazonal' : 'Normal'}.
          </p>
          <div className={`px-4 py-2 rounded-full text-xs font-bold ${statusInfo.color} bg-slate-100 dark:bg-slate-800`}>
            {statusInfo.text}
          </div>
        </div>
      )}

      {/* Choose group mode (Host or Join) */}
      {!role && pvpMatch === 'group' && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => { setRole('host'); peer.createRoom(); }}
            className="card p-6 text-center hover:border-red-400 transition-all hover:-translate-y-1 cursor-pointer"
          >
            <div className="text-4xl mb-3">🏠</div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Criar Sala</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Gere um código e compartilhe com seu amigo</p>
          </button>
          <button
            onClick={() => setRole('guest')}
            className="card p-6 text-center hover:border-blue-400 transition-all hover:-translate-y-1 cursor-pointer"
          >
            <div className="text-4xl mb-3">🔗</div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Entrar em Sala</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Digite o código da sala do seu amigo</p>
          </button>
        </div>
      )}

      {/* Host mode */}
      {role === 'host' && pvpMatch === 'group' && (
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-900 dark:text-white">Sua Sala</h2>
            <span className={`text-sm font-medium ${statusInfo.color}`}>{statusInfo.text}</span>
          </div>

          {peer.roomId && (
            <div className="text-center mb-6">
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">Código da sala:</p>
              <div className="flex items-center justify-center gap-3">
                <span className="font-pixel text-3xl text-red-600 dark:text-red-400 tracking-widest">
                  {peer.roomId}
                </span>
                <button
                  onClick={copyRoomId}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors"
                  title="Copiar código"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              <p className="text-slate-400 text-xs mt-2">Compartilhe este código com seu amigo</p>
            </div>
          )}

          {peer.status === 'connected' && !iAmReady && (
            <button onClick={handleReady} className="btn-battle w-full">
              ✅ Estou pronto!
            </button>
          )}
          {iAmReady && !opponentReady && (
            <p className="text-center text-yellow-400 text-sm">Aguardando oponente confirmar...</p>
          )}
          {peer.error && (
            <p className="text-red-500 text-sm text-center mt-3">{peer.error}</p>
          )}
        </div>
      )}

      {/* Guest mode */}
      {role === 'guest' && pvpMatch === 'group' && peer.status === 'idle' && (
        <div className="card p-6 mb-6">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4">Entrar em Sala</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Código da sala (ex: ABC123)"
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-pixel tracking-widest uppercase outline-none focus:border-red-400 transition-colors"
            />
            <button
              onClick={() => peer.joinRoom(joinCode)}
              disabled={joinCode.length < 4}
              className="btn-primary"
            >
              Entrar
            </button>
          </div>
        </div>
      )}

      {role === 'guest' && peer.status !== 'idle' && (
        <div className="card p-6 mb-6 text-center">
          <span className={`text-lg font-bold ${statusInfo.color}`}>{statusInfo.text}</span>
          {peer.status === 'connected' && !iAmReady && (
            <button onClick={handleReady} className="btn-battle w-full mt-4">
              ✅ Estou pronto!
            </button>
          )}
          {iAmReady && !opponentReady && (
            <p className="text-yellow-400 text-sm mt-3">Aguardando oponente confirmar...</p>
          )}
          {peer.error && (
            <p className="text-red-500 text-sm mt-3">{peer.error}</p>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm">
        <p className="font-semibold text-blue-700 dark:text-blue-400 mb-1">💡 Como funciona</p>
        <ol className="text-blue-600 dark:text-blue-300 text-xs space-y-1 list-decimal list-inside">
          <li>Um jogador cria a sala e recebe um código de 6 caracteres</li>
          <li>O outro jogador digita o código e entra na sala</li>
          <li>Ambos confirmam que estão prontos</li>
          <li>Prévia das equipes por 30 segundos antes do combate</li>
          <li>Desconexão durante batalha → W.O. em 30s para o adversário</li>
        </ol>
      </div>
    </main>
  );
}
