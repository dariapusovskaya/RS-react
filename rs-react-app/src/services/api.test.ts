import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fetchItems } from './api';

describe('API Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    globalThis.fetch = vi.fn();
  });

  it('fetches all items when no search term provided', async () => {
    const mockResponse = {
      products: [
        { id: 1, title: 'Product 1', description: 'Desc 1' }
      ],
      total: 1,
      skip: 0,
      limit: 30
    };

    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    } as Response);

    const result = await fetchItems({ searchTerm: '' });

    expect(globalThis.fetch).toHaveBeenCalledWith('https://dummyjson.com/products?limit=30');
    expect(result).toEqual({
      items: [
        { id: 1, name: 'Product 1', description: 'Desc 1' }
      ],
      total: 1
    });
  });

  it('fetches search results when search term provided', async () => {
    const mockResponse = {
      products: [
        { id: 2, title: 'iPhone', description: 'Apple phone' }
      ],
      total: 1,
      skip: 0,
      limit: 30
    };

    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    } as Response);

    const result = await fetchItems({ searchTerm: 'iphone' });

    expect(globalThis.fetch).toHaveBeenCalledWith('https://dummyjson.com/products/search?q=iphone');
    expect(result.items[0].name).toBe('iPhone');
    expect(result.items[0].id).toBe(2);
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(globalThis.fetch).mockRejectedValue(new Error('Network error'));

    await expect(fetchItems({ searchTerm: 'test' })).rejects.toThrow('Network error');
  });

  it('fetches items with default parameters when no params provided', async () => {
    const mockResponse = {
      products: [],
      total: 0,
      skip: 0,
      limit: 30
    };

    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    } as Response);

    await fetchItems();

    expect(globalThis.fetch).toHaveBeenCalledWith('https://dummyjson.com/products?limit=30');
  });

  it('handles search with empty string as searchTerm', async () => {
    const mockResponse = {
      products: [
        { id: 3, title: 'Product 3', description: 'Desc 3' }
      ],
      total: 1,
      skip: 0,
      limit: 30
    };

    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    } as Response);

    const result = await fetchItems({ searchTerm: '   ' });

    expect(globalThis.fetch).toHaveBeenCalledWith('https://dummyjson.com/products?limit=30');
    expect(result.items).toHaveLength(1);
  });
});