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

  
  it('renders without crashing', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
  });

 
  it('renders RootLayout', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

 
  it('renders About page at /about route', async () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/About This App/i)).toBeInTheDocument();
    });
  });


  it('renders NotFound page for unknown routes', () => {
    render(
      <MemoryRouter initialEntries={['/unknown-route']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
  });


  it('renders search on home page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/Search/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
  });


  it('navigates between pages', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/Search/i)).toBeInTheDocument();

    const aboutLink = screen.getByText('About');
    await user.click(aboutLink);

    await waitFor(() => {
      expect(screen.getByText(/About This App/i)).toBeInTheDocument();
    });
  });

  it('navigates back to home', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/About This App/i)).toBeInTheDocument();
    });

    const homeLink = screen.getByText('Home');
    await user.click(homeLink);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Search/i)).toBeInTheDocument();
    });
  });

  it('fetches items on mount', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockFetchItems).toHaveBeenCalled();
    });
  });

  it('is wrapped with ThemeProvider', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
  });

  it('is wrapped with ErrorBoundary', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
  });
});