import { useState, useEffect } from 'react';
import { Search } from '../components/Search/Search';
import Results from '../components/Results/Results';
import Bomb from '../components/Bomb/Bomb';
import { fetchItems } from '../services/api';
import type { Item } from '../types';


const HomePage = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [explode, setExplode] = useState(false);

  const performSearch = async (term: string) => {
    setLoading(true);
    setError(null);

    try {
      const items = await fetchItems(term);
      setResults(items);
      setLoading(false);
    } catch (err) {
        setResults([]);
        setLoading(false);
        setError('cant upload the data')
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    localStorage.setItem('searchTerm', term);
    performSearch(term);
  };

  const triggerError = () => {
    setExplode(true);
  };

  useEffect(() => {
    const savedTerm = localStorage.getItem('searchTerm');
    if (savedTerm) {
      setSearchTerm(savedTerm);
      performSearch(savedTerm);
    } else {
      performSearch('');
    }
  }, []);

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
