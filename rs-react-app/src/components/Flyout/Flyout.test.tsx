import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Flyout } from './Flyout';
import { useSelectedItemsStore } from '../../store/useSelectedItemsStore';

// Мокаем store
vi.mock('../../store/useSelectedItemsStore', () => ({
  useSelectedItemsStore: vi.fn()
}));

describe('Flyout Component', () => {
  const mockItems = [
    { id: 1, name: 'Item 1', description: 'Desc 1' },
    { id: 2, name: 'Item 2', description: 'Desc 2' }
  ];

  it('should not render when no items selected', () => {
    (useSelectedItemsStore as any).mockReturnValue({
      getSelectedCount: () => 0,
      getSelectedIds: () => [],
      unselectAll: vi.fn()
    });

    const { container } = render(<Flyout items={mockItems} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render when items are selected', () => {
    (useSelectedItemsStore as any).mockReturnValue({
      getSelectedCount: () => 2,
      getSelectedIds: () => [1, 2],
      unselectAll: vi.fn()
    });

    render(<Flyout items={mockItems} />);
    expect(screen.getByText(/Selected: 2 items/i)).toBeInTheDocument();
    expect(screen.getByText('Unselect all')).toBeInTheDocument();
    expect(screen.getByText('Download CSV')).toBeInTheDocument();
  });
});