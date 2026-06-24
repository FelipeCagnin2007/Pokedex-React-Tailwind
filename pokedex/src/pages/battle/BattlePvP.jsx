import { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useBattle } from '../../context/BattleContext';
import { usePeerBattle, PVP_MSG } from '../../battle/usePeerBattle';
import { buildBattlePokemon } from '../../battle/battleEngine';
import BattleArena from './BattleArena';
import { usePageMeta } from '../../hooks/usePageMeta';

const STATUS_LABELS = {
  idle:         { text: 'Pronto para conectar', color: 'text-slate-400' },
  creating:     { text: 'Criando sala...', color: 'text-yellow-400' },
  waiting:      { text: '⏳ Aguardando oponente...', color: 'text-yellow-400' },
  connecting:   { text: 'Conectando...', color: 'text-blue-400' },
  connected:    { text: '✅ Conectado!', color: 'text-emerald-400' },
  error:        { text: 'Erro na conexão', color: 'text-red-400' },
  disconnected: { text: 'Desconectado', color: 'text-slate-500' },
};

export default function BattlePvP() {
  usePageMeta('Batalha PvP Online', 'Desafie um amigo em batalha Pokémon online via P2P.');
  const { selectedTeam } = useBattle();
  const [mode, setMode] = useState(null); // 'host' | 'guest'
  const [joinCode, setJoinCode] = useState('');
  const [opponentTeam, setOpponentTeam] = useState(null);
  const [myAction, setMyAction] = useState(null);
  const [opponentAction, setOpponentAction] = useState(null);
  const [opponentReady, setOpponentReady] = useState(false);
  const [iAmReady, setIAmReady] = useState(false);
  const [started, setStarted] = useState(false);
  const arenaRef = useRef(null);

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
        alert('Oponente desistiu da batalha!');
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
  });

  useEffect(() => {
    if (iAmReady && opponentReady && opponentTeam && !started) {
      setStarted(true);
    }
  }, [iAmReady, opponentReady, opponentTeam, started]);

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

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(peer.roomId || '');
    } catch {
      // fallback
    }
  }

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

  const statusInfo = STATUS_LABELS[peer.status] || STATUS_LABELS.idle;

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <Link to="/battle" className="btn-ghost mb-6 inline-flex">← Voltar ao Lobby</Link>

      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">⚔️ Batalha PvP Online</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
        Jogue contra um amigo via conexão P2P direta no navegador. Sem cadastro necessário.
      </p>

      {/* Choose mode */}
      {!mode && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => { setMode('host'); peer.createRoom(); }}
            className="card p-6 text-center hover:border-red-400 transition-all hover:-translate-y-1 cursor-pointer"
          >
            <div className="text-4xl mb-3">🏠</div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Criar Sala</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Gere um código e compartilhe com seu amigo</p>
          </button>
          <button
            onClick={() => setMode('guest')}
            className="card p-6 text-center hover:border-blue-400 transition-all hover:-translate-y-1 cursor-pointer"
          >
            <div className="text-4xl mb-3">🔗</div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Entrar em Sala</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Digite o código da sala do seu amigo</p>
          </button>
        </div>
      )}

      {/* Host mode */}
      {mode === 'host' && (
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
      {mode === 'guest' && peer.status === 'idle' && (
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

      {mode === 'guest' && peer.status !== 'idle' && (
        <div className="card p-6 mb-6 text-center">
          <span className={`text-lg font-bold ${statusInfo.color}`}>{statusInfo.text}</span>
          {peer.status === 'connected' && !iAmReady && (
            <button onClick={handleReady} className="btn-battle w-full mt-4">
              ✅ Estou pronto!
            </button>
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
          <li>A batalha começa com as equipes de 6 Pokémon selecionadas</li>
        </ol>
      </div>
    </main>
  );
}
