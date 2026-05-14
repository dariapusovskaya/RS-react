import { useState, useEffect } from 'react';
import { useSearchParams, Outlet } from 'react-router-dom';
import { Search } from '../components/Search/Search';
import Pagination from '../components/Pagination/Pagination';
import Results from '../components/Results/Results';
import Bomb from '../components/Bomb/Bomb';
import { fetchItems } from '../services/api';
import type { Item } from '../types';


const ITEMS_PER_PAGE = 10;

const HomePage = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [explode, setExplode] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  const currentPage = parseInt(searchParams.get('page') || '1');
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const selectedItemId = searchParams.get('details');

  const performSearch = async (term: string, page: number) => {
    setLoading(true);
    setError(null);

    try {
      const {items, total} = await fetchItems({
        searchTerm: term,
        page: page,
        limit: ITEMS_PER_PAGE
      });

      setResults(items);
      setTotalItems(total);
      setLoading(false);
    } catch (err) {
        setResults([]);
        setTotalItems(0);
        setLoading(false);
        setError('cant upload the data')
    }
  };

  const handleSearch = (term: string) => {
    const trimmedTerm = term.trim();
    setSearchTerm(trimmedTerm);
    localStorage.setItem('searchTerm', trimmedTerm);

    setSearchParams({ page: '1' });
    performSearch(trimmedTerm, 1);
  };

  const handlePageChange = (newPage: number) => {

    const newParams: { page: string; details?: string } = { page: newPage.toString() };
    if (selectedItemId) {
      newParams.details = selectedItemId;
    }
    setSearchParams(newParams);
    performSearch(searchTerm, newPage);
  };

  const handleItemClick = (itemId: number) => {
    const newParams: { page: string; details: string } = {
      page: currentPage.toString(),
      details: itemId.toString() 
    };
    setSearchParams(newParams);
  };

  const closeDetails = () => {
    const newParams: { page: string } = { page: currentPage.toString() };
    setSearchParams(newParams);
  };

  const triggerError = () => {
    setExplode(true);
  };

  useEffect(() => {
    const savedTerm = localStorage.getItem('searchTerm');
    if (savedTerm) {
      setSearchTerm(savedTerm);
      performSearch(savedTerm, currentPage);
    } else {
      performSearch('', currentPage);
    }
  }, []);

  useEffect(() => {
    if (searchTerm !== undefined) {
      performSearch(searchTerm, currentPage)
    }
  }, [currentPage]);


  console.log('Текущий путь:', window.location.pathname);
console.log('Параметры:', searchParams.toString());
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>Search App</h1>

      <Search 
        searchTerm={searchTerm}
        onSearch={handleSearch}
        isLoading={loading}
      />

      {/* 
        НОВОЕ: MASTER-DETAIL VIEW 
        Используем CSS Grid для создания двух колонок
      */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: selectedItemId ? '1fr 1fr' : '1fr',
        gap: '24px',
        transition: 'all 0.3s ease'
      }}>
        {/* Левая колонка — список результатов (Master) */}
        <div>
          <Results 
            results={results}
            loading={loading}
            error={error}
            onItemClick={handleItemClick}  // ← передаём обработчик
            selectedItemId={selectedItemId} // ← передаём ID выбранного элемента
          />

          {!loading && totalPages > 0 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={loading}
            />
          )}
        </div>

        {/* Правая колонка — детали элемента (Detail) */}
        {selectedItemId && (
          <div style={{
            borderLeft: '1px solid #e0e0e0',
            paddingLeft: '24px',
            position: 'relative'
          }}>
            {/* Кнопка закрытия */}
            <button
              onClick={closeDetails}
              style={{
                position: 'absolute',
                top: '0',
                right: '0',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#999'
              }}
            >
              ✕
            </button>
            
            {/* Здесь будет рендериться ItemDetails через Outlet */}
            <Outlet context={{ itemId: selectedItemId }} />
          </div>
        )}
      </div>

      <Bomb shouldExplode={explode} />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button
          onClick={triggerError}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Simulate Error
        </button>
      </div>
    </div>
  )


};

export default HomePage;
