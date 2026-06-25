import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { loadTeamFromCloud } from '../lib/teamService';
import Spinner from '../components/ui/Spinner';
import AvatarSelectorModal from '../components/ui/AvatarSelectorModal';
import { User, Trophy, Pencil, CloudOff } from 'lucide-react';

export default function ProfilePage() {
  usePageMeta('Meu Perfil', 'Visualize suas estatísticas e equipe salva.');
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [team, setTeam] = useState(null);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [isAvatarModalOpen, setAvatarModalOpen] = useState(false);

  const { updateAvatar } = useAuth();

  const handleAvatarSelect = async (url) => {
    const success = await updateAvatar(url);
    if (!success) alert('Erro ao atualizar avatar. Verifique se a coluna avatar_url existe no banco.');
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadTeamFromCloud(user.id).then(t => {
        setTeam(t);
        setLoadingTeam(false);
      });
    }
  }, [user]);

  if (authLoading || !profile) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-20 flex justify-center">
        <Spinner text="Carregando perfil..." />
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header / Basic Info */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center md:items-start gap-6 border border-slate-100 dark:border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-red-500 to-orange-500 opacity-20 dark:opacity-10 pointer-events-none"></div>
        
        <button 
          onClick={() => setAvatarModalOpen(true)}
          className="relative z-10 w-24 h-24 sm:w-32 sm:h-32 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-inner border-4 border-white dark:border-slate-800 flex-shrink-0 group overflow-hidden transition-transform hover:scale-105"
          title="Alterar Avatar"
        >
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-contain p-2 drop-shadow-md" />
          ) : (
            <User size={48} className="group-hover:opacity-50 transition-opacity" />
          )}
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Pencil className="text-white drop-shadow-md" size={24} />
          </div>
        </button>
        
        <div className="relative z-10 flex-1 min-w-0 text-center md:text-left">
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white capitalize tracking-wide truncate max-w-full" title={profile.username}>
            {profile.username}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 truncate">{user.email}</p>
          
          <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/30 flex items-center gap-2">
              <Trophy size={20} className="text-amber-500" />
              <div>
                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">Pontos MMR</p>
                <p className="text-lg font-black text-amber-700 dark:text-amber-500 leading-none">{profile.mmr}</p>
              </div>
            </div>
            
            <Link to="/ranking" className="btn-ghost text-sm">
              Ver Ranking Global →
            </Link>
          </div>
        </div>

        <button 
          onClick={() => { signOut(); navigate('/'); }}
          className="relative z-10 btn-ghost text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          Sair da Conta
        </button>
      </div>

      {/* Team Info */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Minha Equipe (Nuvem)</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Esta é a equipe salva no seu perfil. Use o menu de batalha para alterá-la.</p>
          </div>
          <Link to="/battle/select" className="btn-secondary text-sm whitespace-nowrap flex items-center gap-1.5">
            <Pencil size={14} /> Editar Equipe
          </Link>
        </div>

        {loadingTeam ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : team && team.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {team.map((poke, i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-3 flex flex-col items-center border border-slate-200 dark:border-slate-600">
                <img src={poke.sprite} alt={poke.name} className="w-16 h-16 object-contain drop-shadow-md mb-2" />
                <p className="text-xs font-bold capitalize text-slate-800 dark:text-slate-200 truncate w-full text-center">
                  {poke.name}
                </p>
                {poke.item && (
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate w-full text-center mt-1" title={poke.item.name}>
                    {poke.item.icon} {poke.item.name}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center">
            <CloudOff size={40} className="mb-3 text-slate-400" />
            <p className="text-slate-600 dark:text-slate-400 font-medium">Nenhuma equipe salva na nuvem.</p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">Monte sua equipe e clique em "Salvar Time".</p>
            <Link to="/battle/select" className="btn-primary text-sm inline-block">
              Montar Equipe Agora
            </Link>
          </div>
        )}
      </div>

      <AvatarSelectorModal
        isOpen={isAvatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        onSelect={handleAvatarSelect}
      />
    </main>
  );
}
