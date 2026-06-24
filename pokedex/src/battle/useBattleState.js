import { useState, useCallback, useRef } from 'react';
import { calculateDamage, cpuChooseMove, effectivenessLabel } from './battleEngine';

const PHASES = {
  IDLE:     'idle',
  PLAYER:   'player_turn',
  CPU:      'cpu_turn',
  ANIMATING:'animating',
  SWITCH:   'switch',
  GAME_OVER:'game_over',
  FORCE_SWITCH: 'force_switch',
  WAIT_OPPONENT_SWITCH: 'wait_opponent_switch'
};

function createLog(msg, type = 'info') {
  return { id: Date.now() + Math.random(), msg, type };
}

// ─── Item effects ──────────────────────────────────────────────────────────────
function applyPostAttackItems(attacker, log) {
  if (!attacker.item) return;
  if (attacker.item.id === 'life_orb') {
    const recoil = Math.max(1, Math.floor(attacker.maxHp * 0.1));
    attacker.currentHp = Math.max(0, attacker.currentHp - recoil);
    log(`${attacker.name} perdeu ${recoil} HP pelo Orbe da Vida!`, 'effect');
  }
}

function applyFocusSash(defender, damage) {
  if (defender.item?.id === 'focus_sash' && defender.currentHp === defender.maxHp) {
    if (damage >= defender.currentHp) {
      defender.item = null; // consumed
      return defender.currentHp - 1;
    }
  }
  return damage;
}

