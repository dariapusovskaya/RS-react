import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from './Card';

describe('Card component', () => {
    const mockItem = {
        id: 1,
        name: 'Test IPhone',
        description: 'This is a test description'
    }


it('displays item name and description correctly', () => {
    render(<Card item={mockItem} />);

    expect(screen.getByText('Test IPhone')).toBeInTheDocument();
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
});

it('handles long text gracefully', () => {
    const longItem = {
        ...mockItem,
        description: 'A'.repeat(500)
    };

    render(<Card item={longItem} />);

    expect(screen.getByText('A'.repeat(500))).toBeInTheDocument();
});

});