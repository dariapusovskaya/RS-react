// src/components/ItemDetails/ItemDetails.test.tsx
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ItemDetails from './ItemDetails';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useOutletContext: vi.fn()
  };
});

import { useOutletContext } from 'react-router-dom';

describe('ItemDetails', () => {
  const mockItem = {
    id: 1,
    title: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    brand: 'Test Brand',
    category: 'Test Category',
    rating: 4.5,
    stock: 10,
    thumbnail: 'https://example.com/image.jpg'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  it('fetches and displays item details when itemId is provided', async () => {
    vi.mocked(useOutletContext).mockReturnValue({ itemId: '1' });
    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: true,
      json: async () => mockItem
    } as Response);

    render(
      <MemoryRouter>
        <ItemDetails />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading details...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('Test Brand')).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByText('4.5 / 5')).toBeInTheDocument();
    expect(screen.getByText('10 units')).toBeInTheDocument();

    expect(globalThis.fetch).toHaveBeenCalledWith('https://dummyjson.com/products/1');
  });

  it('returns null when itemId is not provided', () => {
    vi.mocked(useOutletContext).mockReturnValue({ itemId: null });

    const { container } = render(
      <MemoryRouter>
        <ItemDetails />
      </MemoryRouter>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('shows loading state while fetching data', async () => {
    vi.mocked(useOutletContext).mockReturnValue({ itemId: '1' });
    
    let resolvePromise: (value: any) => void;
    const promise = new Promise(resolve => {
      resolvePromise = resolve;
    });
    
    vi.mocked(globalThis.fetch).mockReturnValue(promise as Promise<Response>);

    render(
      <MemoryRouter>
        <ItemDetails />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading details...')).toBeInTheDocument();
    expect(screen.getByText('Loading details...')).toBeVisible();

    resolvePromise!({
      ok: true,
      json: async () => mockItem
    } as Response);
  });

  it('displays error message when API call fails', async () => {
    vi.mocked(useOutletContext).mockReturnValue({ itemId: '1' });
    vi.mocked(globalThis.fetch).mockRejectedValue(new Error('Network error'));

    render(
      <MemoryRouter>
        <ItemDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load item details')).toBeInTheDocument();
    });
  });

  it('shows "Item not found" when item is null', async () => {
    vi.mocked(useOutletContext).mockReturnValue({ itemId: '1' });
    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: true,
      json: async () => null
    } as Response);

    render(
      <MemoryRouter>
        <ItemDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Item not found')).toBeInTheDocument();
    });
  });

  it('refetches data when itemId changes', async () => {
    const mockItem1 = { ...mockItem, id: 1, title: 'Product 1' };
    const mockItem2 = { ...mockItem, id: 2, title: 'Product 2' };

    vi.mocked(useOutletContext).mockReturnValue({ itemId: '1' });
    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: true,
      json: async () => mockItem1
    } as Response);

    const { rerender } = render(
      <MemoryRouter>
        <ItemDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });

    vi.mocked(useOutletContext).mockReturnValue({ itemId: '2' });
    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: true,
      json: async () => mockItem2
    } as Response);

    rerender(
      <MemoryRouter>
        <ItemDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });
  });

it('clears item when itemId becomes null', async () => {
  vi.mocked(useOutletContext).mockReturnValue({ itemId: '1' });

  vi.mocked(globalThis.fetch).mockResolvedValue({
    ok: true,
    json: async () => mockItem
  } as Response);

  const { rerender, container } = render(
    <MemoryRouter>
      <ItemDetails />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  vi.mocked(useOutletContext).mockReturnValue({ itemId: null });

  rerender(
    <MemoryRouter>
      <ItemDetails />
    </MemoryRouter>
  );

  expect(container).toBeEmptyDOMElement();
});

  it('does not show thumbnail when thumbnail is missing', async () => {
    const itemWithoutThumbnail = { ...mockItem, thumbnail: '' };
    vi.mocked(useOutletContext).mockReturnValue({ itemId: '1' });
    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: true,
      json: async () => itemWithoutThumbnail
    } as Response);

    render(
      <MemoryRouter>
        <ItemDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    const images = screen.queryAllByRole('img');
    expect(images.length).toBe(0);
  });

  it('shows thumbnail when thumbnail is provided', async () => {
    vi.mocked(useOutletContext).mockReturnValue({ itemId: '1' });
    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: true,
      json: async () => mockItem
    } as Response);

    render(
      <MemoryRouter>
        <ItemDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      const image = screen.getByAltText('Test Product');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    });
  });
});