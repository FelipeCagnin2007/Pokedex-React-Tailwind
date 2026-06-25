import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ResourceCard from '../components/ui/ResourceCard';
import Pagination from '../components/ui/Pagination';
import Spinner from '../components/ui/Spinner';
import { Search } from 'lucide-react';

const LIMIT = 50; // Increased limit for better tabular view like wikis

export default function TopicPage({ title, description, tabs }) {
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const tab = tabs[activeTab];

  const loadList = useCallback(async () => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const offset = (page - 1) * LIMIT;
      const result = await tab.fetchFn(LIMIT, offset);
      setData(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [tab, page]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const handleTabChange = (i) => {
    setActiveTab(i);
    setPage(1);
    setDetail(null);
    setSearchTerm('');
  };

  const navigate = useNavigate();

  const handleItemClick = async (id) => {
    if (tab.routePrefix) {
      navigate(`${tab.routePrefix}/${id}`);
      return;
    }
    
    if (!tab.detailFn) return;
    setDetailLoading(true);
    setDetail(null);
    try {
      const res = await tab.detailFn(id);
      setDetail(res);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      setDetail({ error: e.message });
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    const term = searchTerm.trim().toLowerCase().replace(/ /g, '-');
    if (tab.routePrefix) {
      navigate(`${tab.routePrefix}/${term}`);
    } else {
      handleItemClick(term);
    }
  };

  const totalPages = data ? Math.ceil(data.count / LIMIT) : 0;

  const displayResults = data?.results?.filter(item => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (item.url && item.url.includes(`/${searchTerm}/`))
  ) || [];

  return (
    <main className="min-h-screen relative z-10 py-8">
      {/* Header section */}
      <div className="glass-panel mx-4 sm:mx-6 lg:mx-auto max-w-7xl mb-8 p-6 sm:p-8 rounded-2xl animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-bold text-poke-red dark:text-red-500 mb-2">{title}</h1>
        <p className="text-poke-dark-2 dark:text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">{description}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Tabs */}
        {tabs.length > 1 && (
          <div className="flex flex-wrap gap-1 mb-6 border-b border-poke-gray dark:border-slate-700 pb-2">
            {tabs.map((t, i) => (
              <button
                key={t.id}
                onClick={() => handleTabChange(i)}
                className={`px-6 py-2.5 text-sm font-bold transition-all duration-200 border-b-2 ${
                  activeTab === i
                    ? 'border-poke-red dark:border-red-500 text-poke-red dark:text-red-400 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm'
                    : 'border-transparent text-poke-dark dark:text-slate-400 hover:text-poke-red dark:hover:text-red-400 hover:bg-white/30 dark:hover:bg-slate-800/30 backdrop-blur-sm'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {/* Action Bar (Search & Results Info) */}
        {!detail && !detailLoading && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="text-sm text-poke-dark-2 dark:text-slate-400">
              {data && (
                <>
                  Mostrando <span className="font-bold">{(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, data.count)}</span> de <span className="font-bold">{data.count}</span>
                </>
              )}
            </div>
            
            <form onSubmit={handleSearch} className="flex max-w-sm w-full">
              <input
                type="text"
                placeholder={`Search ${tab.label}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-white dark:bg-slate-800 border border-poke-gray dark:border-slate-700 py-1.5 px-3 text-sm focus:outline-none focus:border-poke-blue dark:focus:border-blue-500 dark:text-white transition-colors"
              />
              <button type="submit" className="bg-poke-gray-light dark:bg-slate-700 border border-l-0 border-poke-gray dark:border-slate-700 px-3 text-poke-dark dark:text-slate-300 hover:bg-poke-gray dark:hover:bg-slate-600 transition-colors flex items-center justify-center">
                <Search size={16} />
              </button>
            </form>
          </div>
        )}

        {/* Dynamic Layout */}
        {detailLoading && <Spinner text="Carregando..." />}
        
        {detail && !detailLoading && (
          <div className="mb-8">
            <div className="mb-4">
              <button 
                onClick={() => setDetail(null)}
                className="text-sm font-bold text-poke-blue hover:text-poke-red hover:underline flex items-center gap-1"
              >
                &laquo; Voltar para a lista
              </button>
            </div>
            <div className="bg-white">
              {detail.error ? (
                <div className="text-center py-8 border border-poke-gray bg-poke-gray-light">
                  <p className="text-poke-red font-bold">Erro!</p>
                  <p className="text-poke-dark-2">{detail.error}</p>
                </div>
              ) : tab.renderDetail ? (
                tab.renderDetail(detail)
              ) : (
                <DefaultDetail data={detail} />
              )}
            </div>
          </div>
        )}

        {!detail && !detailLoading && (
          <div>
            {loading && <Spinner />}
            {error && (
              <div className="border border-poke-red bg-red-50 p-4 max-w-md mx-auto text-center mt-8">
                <p className="text-poke-red font-bold mb-1">Erro</p>
                <p className="text-poke-dark-2 text-sm">{error}</p>
                <button onClick={loadList} className="mt-4 text-poke-blue hover:underline text-sm font-bold">
                  Tentar novamente
                </button>
              </div>
            )}
            {data && !loading && (
              <>
                {displayResults.length === 0 ? (
                  <p className="text-center text-poke-dark-2 dark:text-slate-400 py-12 border border-poke-gray dark:border-slate-700 bg-poke-gray-light dark:bg-slate-800/50">Nenhum resultado.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                    {displayResults.map((item) => (
                      <ResourceCard
                        key={item.url || item.name}
                        item={item}
                        onClick={(tab.detailFn || tab.routePrefix) ? handleItemClick : undefined}
                        icon={tab.icon}
                        isPokemon={tab.id === 'pokemon'}
                        isItem={tab.id === 'items'}
                        isBerry={tab.id === 'berries'}
                      />
                    ))}
                  </div>
                )}
                <div className="mt-6">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    totalCount={data.count}
                    limit={LIMIT}
                  />
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </main>
  );
}

function DefaultDetail({ data }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-poke-dark mb-4 border-b border-poke-gray pb-2 capitalize">
        {data.name ? data.name.replace(/-/g, ' ') : `#${data.id}`}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0 border-t border-poke-gray">
        {Object.entries(data)
          .filter(([k]) => !['sprites', 'moves', 'forms', 'game_indices', 'held_items', 'encountered_in_the_wild'].includes(k))
          .slice(0, 15)
          .map(([key, val]) => {
            let displayVal = String(val);
            if (Array.isArray(val)) {
              displayVal = `${val.length} items`;
            } else if (val && typeof val === 'object') {
              displayVal = val.name || val.url || 'Object';
            }
            return (
              <div key={key} className="flex justify-between sm:justify-start gap-4 text-sm border-b border-poke-gray py-2 px-2 hover:bg-poke-gray-light">
                <span className="text-poke-gray-dark font-bold capitalize w-32 flex-shrink-0">
                  {key.replace(/_/g, ' ')}
                </span>
                <span className="text-poke-dark capitalize text-right sm:text-left">
                  {displayVal.replace(/-/g, ' ')}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
