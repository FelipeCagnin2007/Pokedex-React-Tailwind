import { useEffect, useRef, useState } from 'react';

const STAT_COLORS = {
  hp:              { from: 'from-green-400',  to: 'to-emerald-500' },
  attack:          { from: 'from-red-400',    to: 'to-rose-500' },
  defense:         { from: 'from-blue-400',   to: 'to-sky-500' },
  'special-attack':  { from: 'from-purple-400', to: 'to-violet-500' },
  'special-defense': { from: 'from-teal-400',  to: 'to-cyan-500' },
  speed:           { from: 'from-yellow-400', to: 'to-amber-500' },
};

const STAT_LABELS = {
  hp:              'HP',
  attack:          'Ataque',
  defense:         'Defesa',
  'special-attack':  'Sp. Atq',
  'special-defense': 'Sp. Def',
  speed:           'Velocidade',
};

export default function StatBar({ name, value, max = 255 }) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const pct = Math.min((value / max) * 100, 100);
  const colors = STAT_COLORS[name] || { from: 'from-slate-400', to: 'to-slate-500' };
  const label = STAT_LABELS[name] || name;

  const colorValue = value >= 100 ? 'text-emerald-600 dark:text-emerald-400'
    : value >= 60 ? 'text-slate-700 dark:text-slate-200'
    : 'text-red-500 dark:text-red-400';

  return (
    <div ref={ref} className="grid grid-cols-[90px_40px_1fr] items-center gap-3">
      <span className="text-slate-500 dark:text-slate-400 text-xs font-medium text-right">
        {label}
      </span>
      <span className={`text-sm font-bold font-mono text-right ${colorValue}`}>
        {value}
      </span>
      <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colors.from} ${colors.to} transition-all duration-1000 ease-out`}
          style={{ width: animated ? `${pct}%` : '0%' }}
        />
      </div>
    </div>
  );
}
