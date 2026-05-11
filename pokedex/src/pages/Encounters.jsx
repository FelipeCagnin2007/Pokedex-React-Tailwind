import TopicPage from '../components/TopicPage';
import {
  fetchEncounterMethods, fetchEncounterConditions, fetchEncounterConditionValues,
  fetchEncounterMethod, fetchEncounterCondition,
  formatName,
} from '../api/pokeapi';

const TABS = [
  {
    id: 'methods',
    label: 'Methods',
    icon: '🎣',
    fetchFn: fetchEncounterMethods,
    detailFn: fetchEncounterMethod,
    accentColor: 'red',
  },
  {
    id: 'conditions',
    label: 'Conditions',
    icon: '🌙',
    fetchFn: fetchEncounterConditions,
    detailFn: fetchEncounterCondition,
    accentColor: 'yellow',
  },
  {
    id: 'values',
    label: 'Condition Values',
    icon: '🔢',
    fetchFn: fetchEncounterConditionValues,
    accentColor: 'blue',
  },
];

export default function Encounters() {
  return (
    <TopicPage
      title="Encounters"
      emoji="🌿"
      description="Encontros com Pokémon selvagens dependem de métodos (caminhada, pesca, surf) e condições (hora do dia, clima, itens equipados)."
      tabs={TABS}
    />
  );
}
