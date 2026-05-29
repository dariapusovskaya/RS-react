import { describe, it, expect, beforeEach } from 'vitest';
import { useSelectedItemsStore } from './useSelectedItemsStore';

describe('useSelectedItemsStore', () => {
  beforeEach(() => {
    useSelectedItemsStore.setState({ selectedItems: new Set() });
  });

  it('should toggle item selection', () => {
    const { toggleItem, isSelected } = useSelectedItemsStore.getState();
    
    expect(isSelected(1)).toBe(false);
    toggleItem(1);
    expect(isSelected(1)).toBe(true);
    toggleItem(1);
    expect(isSelected(1)).toBe(false);
  });

  it('should unselect all items', () => {
    const { toggleItem, unselectAll, getSelectedIds } = useSelectedItemsStore.getState();
    
    toggleItem(1);
    toggleItem(2);
    expect(getSelectedIds()).toHaveLength(2);
    
    unselectAll();
    expect(getSelectedIds()).toHaveLength(0);
  });
});