import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: authError } = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password, username);
      
      if (authError) throw authError;
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 py-20">
      <div className="bg-white p-6 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center font-pixel">
          {isLogin ? 'Login do Treinador' : 'Novo Treinador'}
        </h1>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Nome de Treinador</label>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Ex: Ash Ketchum"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3"
          >
            {loading ? 'Carregando...' : (isLogin ? 'ENTRAR' : 'REGISTRAR')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 font-bold hover:underline"
          >
            {isLogin ? 'Crie uma' : 'Faça login'}
          </button>
        </p>
      </div>
    </main>
  );
}
