import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { fetchItems } from './services/api';

vi.mock('./services/api', () => ({
  fetchItems: vi.fn()
}));

describe('App component', () => {
    const mockFetchItems = fetchItems as unknown as ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockFetchItems.mockClear();
        localStorage.clear();
    });

    it('makes initial API call on component mount',  async () => {
        mockFetchItems.mockResolvedValue([
            { id: 1, name: 'Item 1', description: 'Desc 1' }
        ]);

        render(<App />);

        await waitFor(() => {
            expect(mockFetchItems).toHaveBeenCalledWith('');
        });
    });

    it('handles search term from localStorage on initial load', async () => {
        localStorage.setItem('searchTerm', 'saved term');
        mockFetchItems.mockResolvedValue([]);

        render(<App />);

        await waitFor(() => {
            expect(mockFetchItems).toHaveBeenCalledWith('saved term');
        });
    });

    it('calls API with correct parameters on search', async () => {
        const user = userEvent.setup();
        mockFetchItems.mockResolvedValue([]);
        render(<App />);

        mockFetchItems.mockClear();

        const input = screen.getByTestId('search-input');
        const button = screen.getByRole('button', { name: /search/i });
    
        await user.type(input, 'test search');
        await user.click(button);
    
        await waitFor(() => {
        expect(mockFetchItems).toHaveBeenCalledWith('test search');
        });
    });

    it('handles successful API responses', async () => {
        const mockResults = [
            { id: 1, name: 'Result 1', description: 'Desc 1' },
            { id: 2, name: 'Result 2', description: 'Desc 2' }
        ];
        mockFetchItems.mockResolvedValue(mockResults);

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('Result 1')).toBeInTheDocument();
            expect(screen.getByText('Result 2')).toBeInTheDocument();
        });
    });

    it('handles API error responses', async () => {
        mockFetchItems.mockRejectedValue(new Error('API Error'));

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText(/cant upload the data/i)).toBeInTheDocument();
        });
    });

    it('manages loading state during API calls', async () => {
        mockFetchItems.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve([]), 100))
        );

        render(<App />);

        const button = screen.getByRole('button', { name: /search/i });

        expect(screen.getByText(/Loading/i)).toBeInTheDocument();
        expect(button).toBeDisabled();

        await waitFor(() => {
            expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
        });
    });
})