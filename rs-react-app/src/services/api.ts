import type { Item } from "../types";


interface DummyJsonResponse {
    products: {
        id: number;
        title: string;
        description: string;
    }[];
    total: number;
    skip: number;
    limit: number;
}

interface FetchItemsParams {
    searchTerm?: string;
    page?: number;
    limit?: number;
}

export async function fetchItems({ searchTerm, page = 1, limit = 10}: FetchItemsParams = {}): Promise<{ items: Item[]; total: number}> {
    const skip = (page - 1) * limit;

    let url: string;

    if (searchTerm && searchTerm.trim() !== '') {
        url = `https://dummyjson.com/products/search?q=${encodeURIComponent(searchTerm)}`;
        } else {
        url = `https://dummyjson.com/products?limit=30`;
        };

        const responce = await fetch(url);
        const data: DummyJsonResponse = await responce.json();

        const items: Item[] = data.products.map(product => ({
        id: product.id,
        name: product.title,
        description: product.description
        }));

        return {
            items,
            total: data.total
        };
}