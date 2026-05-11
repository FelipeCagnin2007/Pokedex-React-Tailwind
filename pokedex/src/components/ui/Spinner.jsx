export default function Spinner({ size = 'md', text = 'Carregando...' }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className={`${sizes[size]} animate-spin-slow relative`}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M 5 50 A 45 45 0 0 1 95 50 Z" fill="#EE1515" />
          <path d="M 5 50 A 45 45 0 0 0 95 50 Z" fill="#FFFFFF" />
          <line x1="5" y1="50" x2="95" y2="50" stroke="#111" strokeWidth="5" />
          <circle cx="50" cy="50" r="13" fill="#111" />
          <circle cx="50" cy="50" r="8" fill="#FFFFFF" />
          <circle cx="50" cy="50" r="45" fill="none" stroke="#111" strokeWidth="5" />
        </svg>
      </div>
      {text && (
        <p className="text-poke-dark-2 text-sm font-bold animate-pulse">{text}</p>
      )}
    </div>
  );
}
