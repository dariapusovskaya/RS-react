import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { fetchItems } from './services/api';


vi.mock('./services/api', () => ({
  fetchItems: vi.fn()
}));

vi.mock('./context/ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
  useTheme: vi.fn(() => ({ theme: 'light', toggleTheme: vi.fn() }))
}));


vi.mock('./components/ErrorBoundary/ErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="error-boundary">{children}</div>
  )
}));


vi.mock('./components/Flyout/Flyout', () => ({
  Flyout: ({ items }: { items?: any[] }) => (
    <div data-testid="flyout">Flyout: {items?.length ?? 0} items</div>
  )
}));


vi.mock('./store/useSelectedItemsStore', () => ({
  useSelectedItemsStore: vi.fn(() => ({
    getSelectedCount: () => 0,
    getSelectedIds: () => [],
    unselectAll: vi.fn()
  }))
}));

describe('App Component', () => {
  const mockFetchItems = fetchItems as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetchItems.mockClear();
    mockFetchItems.mockResolvedValue([]);
  });

  
  it('renders without crashing', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(mockFetchItems).toHaveBeenCalledWith({
        searchTerm: '',
        page: 1,
        limit: 10
      });
    });
  });

  it('handles search term from localStorage on initial load', async () => {
    localStorage.setItem('searchTerm', 'saved term');
    mockFetchItems.mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(mockFetchItems).toHaveBeenCalledWith({
        searchTerm: 'saved term',
        page: 1,
        limit: 10
      });
    });
  });

  it('calls API with correct parameters on search', async () => {
    const user = userEvent.setup();
    mockFetchItems.mockResolvedValue([]);
    
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockFetchItems).toHaveBeenCalled();
    });

    mockFetchItems.mockClear();

    const input = screen.getByPlaceholderText(/search/i);
    const button = screen.getByRole('button', { name: /search/i });

    await user.type(input, 'test search');
    await user.click(button);

    await waitFor(() => {
      expect(mockFetchItems).toHaveBeenCalledWith({
        searchTerm: 'test search',
        page: 1,
        limit: 10
      });
    });
  });

  it('handles API error responses', async () => {
    mockFetchItems.mockRejectedValue(new Error('API Error'));

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/cant upload the data/i)).toBeInTheDocument();
    });
  });

  it('manages loading state during API calls', async () => {
    mockFetchItems.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve([]), 100))
    );

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    const button = screen.getByRole('button', { name: /search/i });
    expect(button).toBeDisabled();

    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });
  });

  it('navigates to About page when clicking about link', async () => {
    const user = userEvent.setup();
    mockFetchItems.mockResolvedValue([]);
    
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    const aboutLink = screen.getByRole('link', { name: /about/i });
    await user.click(aboutLink);

    expect(screen.getByText(/About This App/i)).toBeInTheDocument();
    expect(screen.getByText(/Author: dariapusovskaya/i)).toBeInTheDocument();
  });

  it('shows 404 page for unknown route', () => {
    mockFetchItems.mockResolvedValue([]);
    
    render(
      <MemoryRouter initialEntries={['/unknown-path']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  });
});