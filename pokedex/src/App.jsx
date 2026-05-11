import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
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

function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
      <div className="text-8xl animate-bounce-subtle">😵</div>
      <h1 className="font-pixel text-poke-yellow text-xl">404</h1>
      <p className="text-poke-gray-light">Página não encontrada!</p>
      <a href="/" className="btn-primary">Voltar para Home</a>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-poke-light">
        <Navbar />
        <div className="flex-1 bg-parallax">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contests" element={<Contests />} />
            <Route path="/encounters" element={<Encounters />} />
            <Route path="/games" element={<Games />} />
            <Route path="/items" element={<Items />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/machines" element={<Machines />} />
            <Route path="/moves" element={<Moves />} />
            <Route path="/pokemon" element={<Pokemon />} />
            
            {/* Dynamic Details Routes */}
            <Route path="/pokemon/:id" element={<PokemonDetailView />} />
            <Route path="/type/:id" element={<TypeDetailView />} />
            <Route path="/ability/:id" element={<AbilityDetailView />} />
            <Route path="/move/:id" element={<MoveDetailView />} />
            <Route path="/item/:id" element={<ItemDetailView />} />
            <Route path="/region/:id" element={<RegionDetailView />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
