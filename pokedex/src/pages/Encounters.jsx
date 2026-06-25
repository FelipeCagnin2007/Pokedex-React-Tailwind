import TopicPage from '../components/TopicPage';
import { Navigation, Moon, Hash } from 'lucide-react';
import {
  fetchEncounterMethods, fetchEncounterConditions, fetchEncounterConditionValues,
  fetchEncounterMethod, fetchEncounterCondition,
  formatName,
} from '../api/pokeapi';

const TABS = [
  {
    id: 'methods',
    label: 'Methods',
    icon: <Navigation size={24} />,
    fetchFn: fetchEncounterMethods,
    detailFn: fetchEncounterMethod,
    accentColor: 'red',
  },
  {
    id: 'conditions',
    label: 'Conditions',
    icon: <Moon size={24} />,
    fetchFn: fetchEncounterConditions,
    detailFn: fetchEncounterCondition,
    accentColor: 'yellow',
  },
  {
    id: 'values',
    label: 'Condition Values',
    icon: <Hash size={24} />,
    fetchFn: fetchEncounterConditionValues,
    accentColor: 'blue',
  },
];

export default function Encounters() {
  return (
    <TopicPage
      title="Encounters"
      description="Encontros com Pokémon selvagens dependem de métodos (caminhada, pesca, surf) e condições (hora do dia, clima, itens equipados)."
      tabs={TABS}
    />
  );
}
