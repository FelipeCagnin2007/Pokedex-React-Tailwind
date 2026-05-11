import { formatName, getIdFromUrl } from '../../api/pokeapi';

export default function ResourceCard({ item, onClick, icon, badge, isPokemon }) {
  const id = item.url ? getIdFromUrl(item.url) : item.id;
  const name = formatName(item.name || `#${id}`);
  const isClickable = !!onClick;

  const CardWrapper = isClickable ? 'button' : 'div';
  const interactionStyles = isClickable 
    ? 'cursor-pointer hover:bg-poke-gray-light text-poke-blue hover:text-poke-red hover:underline group-hover:text-poke-red group-hover:underline' 
    : 'text-poke-dark cursor-default';

  return (
    <CardWrapper
      onClick={() => isClickable && onClick(id, name)}
      className={`table-row-item w-full flex-col sm:flex-row items-start sm:items-center text-left ${isClickable ? 'hover:bg-poke-gray-light group' : ''}`}
    >
      <div className="flex items-center gap-3">
        {isPokemon ? (
          <img 
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`} 
            alt={name}
            className={`w-12 h-12 object-contain bg-white rounded border border-poke-gray ${isClickable ? 'group-hover:scale-110 transition-transform' : ''}`}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : icon ? (
          <span className="text-xl text-poke-gray-dark w-8 text-center">{icon}</span>
        ) : (
          <span className="w-8"></span>
        )}
        
        <div className="text-left">
          <span className={`font-bold text-base ${interactionStyles}`}>
            {name}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-4 mt-2 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
        {id && (
          <span className="text-poke-gray-dark text-xs font-mono">#{String(id).padStart(4, '0')}</span>
        )}
        {badge && (
          <span className="text-xs text-poke-dark bg-white border border-poke-gray px-2 py-0.5 rounded">
            {badge}
          </span>
        )}
        {isClickable && (
          <span className="text-poke-blue group-hover:text-poke-red font-bold hidden sm:block transition-colors">
            &rarr;
          </span>
        )}
      </div>
    </CardWrapper>
  );
}
