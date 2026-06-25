import { Apple, Sparkles, Ribbon, Glasses, Wind, HardHat, ShieldAlert } from 'lucide-react';

export const ITEMS = {
  leftovers: {
    id: 'leftovers',
    name: 'Restos de Maçã',
    description: 'Restaura 1/16 do HP máximo no final de cada turno.',
    icon: <Apple size={16} className="text-red-500" />,
    effectType: 'end_turn',
  },
  life_orb: {
    id: 'life_orb',
    name: 'Orbe da Vida',
    description: 'Aumenta o dano de ataques em 30%, mas perde 10% do HP máximo após atacar.',
    icon: <Sparkles size={16} className="text-purple-500" />,
    effectType: 'post_attack',
  },
  choice_band: {
    id: 'choice_band',
    name: 'Faixa da Escolha',
    description: 'Aumenta o Ataque Físico em 50%, mas prende o usuário no primeiro ataque usado.',
    icon: <Ribbon size={16} className="text-red-600" />,
    effectType: 'stat_boost',
  },
  choice_specs: {
    id: 'choice_specs',
    name: 'Óculos da Escolha',
    description: 'Aumenta o Ataque Especial em 50%, mas prende o usuário no primeiro ataque usado.',
    icon: <Glasses size={16} className="text-slate-800" />,
    effectType: 'stat_boost',
  },
  choice_scarf: {
    id: 'choice_scarf',
    name: 'Cachecol da Escolha',
    description: 'Aumenta a Velocidade em 50%, mas prende o usuário no primeiro ataque usado.',
    icon: <Wind size={16} className="text-blue-400" />,
    effectType: 'stat_boost',
  },
  rocky_helmet: {
    id: 'rocky_helmet',
    name: 'Capacete Pedregoso',
    description: 'Causa dano igual a 1/6 do HP máximo ao atacante se receber ataque físico.',
    icon: <HardHat size={16} className="text-stone-500" />,
    effectType: 'defensive',
  },
  focus_sash: {
    id: 'focus_sash',
    name: 'Faixa Foco',
    description: 'Sobrevive com 1 HP a um ataque que nocautearia se estivesse com HP cheio. Desaparece após o uso.',
    icon: <ShieldAlert size={16} className="text-red-500" />,
    effectType: 'survival',
  }
};
