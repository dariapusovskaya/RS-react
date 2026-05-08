import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fetchItems } from './api';


globalThis.fetch = vi.fn();

describe('API Service', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('fetches all items when no search term provided', async () => {
        const mockResponce = {
            products: [
            { id: 1, title: 'Product 1', description: 'Desc 1' }
            ]
        };

        (globalThis.fetch as any).mockResolvedValue({
            json: async () => mockResponce
        });

        const result = await fetchItems('');

        expect(globalThis.fetch).toHaveBeenCalledWith('https://dummyjson.com/products?limit=30');
        expect(result).toEqual([
            { id: 1, name: 'Product 1', description: 'Desc 1' }
        ]);
    });

    it('fetches search results when search term provided', async () => {
        const mockResponse = {
            products: [
                { id: 2, title: 'iPhone', description: 'Apple phone' }
            ]
        };

        (globalThis.fetch as any).mockResolvedValue({
            json: async () => mockResponse
        });

        const result = await fetchItems('iphone');

        expect(globalThis.fetch).toHaveBeenCalledWith('https://dummyjson.com/products/search?q=iphone');
        expect(result[0].name).toBe('iPhone');
    });

    it('handles API errors gracefully', async () => {
        (globalThis.fetch as any).mockRejectedValue(new Error('Network error'));

        await expect(fetchItems('test')).rejects.toThrow('Network error');
    });
});