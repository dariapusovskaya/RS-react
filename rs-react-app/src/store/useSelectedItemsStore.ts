import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SelectedItemsState {
    selectedItems: Set<number>;
    toggleItem: (id: number) => void;
    selectAll: (ids: number[]) => void;
    unselectAll: () => void;
    isSelected: (id: number) => boolean;
    getSelectedCount: () => number;
    getSelectedIds: () => number[];
}

export const useSelectedItemsStore = create<SelectedItemsState>() (
    (set, get) => ({
        selectedItems: new Set<number>(),
        toggleItem: (id: number) => {
            set((state) => {
                const newSet = new Set(state.selectedItems);
                if (newSet.has(id)) {
                    newSet.delete(id);
                } else {
                    newSet.add(id);
                }
                return { selectedItems: newSet }
            });
        },

        selectAll: (ids: number[]) => {
            set(() => ({
                selectedItems: new Set(ids)
            }));
        },

        unselectAll: () => {
            set(() => ({
                selectedItems: new Set()
            }));
        },

        isSelected: (id: number) => {
            return get().selectedItems.has(id);
        },

        getSelectedCount: () => {
            return get().selectedItems.size;
        },

        getSelectedIds: () => {
            return Array.from(get().selectedItems);
        }
    })
)