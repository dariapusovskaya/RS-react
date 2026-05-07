import React from 'react';
import { Search } from './components/Search/Search';
import Results from './components/Results/Results';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import type { AppState } from './types';
import { fetchItems } from './services/api';
import Bomb from './components/Bomb/Bomb';

class App extends React.Component<{}, AppState & {explode: boolean} > {
  constructor(props: {}) {
    super(props);
    this.state = {
      searchTerm: '',
      results: [],
      loading: false,
      error: null,
      explode: false
    };
  }

  private performSearch = async (term: string) => {
    this.setState({ loading: true, error: null });

    try {
      const items = await fetchItems(term);
      
      this.setState({
        results: items,
        loading: false,
        error: null
      });
    } catch (err) {
      this.setState({
        results: [],
        loading: false,
        error: `cant upload the data`
      });
    }
  };

  handleSearch = (term: string) => {
    this.setState({ searchTerm: term });

    localStorage.setItem('searchTerm', term);

    this.performSearch(term);
  };

  triggerError = () => {
    this.setState({ explode: true });
  }

  componentDidMount() {
    const savedTerm = localStorage.getItem('searchTerm');
    if (savedTerm) {
      this.setState({ searchTerm: savedTerm });
      this.performSearch(savedTerm);
    } else {
      this.performSearch('');
    }
  };

  render() {
    return (
      <ErrorBoundary>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center' }}>Search App</h1>
          <Search 
            searchTerm={this.state.searchTerm}
            onSearch={this.handleSearch}
            isLoading={this.state.loading}
          />
          <Results 
            results={this.state.results}
            loading={this.state.loading}
            error={this.state.error}
          />

          <Bomb shouldExplode={this.state.explode} />

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button
              onClick={this.triggerError}
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
      </ErrorBoundary>
    );
  }
}

export default App;