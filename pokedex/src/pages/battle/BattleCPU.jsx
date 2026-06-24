import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBattle } from '../../context/BattleContext';
import { fetchPokemon, fetchPokemonById, fetchAPI } from '../../api/pokeapi';
import { buildBattlePokemon } from '../../battle/battleEngine';
import BattleArena from './BattleArena';
import Spinner from '../../components/ui/Spinner';
import { usePageMeta } from '../../hooks/usePageMeta';

const DIFFICULTIES = [
  { id: 'easy',   label: 'Fácil',   desc: 'Moves aleatórios. Bom para aprender.', color: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400' },
  { id: 'normal', label: 'Normal',  desc: 'CPU prefere tipos efetivos. Desafiador.', color: 'border-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400' },
  { id: 'hard',   label: 'Difícil', desc: 'CPU sempre usa o melhor move possível.', color: 'border-red-400 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400' },
];

export default function BattleCPU() {
  usePageMeta('Batalha vs CPU', 'Enfrente a inteligência artificial Pokémon em três dificuldades.');
  const { selectedTeam, difficulty, setDifficulty } = useBattle();
  const [cpuTeam, setCpuTeam] = useState([]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  async function generateCPUTeam() {
    setLoading(true);
    try {
      // Pick 6 random Pokémon from the first 386 (classic) 
      const picks = new Set();
      while (picks.size < 6) picks.add(Math.floor(Math.random() * 386) + 1);
      
      const team = await Promise.all([...picks].map(async id => {
        const poke = await fetchPokemonById(id);
        const moveRefs = (poke.moves || []).slice(0, 8);
        const moveDetails = await Promise.all(
          moveRefs.map(m => fetchAPI(m.move.url).catch(() => null))
        );
        const validMoves = moveDetails
          .filter(m => m && m.power !== null && m.power > 0)
          .slice(0, 4)
          .map(m => ({
            name: m.name,
            power: m.power || 40,
            accuracy: m.accuracy || 100,
            pp: m.pp || 10,
            type: m.type,
            damage_class: m.damage_class,
          }));

        return buildBattlePokemon(poke, validMoves.length >= 2 ? validMoves : validMoves.concat([{
          name: 'tackle',
          power: 40,
          accuracy: 100,
          pp: 35,
          type: { name: 'normal' },
          damage_class: { name: 'physical' },
        }]).slice(0, 4));
      }));

      setCpuTeam(team);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (selectedTeam.length < 6) {
    return (
      <main className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Equipe incompleta</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Você precisa selecionar 6 Pokémon antes de batalhar.
          Atualmente tem <strong>{selectedTeam.length}/6</strong>.
        </p>
        <Link to="/battle/select" className="btn-primary">Selecionar equipe →</Link>
      </main>
    );
  }

  if (started && cpuTeam.length === 6) {
    return <BattleArena mode="cpu" enemyTeam={cpuTeam} />;
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <Link to="/battle" className="btn-ghost mb-6 inline-flex">← Voltar ao Lobby</Link>

      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">VS Computador</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">Configure a dificuldade e inicie a batalha.</p>

      {/* Difficulty */}
      <div className="mb-8">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-3">Dificuldade</h2>
        <div className="grid grid-cols-3 gap-3">
          {DIFFICULTIES.map(d => (
            <button
              key={d.id}
              onClick={() => setDifficulty(d.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                difficulty === d.id
                  ? d.color + ' border-current'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
              }`}
            >
              <p className="font-bold text-sm mb-1">{d.label}</p>
              <p className="text-xs opacity-70 leading-snug">{d.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Player team preview */}
      <div className="card p-5 mb-6">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Sua equipe</h2>
        <div className="grid grid-cols-6 gap-2">
          {selectedTeam.map(p => (
            <div key={p.id} className="flex flex-col items-center gap-1">
              <img src={p.sprite} alt={p.name} className="w-12 h-12 object-contain" />
              <p className="text-[10px] text-slate-600 dark:text-slate-400 capitalize truncate w-full text-center">{p.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Start */}
      {cpuTeam.length === 6 ? (
        <button onClick={() => setStarted(true)} className="btn-battle w-full text-lg py-4">
          ⚔️ Começar batalha!
        </button>
      ) : loading ? (
        <Spinner text="Gerando equipe do CPU..." />
      ) : (
        <button onClick={generateCPUTeam} className="btn-primary w-full text-base py-3">
          🤖 Gerar equipe do CPU e batalhar
        </button>
      )}
    </main>
  );
}
