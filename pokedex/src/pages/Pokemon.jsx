import TopicPage from '../components/TopicPage';
import { fetchPokemon, fetchAbilities, fetchTypes, fetchStats, fetchStat } from '../api/pokeapi';

const TABS = [
  { id: 'pokemon', label: 'Pokémon data', fetchFn: fetchPokemon, routePrefix: '/pokemon' },
  { id: 'types', label: 'Type chart', fetchFn: fetchTypes, routePrefix: '/type' },
  { id: 'abilities', label: 'Abilities', fetchFn: fetchAbilities, routePrefix: '/ability' },
  { id: 'stats', label: 'Base stats', fetchFn: fetchStats, detailFn: fetchStat },
];

export default function Pokemon() {
  return (
    <TopicPage
      title="Pokémon Database"
      description="Information on Pokémon stats, evolutions, and typing."
      tabs={TABS}
    />
  );
}
