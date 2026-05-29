import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Results from './Results';

describe('Results Component', () => {
    const mockResults = [
        { id: 1, name: 'Test 1', description: 'Desc 1' },
        { id: 2, name: 'Test 2', description: 'Desc 2' }
    ];

    it('shows loading state while fetching data', () => {
        render(<Results results={[]} loading={true} error={null} />);
    
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
        expect(screen.queryByText('Test 1')).not.toBeInTheDocument();
    });

    it('displays error message when API call fails', () => {
        render(<Results results={[]} loading={false} error="Ошибка загрузки" />);
    
        expect(screen.getByText(/Ошибка загрузки/i)).toBeInTheDocument();
    });

    it('renders results when data is provided', () => {
        render(<Results results={mockResults} loading={false} error={null} />);
    
        expect(screen.getByText('Test 1')).toBeInTheDocument();
        expect(screen.getByText('Test 2')).toBeInTheDocument();
        expect(screen.queryByText(/загрузка/i)).not.toBeInTheDocument();
    });

    it('shows empty state when results array is empty', () => {
        render(<Results results={[]} loading={false} error={null} />);

        expect(screen.getByText(/No items found/i)).toBeInTheDocument();
    })
})