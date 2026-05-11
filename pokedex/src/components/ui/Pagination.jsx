export default function Pagination({ currentPage, totalPages, onPageChange, totalCount, limit }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  const left = Math.max(1, currentPage - delta);
  const right = Math.min(totalPages, currentPage + delta);

  for (let i = left; i <= right; i++) pages.push(i);

  return (
    <div className="flex flex-col items-center gap-3 mt-8">
      {totalCount && (
        <p className="text-poke-dark-2 text-sm">
          Mostrando{' '}
          <span className="font-bold text-poke-dark">
            {(currentPage - 1) * limit + 1}–{Math.min(currentPage * limit, totalCount)}
          </span>{' '}
          de <span className="font-bold text-poke-dark">{totalCount}</span> resultados
        </p>
      )}

      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-lg bg-white border border-poke-gray text-poke-dark hover:border-poke-red hover:text-poke-red transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          aria-label="Página anterior"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* First page */}
        {left > 1 && (
          <>
            <PageBtn n={1} current={currentPage} onPageChange={onPageChange} />
            {left > 2 && <span className="text-poke-gray-dark px-1 font-bold">…</span>}
          </>
        )}

        {/* Range */}
        {pages.map((n) => (
          <PageBtn key={n} n={n} current={currentPage} onPageChange={onPageChange} />
        ))}

        {/* Last page */}
        {right < totalPages && (
          <>
            {right < totalPages - 1 && <span className="text-poke-gray-dark px-1 font-bold">…</span>}
            <PageBtn n={totalPages} current={currentPage} onPageChange={onPageChange} />
          </>
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-lg bg-white border border-poke-gray text-poke-dark hover:border-poke-red hover:text-poke-red transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          aria-label="Próxima página"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function PageBtn({ n, current, onPageChange }) {
  const isActive = n === current;
  return (
    <button
      onClick={() => onPageChange(n)}
      className={`w-9 h-9 rounded-lg text-sm font-bold transition-all duration-200 border shadow-sm ${
        isActive
          ? 'bg-poke-red border-poke-red text-white shadow-md'
          : 'bg-white border-poke-gray text-poke-dark hover:border-poke-red hover:text-poke-red'
      }`}
    >
      {n}
    </button>
  );
}
