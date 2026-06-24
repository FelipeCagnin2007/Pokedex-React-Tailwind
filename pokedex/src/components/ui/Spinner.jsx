export default function Spinner({ text = 'Carregando...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-20">
      {/* Animated Pokéball */}
      <div className="relative w-14 h-14 animate-bounce">
        <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-medium">
          <circle cx="50" cy="50" r="47" fill="none" stroke="#E2E8F0" strokeWidth="5" />
          <path d="M 3 50 A 47 47 0 0 1 97 50 Z" fill="#DC2626" />
          <path d="M 3 50 A 47 47 0 0 0 97 50 Z" fill="#F8FAFC" />
          <line x1="3" y1="50" x2="97" y2="50" stroke="#CBD5E1" strokeWidth="5" />
          <circle cx="50" cy="50" r="14" fill="#CBD5E1" />
          <circle cx="50" cy="50" r="9"  fill="#F8FAFC" />
        </svg>
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium animate-pulse">
        {text}
      </p>
    </div>
  );
}
