import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Flyout } from './Flyout';
import { useSelectedItemsStore } from '../../store/useSelectedItemsStore';

vi.mock('../../store/useSelectedItemsStore', () => ({
  useSelectedItemsStore: vi.fn()
}));

const mockUseSelectedItemsStore = useSelectedItemsStore as unknown as ReturnType<typeof vi.fn>;

describe('Flyout Component', () => {
  const mockItems = [
    { id: 1, name: 'Item 1', description: 'Desc 1' },
    { id: 2, name: 'Item 2', description: 'Desc 2' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when no items selected', () => {
    mockUseSelectedItemsStore.mockReturnValue({
      getSelectedCount: () => 0,
      getSelectedIds: () => [],
      unselectAll: vi.fn()
    });

    const { container } = render(<Flyout items={mockItems} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render when items are selected', () => {
    mockUseSelectedItemsStore.mockReturnValue({
      getSelectedCount: () => 2,
      getSelectedIds: () => [1, 2],
      unselectAll: vi.fn()
    });

    render(<Flyout items={mockItems} />);
    expect(screen.getByText(/Selected: 2 items/i)).toBeInTheDocument();
    expect(screen.getByText('Unselect all')).toBeInTheDocument();
    expect(screen.getByText('Download CSV')).toBeInTheDocument();
  });

  it('should call unselectAll when Unselect all button is clicked', async () => {
    const user = userEvent.setup();
    const mockUnselectAll = vi.fn();
    
    mockUseSelectedItemsStore.mockReturnValue({
      getSelectedCount: () => 2,
      getSelectedIds: () => [1, 2],
      unselectAll: mockUnselectAll
    });

    render(<Flyout items={mockItems} />);
    
    const unselectButton = screen.getByText('Unselect all');
    await user.click(unselectButton);
    
    expect(mockUnselectAll).toHaveBeenCalledTimes(1);
  });

  it('should download CSV when Download CSV button is clicked', async () => {
  const user = userEvent.setup();
  
  mockUseSelectedItemsStore.mockReturnValue({
    getSelectedCount: () => 2,
    getSelectedIds: () => [1, 2],
    unselectAll: vi.fn()
  });

  globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
  globalThis.URL.revokeObjectURL = vi.fn();

  render(<Flyout items={mockItems} />);
  
  const downloadButton = screen.getByText('Download CSV');
  
  await expect(user.click(downloadButton)).resolves.not.toThrow();
  
  expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
});
});