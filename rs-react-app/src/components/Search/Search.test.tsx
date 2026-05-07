import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import { Search } from './Search';

describe('Search component', () => {
    const mockOnSearch = vi.fn();

beforeEach(() => {
    mockOnSearch.mockClear();
    localStorage.clear();
});

    it('renders search input and button', () => {
    render(<Search searchTerm="" onSearch={mockOnSearch} />);

    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
});

it('displays saved search term from localStorage on mount', () => {
    localStorage.setItem('searchTerm', 'saved text');

    render(<Search searchTerm="saved text" onSearch={mockOnSearch} />);

    expect(screen.getByPlaceholderText(/search/i)).toHaveValue('saved text');
});

it('shows empty input when no saved term exists', () => {
    render(<Search searchTerm="" onSearch={mockOnSearch} />);

    expect(screen.getByPlaceholderText(/search/i)).toHaveValue('');
});

it('updates input value when user types', async () => {
    const user = userEvent.setup();

    render(<Search searchTerm='' onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(/search/i);

    await user.type(input, 'hello');

    expect(input).toHaveValue('hello');
});

it('saves search term to localStorage when search button is clicked', async () => {
    const user = userEvent.setup();

    render(<Search searchTerm='' onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(/search/i);
    await user.type(input, 'local text');

    const button = screen.getByRole('button', { name: /search/i });
    await user.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('local text')
});

it('trims whitespace from search input before saving', async () => {
    const user = userEvent.setup();
    render(<Search searchTerm='' onSearch={mockOnSearch} />);

    const input = screen.getByTestId('search-input');
    await user.type(input, ' spaced ');

    const button = screen.getByRole('button', { name: /search/i });
    await user.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('spaced');
});

it('disables button when isLoading is true', () => {
    render(<Search searchTerm='' onSearch={mockOnSearch} isLoading={true} />);
    const button = screen.getByRole('button', { name: /search/i });
    expect(button).toBeDisabled();
})


});


