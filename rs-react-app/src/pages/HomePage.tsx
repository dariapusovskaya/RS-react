import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
    setSearchParams({ page: newPage.toString() });
    performSearch(searchTerm, newPage);
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

  return (
    <>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center' }}>Search App</h1>

          <Search 
          searchTerm={searchTerm}
          onSearch={handleSearch}
          isLoading={loading}
          />

          <Results 
          results={results}
          loading={loading}
          error={error}
          />

          {!loading && totalPages > 0 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={loading}
          />
          )}

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
    </>
  )


};

export default HomePage;
