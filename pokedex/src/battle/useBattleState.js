import { useState, useCallback, useRef } from 'react';
import { calculateDamage, cpuChooseMove, effectivenessLabel } from './battleEngine';

const PHASES = {
  IDLE:     'idle',
  PLAYER:   'player_turn',
  CPU:      'cpu_turn',
  ANIMATING:'animating',
  SWITCH:   'switch',
  GAME_OVER:'game_over',
};

function createLog(msg, type = 'info') {
  return { id: Date.now() + Math.random(), msg, type };
}

export function useBattleState({ mode = 'cpu', difficulty = 'normal' } = {}) {
  const [playerTeam, setPlayerTeam]   = useState([]);
  const [enemyTeam,  setEnemyTeam]    = useState([]);
  const [playerIdx,  setPlayerIdx]    = useState(0);
  const [enemyIdx,   setEnemyIdx]     = useState(0);
  const [phase,      setPhase]        = useState(PHASES.IDLE);
  const [log,        setLog]          = useState([]);
  const [winner,     setWinner]       = useState(null);
  const [animation,  setAnimation]    = useState(null);

  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const addLog = useCallback((msg, type = 'info') => {
    setLog(prev => [...prev.slice(-40), createLog(msg, type)]);
  }, []);

  const playerPoke = playerTeam[playerIdx];
  const enemyPoke  = enemyTeam[enemyIdx];

  const initBattle = useCallback((pTeam, eTeam) => {
    setPlayerTeam(pTeam.map(p => ({ ...p })));
    setEnemyTeam(eTeam.map(p => ({ ...p })));
    setPlayerIdx(0);
    setEnemyIdx(0);
    setLog([createLog('🏟️ Batalha iniciada! Escolha um move!', 'system')]);
    setWinner(null);
    setAnimation(null);
    setPhase(PHASES.PLAYER);
  }, []);

  const delay = ms => new Promise(res => setTimeout(res, ms));

  // ─── Core Battle Engine (Turn Queue System) ──────────────────────────────
  const resolveTurn = async (playerAction) => {
    if (phaseRef.current !== PHASES.PLAYER) return;
    setPhase(PHASES.ANIMATING);

    // Create local drafts for the turn sequence
    const pTeam = playerTeam.map(p => ({ ...p }));
    const eTeam = enemyTeam.map(p => ({ ...p }));
    let pIdx = playerIdx;
    let eIdx = enemyIdx;

    const syncState = () => {
      setPlayerTeam([...pTeam]);
      setEnemyTeam([...eTeam]);
      setPlayerIdx(pIdx);
      setEnemyIdx(eIdx);
    };

    // 1. CPU decides its action
    const cpuMove = cpuChooseMove(eTeam[eIdx], pTeam[pIdx], difficulty);
    const enemyAction = cpuMove ? { type: 'attack', move: cpuMove } : { type: 'skip' };

    // 2. Queue and sort actions (Switch > Speed)
    let actions = [];
    if (playerAction.type === 'switch') {
      actions.push({ actor: 'player', ...playerAction });
      actions.push({ actor: 'enemy', ...enemyAction });
    } else {
      const pSpeed = pTeam[pIdx].stats?.speed || 50;
      const eSpeed = eTeam[eIdx].stats?.speed || 50;
      if (pSpeed > eSpeed || (pSpeed === eSpeed && Math.random() > 0.5)) {
        actions.push({ actor: 'player', ...playerAction });
        actions.push({ actor: 'enemy', ...enemyAction });
      } else {
        actions.push({ actor: 'enemy', ...enemyAction });
        actions.push({ actor: 'player', ...playerAction });
      }
    }

    // 3. Execute actions sequentially
    for (const act of actions) {
      if (act.type === 'skip') continue;

      const isPlayer = act.actor === 'player';
      const actorPoke = isPlayer ? pTeam[pIdx] : eTeam[eIdx];
      
      // If actor died from a previous action in the queue, skip their turn!
      if (actorPoke.currentHp <= 0) continue;

      // Ensure target is still the currently active opponent (can change if they died/switched)
      const targetPoke = isPlayer ? eTeam[eIdx] : pTeam[pIdx];

      if (act.type === 'switch') {
        const oldName = actorPoke.name;
        if (isPlayer) pIdx = act.index;
        else eIdx = act.index;
        
        const newName = isPlayer ? pTeam[pIdx].name : eTeam[eIdx].name;
        addLog(`${oldName} voltou! ${newName}, vai à luta!`, 'system');
        syncState();
        await delay(800);
        continue;
      }

      if (act.type === 'attack') {
        const move = act.move;
        // Re-calculate damage with exact current states
        const { damage, critical, effectiveness, hit } = calculateDamage(actorPoke, targetPoke, move);
        const effLabel = effectivenessLabel(effectiveness);

        if (!hit) {
          addLog(`${actorPoke.name} usou ${move.name} — mas errou!`, 'miss');
        } else {
          const critText = critical ? ' 💥 Golpe crítico!' : '';
          addLog(`${actorPoke.name} usou ${move.name}!${critText}`, isPlayer ? 'player' : 'enemy');
          if (effLabel) addLog(effLabel.text, 'effect');
          addLog(`Causou ${damage} de dano ao ${targetPoke.name}.`, 'damage');
          
          targetPoke.currentHp = Math.max(0, targetPoke.currentHp - damage);
        }
        
        setAnimation({ target: isPlayer ? 'enemy' : 'player', type: hit ? 'hit' : 'miss' });
        syncState();
        await delay(800);
        setAnimation(null);

        // Check if target fainted
        if (targetPoke.currentHp <= 0) {
          addLog(`${targetPoke.name} desmaiou!`, 'faint');
          syncState();
          await delay(800);
          
          // Auto-replace fainted Pokémon
          if (isPlayer) {
            const nextIdx = pTeam.findIndex(p => p.currentHp > 0);
            if (nextIdx === -1) {
              setWinner('enemy');
              setPhase(PHASES.GAME_OVER);
              addLog('😞 Você foi derrotado...', 'system');
              return;
            }
            pIdx = nextIdx;
            addLog(`${pTeam[pIdx].name} entrou em batalha!`, 'system');
            syncState();
            await delay(800);
          } else {
            const nextIdx = eTeam.findIndex(p => p.currentHp > 0);
            if (nextIdx === -1) {
              setWinner('player');
              setPhase(PHASES.GAME_OVER);
              addLog('🏆 Você venceu a batalha!', 'system');
              return;
            }
            eIdx = nextIdx;
            addLog(`${eTeam[eIdx].name} entrou em batalha!`, 'system');
            syncState();
            await delay(800);
          }
        }
      }
    }

    setPhase(PHASES.PLAYER);
  };

  const selectMove = (move) => {
    resolveTurn({ type: 'attack', move });
  };

  const switchPokemon = (idx) => {
    if (idx === playerIdx || playerTeam[idx]?.currentHp <= 0) return;
    resolveTurn({ type: 'switch', index: idx });
  };

  // For future PvP (Placeholder)
  const applyOpponentMove = () => {};

  return {
    playerTeam, enemyTeam,
    playerIdx, enemyIdx,
    playerPoke, enemyPoke,
    phase, log, winner, animation,
    PHASES,

    initBattle,
    selectMove,
    switchPokemon,
    applyOpponentMove,
    setEnemyTeam,
    setPhase,
  };
}
