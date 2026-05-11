import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import CardList from './CardList';

describe('Cardlist Component', () => {
    const mockItem = [
        { id: 1, name: 'Item 1', description: 'Desc 1' },
        { id: 2, name: 'Item 2', description: 'Desc 2' },
        { id: 3, name: 'Item 3', description: 'Desc 3' }
    ];

    it('enders correct number of items when data is provided', () => {
        render(<CardList items={mockItem} />);

        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
        expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('displays "no results" message when data array is empty', () => {
        render(<CardList items={[]} />);

        expect(screen.getByText(/No items found/i)).toBeInTheDocument();
    });

    it('renders nothing when items is undefined', () => {
        render(<CardList items={undefined as never} />);
    });
});