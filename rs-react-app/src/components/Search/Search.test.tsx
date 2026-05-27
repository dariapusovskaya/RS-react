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

  it('displays searchTerm prop in input', () => {
    render(<Search searchTerm="initial text" onSearch={mockOnSearch} />);
    expect(screen.getByPlaceholderText(/search/i)).toHaveValue('initial text');
  });

  it('updates input when searchTerm prop changes', () => {
    const { rerender } = render(<Search searchTerm="first" onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(/search/i);
    expect(input).toHaveValue('first');

    rerender(<Search searchTerm="second" onSearch={mockOnSearch} />);
    expect(input).toHaveValue('second');
  });

  it('shows empty input when no searchTerm provided', () => {
    render(<Search searchTerm="" onSearch={mockOnSearch} />);
    expect(screen.getByPlaceholderText(/search/i)).toHaveValue('');
  });

  it('updates input value when user types', async () => {
    const user = userEvent.setup();
    render(<Search searchTerm="" onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(/search/i);
    await user.type(input, 'hello');

    expect(input).toHaveValue('hello');
  });

  it('calls onSearch with trimmed value when search button is clicked', async () => {
    const user = userEvent.setup();
    render(<Search searchTerm="" onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(/search/i);
    await user.type(input, '  react  ');

    const button = screen.getByRole('button', { name: /search/i });
    await user.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('react');
  });

  it('trims whitespace from search input before calling onSearch', async () => {
    const user = userEvent.setup();
    render(<Search searchTerm="" onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(/search/i);
    await user.type(input, '   spaced   ');

    const button = screen.getByRole('button', { name: /search/i });
    await user.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('spaced');
  });

  it('calls onSearch with empty string when input contains only spaces', async () => {
    const user = userEvent.setup();
    render(<Search searchTerm="" onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(/search/i);
    await user.type(input, '     ');

    const button = screen.getByRole('button', { name: /search/i });
    await user.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  it('disables button when isLoading is true', () => {
    render(<Search searchTerm="" onSearch={mockOnSearch} isLoading={true} />);
    const button = screen.getByRole('button', { name: /search/i });
    expect(button).toBeDisabled();
  });

  it('enables button when isLoading is false', () => {
    render(<Search searchTerm="" onSearch={mockOnSearch} isLoading={false} />);
    const button = screen.getByRole('button', { name: /search/i });
    expect(button).toBeEnabled();
  });

  it('does not call onSearch when Enter pressed and isLoading is true', async () => {
    const user = userEvent.setup();
    render(<Search searchTerm="" onSearch={mockOnSearch} isLoading={true} />);

    const input = screen.getByPlaceholderText(/search/i);
    await user.type(input, 'test{Enter}');

    expect(mockOnSearch).not.toHaveBeenCalled();
  });
});