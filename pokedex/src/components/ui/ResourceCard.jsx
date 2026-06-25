import { formatName, getIdFromUrl } from '../../api/pokeapi';
import { Package } from 'lucide-react';

export default function ResourceCard({ item, onClick, icon, badge, isPokemon, isItem, isBerry }) {
  const id = item.url ? getIdFromUrl(item.url) : item.id;
  const name = formatName(item.name || `#${id}`);
  const isClickable = !!onClick;

  const CardWrapper = isClickable ? 'button' : 'div';
  
  const showImage = isPokemon || isItem || isBerry;
  
  let imageSrc = '';
  if (isPokemon) {
    imageSrc = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  } else if (isItem) {
    imageSrc = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.name}.png`;
  } else if (isBerry) {
    imageSrc = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.name}-berry.png`;
  }

  return (
    <CardWrapper
      onClick={() => isClickable && onClick(id, name)}
      className={`relative flex flex-col items-center p-5 rounded-2xl transition-all duration-300 border w-full text-center
        ${isClickable 
          ? 'cursor-pointer hover:-translate-y-2 hover:shadow-xl hover:shadow-red-500/20 hover:border-red-400 group bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border-slate-200/50 dark:border-slate-700/50' 
          : 'bg-white/40 dark:bg-slate-800/40 border-slate-200/30 dark:border-slate-700/30 cursor-default'}
      `}
    >
      <div className="absolute top-3 right-4 text-xs font-bold text-slate-400 dark:text-slate-500 font-mono">
        #{String(id).padStart(3, '0')}
      </div>
      
      <div className="w-24 h-24 mb-4 mt-2 flex items-center justify-center relative">
        {showImage ? (
          <>
            {isPokemon && <div className={`absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-full opacity-50 blur-md transition-opacity duration-300 ${isClickable ? 'group-hover:opacity-100' : ''}`}></div>}
            <img 
              src={imageSrc} 
              alt={name}
              className={`w-full h-full object-contain relative z-10 drop-shadow-lg transition-transform duration-300 ${isClickable ? 'group-hover:scale-110' : ''} ${!isPokemon ? 'p-2 drop-shadow-none' : ''}`}
              onError={(e) => { 
                if (isPokemon) e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`; 
                else e.target.style.display = 'none';
              }}
              loading="lazy"
            />
          </>
        ) : icon ? (
          <span className="text-5xl text-slate-400 dark:text-slate-500 group-hover:text-red-500 transition-colors duration-300">{icon}</span>
        ) : (
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
             <Package size={24} className="opacity-50 text-slate-500" />
          </div>
        )}
      </div>
      
      <h3 className={`font-bold text-base capitalize transition-colors duration-300 ${isClickable ? 'text-slate-800 dark:text-slate-100 group-hover:text-red-600 dark:group-hover:text-red-400' : 'text-slate-600 dark:text-slate-300'}`}>
        {name}
      </h3>

      {badge && (
        <span className="mt-3 text-[10px] uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600">
          {badge}
        </span>
      )}
    </CardWrapper>
  );
}
