import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fetchItems } from './api';
import type { DummyJsonResponse } from '../test/types';

describe('API Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    globalThis.fetch = vi.fn();
  });

  it('fetches all items when no search term provided', async () => {
    const mockResponse: DummyJsonResponse = {
      products: [
        { id: 1, title: 'Product 1', description: 'Desc 1' }
      ],
      total: 1,
      skip: 0,
      limit: 30
    };

    vi.mocked(globalThis.fetch).mockResolvedValue({
      json: async () => mockResponse
    } as Response);

    const result = await fetchItems('');

    expect(globalThis.fetch).toHaveBeenCalledWith('https://dummyjson.com/products?limit=30');
    expect(result).toEqual([
      { id: 1, name: 'Product 1', description: 'Desc 1' }
    ]);
  });

  it('fetches search results when search term provided', async () => {
    const mockResponse: DummyJsonResponse = {
      products: [
        { id: 2, title: 'iPhone', description: 'Apple phone' }
      ],
      total: 1,
      skip: 0,
      limit: 30
    };

    vi.mocked(globalThis.fetch).mockResolvedValue({
      json: async () => mockResponse
    } as Response);

    const result = await fetchItems('iphone');

    expect(globalThis.fetch).toHaveBeenCalledWith('https://dummyjson.com/products/search?q=iphone');
    expect(result[0].name).toBe('iPhone');
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(globalThis.fetch).mockRejectedValue(new Error('Network error'));

    await expect(fetchItems('test')).rejects.toThrow('Network error');
  });
});