function applyEndOfTurnItems(pokemon, log) {
  if (!pokemon.item || pokemon.currentHp <= 0) return;
  if (pokemon.item.id === 'leftovers') {
    const heal = Math.max(1, Math.floor(pokemon.maxHp / 16));
    pokemon.currentHp = Math.min(pokemon.maxHp, pokemon.currentHp + heal);
    log(`${pokemon.name} recuperou ${heal} HP com os Restos!`, 'effect');
  }
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
  const [turnCount,  setTurnCount]    = useState(0);

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
    setTurnCount(0);
    setLog([createLog('🏟️ Batalha iniciada! Escolha um move!', 'system')]);
    setWinner(null);
    setAnimation(null);
    setPhase(PHASES.PLAYER);
  }, []);

  const delay = ms => new Promise(res => setTimeout(res, ms));

  // ─── Core Battle Engine (Turn Queue System) ──────────────────────────────
  const resolveTurn = async (playerAction, providedEnemyAction = null) => {
    if (phaseRef.current !== PHASES.PLAYER) return;
    setPhase(PHASES.ANIMATING);

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

    // Check turn 100 draw condition
    const newTurnCount = turnCount + 1;
    setTurnCount(newTurnCount);
    if (newTurnCount >= 100) {
      const playerAlive = pTeam.filter(p => p.currentHp > 0).length;
      const enemyAlive  = eTeam.filter(p => p.currentHp > 0).length;
      addLog('⏰ Turno 100 atingido! Fim de jogo por limite de turnos!', 'system');
      if (playerAlive > enemyAlive)     { setWinner('player'); addLog('🏆 Você venceu por ter mais Pokémon vivos!', 'system'); }
      else if (enemyAlive > playerAlive){ setWinner('enemy');  addLog('😞 Derrota por ter menos Pokémon vivos...', 'system'); }
      else                              { setWinner('draw');   addLog('🤝 Empate!', 'system'); }
      setPhase(PHASES.GAME_OVER);
      return;
    }

    // 1. CPU or PvP decides its action
    const currentEnemy = eTeam[eIdx];
    let enemyAction;
    if (providedEnemyAction) {
      enemyAction = { ...providedEnemyAction, actorId: currentEnemy.id };
    } else {
      const cpuMove = cpuChooseMove(currentEnemy, pTeam[pIdx], difficulty);
      enemyAction = cpuMove ? { type: 'attack', move: cpuMove, actorId: currentEnemy.id } : { type: 'skip' };
    }

    // 2. Queue and sort actions (Switch > Speed)
    let actions = [];
    if (playerAction.type === 'switch') {
      actions.push({ actor: 'player', actorId: pTeam[pIdx].id, ...playerAction });
      actions.push({ actor: 'enemy',  actorId: currentEnemy.id, ...enemyAction });
    } else {
      const pSpeed = pTeam[pIdx].stats?.speed || 50;
      const eSpeed = eTeam[eIdx].stats?.speed || 50;
      const pEffSpeed = pTeam[pIdx].item?.id === 'choice_scarf' ? pSpeed * 1.5 : pSpeed;
      const eEffSpeed = eTeam[eIdx].item?.id === 'choice_scarf' ? eSpeed * 1.5 : eSpeed;
      const pAction = { actor: 'player', actorId: pTeam[pIdx].id, ...playerAction };
      const eAction = { actor: 'enemy',  actorId: currentEnemy.id, ...enemyAction };
      if (pEffSpeed > eEffSpeed || (pEffSpeed === eEffSpeed && Math.random() > 0.5)) {
        actions.push(pAction, eAction);
      } else {
        actions.push(eAction, pAction);
      }
    }

    // 3. Execute actions sequentially
    for (const act of actions) {
      if (act.type === 'skip') continue;

      const isPlayer  = act.actor === 'player';
      const actorPoke = isPlayer ? pTeam[pIdx] : eTeam[eIdx];
      if (actorPoke.id !== act.actorId) continue;
      if (actorPoke.currentHp <= 0) continue;

      const targetPoke = isPlayer ? eTeam[eIdx] : pTeam[pIdx];

      if (act.type === 'switch') {
        const oldName = actorPoke.name;
        if (isPlayer) pIdx = act.index; else eIdx = act.index;
        const newName = isPlayer ? pTeam[pIdx].name : eTeam[eIdx].name;
        addLog(`${oldName} voltou! ${newName}, vai à luta!`, 'system');
        syncState();
        await delay(800);
        continue;
      }

      if (act.type === 'attack') {
        const move = act.move;

        // Choice Band / Specs damage boost (handled by _atkBoost flag in calculateDamage)
        let boostedMove = { ...move };
        if (actorPoke.item?.id === 'choice_band'  && move.damage_class?.name === 'physical') boostedMove._atkBoost = 1.5;
        if (actorPoke.item?.id === 'choice_specs' && move.damage_class?.name === 'special')  boostedMove._atkBoost = 1.5;

        let { damage, critical, effectiveness, hit } = calculateDamage(actorPoke, targetPoke, boostedMove);
        const effLabel = effectivenessLabel(effectiveness);

        if (!hit) {
          addLog(`${actorPoke.name} usou ${move.name} — mas errou!`, 'miss');
        } else {
          const critText = critical ? ' 💥 Golpe crítico!' : '';
          addLog(`${actorPoke.name} usou ${move.name}!${critText}`, isPlayer ? 'player' : 'enemy');
          if (effLabel) addLog(effLabel.text, 'effect');

          damage = applyFocusSash(targetPoke, damage);
          addLog(`Causou ${damage} de dano ao ${targetPoke.name}.`, 'damage');
          targetPoke.currentHp = Math.max(0, targetPoke.currentHp - damage);

          // Life Orb recoil
          applyPostAttackItems(actorPoke, addLog);

          // Rocky Helmet counter-damage
          if (targetPoke.item?.id === 'rocky_helmet' && move.damage_class?.name === 'physical') {
            const helmDmg = Math.max(1, Math.floor(actorPoke.maxHp / 6));
            actorPoke.currentHp = Math.max(0, actorPoke.currentHp - helmDmg);
            addLog(`${actorPoke.name} foi ferido pelo Capacete Pedregoso! (${helmDmg})`, 'effect');
          }
        }

        setAnimation({ target: isPlayer ? 'enemy' : 'player', type: hit ? 'hit' : 'miss' });
        syncState();
        await delay(800);
        setAnimation(null);

        // Check if attacker died from recoil
        if (actorPoke.currentHp <= 0) {
          addLog(`${actorPoke.name} desmaiou pelo recuo!`, 'faint');
          syncState();
          await delay(600);
          if (isPlayer) {
            const next = pTeam.findIndex(p => p.currentHp > 0);
            if (next === -1) { setWinner('enemy'); setPhase(PHASES.GAME_OVER); addLog('😞 Você foi derrotado...', 'system'); return; }
            setPhase(PHASES.FORCE_SWITCH); return;
          } else {
            const next = eTeam.findIndex(p => p.currentHp > 0);
            if (next === -1) { setWinner('player'); setPhase(PHASES.GAME_OVER); addLog('🏆 Você venceu a batalha!', 'system'); return; }
            eIdx = next; addLog(`${eTeam[eIdx].name} entrou em batalha!`, 'system'); syncState(); await delay(800);
          }
        }

        // Check if target fainted
        if (targetPoke.currentHp <= 0) {
          addLog(`${targetPoke.name} desmaiou!`, 'faint');
          syncState();
          await delay(800);
          if (!isPlayer) {
            const next = pTeam.findIndex(p => p.currentHp > 0);
            if (next === -1) { setWinner('enemy'); setPhase(PHASES.GAME_OVER); addLog('😞 Você foi derrotado...', 'system'); return; }
            setPhase(PHASES.FORCE_SWITCH); return;
          } else {
            const next = eTeam.findIndex(p => p.currentHp > 0);
            if (next === -1) { setWinner('player'); setPhase(PHASES.GAME_OVER); addLog('🏆 Você venceu a batalha!', 'system'); return; }
            if (mode === 'pvp') { setPhase(PHASES.WAIT_OPPONENT_SWITCH); return; }
            eIdx = next; addLog(`${eTeam[eIdx].name} entrou em batalha!`, 'system'); syncState(); await delay(800);
          }
        }
      }
    }

    // 4. End-of-turn effects (Leftovers, etc.)
    applyEndOfTurnItems(pTeam[pIdx], addLog);
    applyEndOfTurnItems(eTeam[eIdx], addLog);
    syncState();

    setPhase(PHASES.PLAYER);
  };

  const selectMove   = (move) => resolveTurn({ type: 'attack', move });
  const switchPokemon = (idx) => {
    if (idx === playerIdx || playerTeam[idx]?.currentHp <= 0) return;
    resolveTurn({ type: 'switch', index: idx });
  };
  const forceSwitch = (idx) => {
    setPlayerIdx(idx);
    addLog(`Vai, ${playerTeam[idx].name}!`, 'system');
    setPhase(PHASES.PLAYER);
  };
  const forceOpponentSwitch = (idx) => {
    setEnemyIdx(idx);
    addLog(`Oponente enviou ${enemyTeam[idx].name}!`, 'system');
    setPhase(PHASES.PLAYER);
  };
  const resolvePvPTurn = (playerAction, enemyAction) => resolveTurn(playerAction, enemyAction);

  return {
    playerTeam, enemyTeam,
    playerIdx, enemyIdx,
    playerPoke, enemyPoke,
    phase, log, winner, animation, turnCount,
    PHASES,
    initBattle, selectMove, switchPokemon,
    forceSwitch, forceOpponentSwitch, resolvePvPTurn,
    setEnemyTeam, setPhase,
  };
}
