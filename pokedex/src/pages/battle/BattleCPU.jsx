import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBattle } from '../../context/BattleContext';
import { useSeason } from '../../context/SeasonContext';
import { generateRandomTeam } from '../../battle/teamGenerator';
import BattleArena from './BattleArena';
import Spinner from '../../components/ui/Spinner';
import { usePageMeta } from '../../hooks/usePageMeta';
import { Gamepad2, Swords, Bot, AlertTriangle } from 'lucide-react';

const DIFFICULTIES = [
  { id: 'easy',   label: 'Fácil',   desc: 'Moves aleatórios. Bom para aprender.', color: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400' },
  { id: 'normal', label: 'Normal',  desc: 'CPU prefere tipos efetivos. Desafiador.', color: 'border-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400' },
  { id: 'hard',   label: 'Difícil', desc: 'CPU sempre usa o melhor move possível.', color: 'border-red-400 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400' },
];

export default function BattleCPU() {
  usePageMeta('Batalha vs CPU', 'Enfrente a inteligência artificial Pokémon em três dificuldades.');
  const { selectedTeam, difficulty, setDifficulty } = useBattle();
  const { currentSeason, validate } = useSeason();
  const [cpuTeam, setCpuTeam] = useState([]);
  const [mode, setMode] = useState('normal'); // 'normal' | 'seasonal'
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  async function generateCPUTeam() {
    if (mode === 'seasonal') {
      const violations = validate(selectedTeam);
      if (violations.length > 0) {
        return alert('Sua equipe é inválida para Batalha Sazonal:\n\n' + violations.join('\n'));
      }
    }

    setLoading(true);
    try {
      const team = await generateRandomTeam(mode === 'seasonal' ? currentSeason : null);
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
        <div className="mb-6 flex justify-center text-yellow-500"><AlertTriangle size={64} /></div>
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
      <p className="text-slate-500 dark:text-slate-400 mb-8">Configure a dificuldade, o modo e inicie a batalha.</p>

      {/* Mode Selection */}
      {currentSeason && (
        <div className="mb-6">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-3">Modo de Jogo</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setMode('normal')}
              className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all ${
                mode === 'normal'
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
              }`}
            >
              <Gamepad2 size={18} /> Normal
            </button>
            <button
              onClick={() => setMode('seasonal')}
              className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all ${
                mode === 'seasonal'
                  ? 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
              }`}
            >
              {currentSeason.emoji} Sazonal ({currentSeason.name})
            </button>
          </div>
        </div>
      )}

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
        <button onClick={() => setStarted(true)} className="btn-battle w-full text-lg py-4 flex items-center justify-center gap-2">
          <Swords size={20} /> Começar batalha!
        </button>
      ) : loading ? (
        <Spinner text="Gerando equipe do CPU..." />
      ) : (
        <button onClick={generateCPUTeam} className="btn-primary w-full text-base py-3 flex items-center justify-center gap-2">
          <Bot size={18} /> Gerar equipe do CPU e batalhar
        </button>
      )}
    </main>
  );
}
