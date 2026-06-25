import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { AuthProvider } from './context/AuthContext';
import { SeasonProvider } from './context/SeasonContext';
import { BattleProvider } from './context/BattleContext';
import { Frown } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Pages
import Home from './pages/Home';
import Contests from './pages/Contests';
import Encounters from './pages/Encounters';
import Games from './pages/Games';
import Items from './pages/Items';
import Locations from './pages/Locations';
import Machines from './pages/Machines';
import Moves from './pages/Moves';
import Pokemon from './pages/Pokemon';
import PokemonDetailView from './pages/PokemonDetailView';
import TypeDetailView from './pages/TypeDetailView';
import AbilityDetailView from './pages/AbilityDetailView';
import MoveDetailView from './pages/MoveDetailView';
import ItemDetailView from './pages/ItemDetailView';
import RegionDetailView from './pages/RegionDetailView';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RankingPage from './pages/RankingPage';
import ProfilePage from './pages/ProfilePage';

// Battle pages
import BattleLobby from './pages/battle/BattleLobby';
import BattleSelect from './pages/battle/BattleSelect';
import BattleCPU from './pages/battle/BattleCPU';
import BattlePvP from './pages/battle/BattlePvP';

function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex justify-center text-slate-400 mb-6"><Frown size={96} className="animate-bounce" /></div>
      <h1 className="font-bold text-slate-900 dark:text-white text-3xl">404</h1>
      <p className="text-slate-500 dark:text-slate-400">Página não encontrada!</p>
      <a href="/" className="btn-primary">← Voltar para Home</a>
    </main>
  );
}

function BattleLayout({ children }) {
  return (
    <BattleProvider>
      {children}
    </BattleProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SeasonProvider>
        <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/ranking" element={<RankingPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/contests" element={<Contests />} />
              <Route path="/encounters" element={<Encounters />} />
              <Route path="/games" element={<Games />} />
              <Route path="/items" element={<Items />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/machines" element={<Machines />} />
              <Route path="/moves" element={<Moves />} />
              <Route path="/pokemon" element={<Pokemon />} />

              {/* Detail pages */}
              <Route path="/pokemon/:id" element={<PokemonDetailView />} />
              <Route path="/type/:id" element={<TypeDetailView />} />
              <Route path="/ability/:id" element={<AbilityDetailView />} />
              <Route path="/move/:id" element={<MoveDetailView />} />
              <Route path="/item/:id" element={<ItemDetailView />} />
              <Route path="/region/:id" element={<RegionDetailView />} />

              {/* Battle pages — wrapped with BattleProvider */}
              <Route path="/battle" element={<BattleLayout><BattleLobby /></BattleLayout>} />
              <Route path="/battle/select" element={<BattleLayout><BattleSelect /></BattleLayout>} />
              <Route path="/battle/cpu" element={<BattleLayout><BattleCPU /></BattleLayout>} />
              <Route path="/battle/pvp" element={<BattleLayout><BattlePvP /></BattleLayout>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
        </BrowserRouter>
        <Analytics />
        <SpeedInsights />
      </SeasonProvider>
    </AuthProvider>
  );
}
