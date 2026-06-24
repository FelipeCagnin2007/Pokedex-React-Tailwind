import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { usePageMeta } from '../hooks/usePageMeta';
import Spinner from '../components/ui/Spinner';

const TIER_COLORS = {
  0: { label: 'Mestre',    color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20', icon: '👑', minMmr: 1800 },
  1: { label: 'Diamante',  color: 'text-cyan-500',   bg: 'bg-cyan-50 dark:bg-cyan-900/20',     icon: '💎', minMmr: 1600 },
  2: { label: 'Platina',   color: 'text-slate-400',  bg: 'bg-slate-50 dark:bg-slate-800',      icon: '🏅', minMmr: 1400 },
  3: { label: 'Ouro',      color: 'text-amber-500',  bg: 'bg-amber-50 dark:bg-amber-900/20',   icon: '🥇', minMmr: 1200 },
  4: { label: 'Prata',     color: 'text-slate-300',  bg: 'bg-slate-50 dark:bg-slate-800',      icon: '🥈', minMmr: 1000 },
  default: { label: 'Bronze', color: 'text-amber-700', bg: 'bg-orange-50 dark:bg-orange-900/20', icon: '🥉', minMmr: 0 },
};

function getTier(mmr) {
  if (mmr >= 1800) return TIER_COLORS[0];
  if (mmr >= 1600) return TIER_COLORS[1];
  if (mmr >= 1400) return TIER_COLORS[2];
  if (mmr >= 1200) return TIER_COLORS[3];
  if (mmr >= 1000) return TIER_COLORS[4];
  return TIER_COLORS.default;
}

export default function RankingPage() {
  usePageMeta('Ranking Global', 'Os melhores treinadores Pokémon do mundo!');
  const { user, profile } = useAuth();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, mmr, wins, losses')
          .order('mmr', { ascending: false })
          .limit(100);
        if (error) throw error;
        setPlayers(data || []);
      } catch (err) {
        setError('Não foi possível carregar o ranking. Verifique sua conexão.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();

    // Real-time updates
    const channel = supabase
      .channel('leaderboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchLeaderboard)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const myRank = user ? players.findIndex(p => p.id === user.id) + 1 : 0;

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">🏆 Ranking Global</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Top 100 treinadores por MMR</p>
        </div>
        <div className="flex gap-2">
          {myRank > 0 && (
            <span className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl text-sm font-bold">
              Sua posição: #{myRank}
            </span>
          )}
          <Link to="/battle" className="btn-ghost text-sm">← Batalhar</Link>
        </div>
      </div>

      {/* Tier legend */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.values(TIER_COLORS).filter(t => t.minMmr !== undefined).map(tier => (
          <span key={tier.label} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${tier.bg} ${tier.color}`}>
            {tier.icon} {tier.label} ({tier.minMmr}+)
          </span>
        ))}
      </div>

      {loading && <Spinner text="Carregando ranking..." />}
      {error && (
        <div className="card p-6 text-center text-red-500">
          <p className="text-2xl mb-2">⚠️</p>
          <p className="text-sm">{error}</p>
          <p className="text-xs text-slate-400 mt-2">Configure o Supabase para ver o ranking ao vivo.</p>
        </div>
      )}

      {!loading && !error && (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-slate-500 font-semibold uppercase tracking-wide">#</th>
                <th className="text-left px-4 py-3 text-xs text-slate-500 font-semibold uppercase tracking-wide">Treinador</th>
                <th className="text-right px-4 py-3 text-xs text-slate-500 font-semibold uppercase tracking-wide">MMR</th>
                <th className="text-right px-4 py-3 text-xs text-slate-500 font-semibold uppercase tracking-wide hidden sm:table-cell">V/D</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {players.map((player, idx) => {
                const tier = getTier(player.mmr);
                const isMe = player.id === user?.id;
                return (
                  <tr
                    key={player.id}
                    className={`transition-colors ${isMe ? 'bg-red-50 dark:bg-red-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                  >
                    <td className="px-4 py-3 font-bold text-slate-500 dark:text-slate-400 w-12">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg ${tier.color}`}>{tier.icon}</span>
                        <div>
                          <span className={`font-semibold ${isMe ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                            {player.username}
                          </span>
                          {isMe && <span className="ml-2 text-[10px] text-red-500 font-bold">VOCÊ</span>}
                          <div className={`text-[10px] font-semibold ${tier.color}`}>{tier.label}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-bold text-lg ${tier.color}`}>{player.mmr}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-400 hidden sm:table-cell">
                      <span className="text-emerald-500">{player.wins}V</span>{' '}
                      <span className="text-red-400">{player.losses}D</span>
                    </td>
                  </tr>
                );
              })}
              {players.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-12 text-center text-slate-400 text-sm">
                    Nenhum treinador no ranking ainda. Seja o primeiro! 🏆
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
