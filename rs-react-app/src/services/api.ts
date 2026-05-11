import type { Item } from "../types";

export async function fetchItems(searchTerm?: string): Promise<Item[]> {

    let url: string;

    if (searchTerm && searchTerm.trim() !== '') {
        url = `https://dummyjson.com/products/search?q=${encodeURIComponent(searchTerm)}`;
    } else {
        url = `https://dummyjson.com/products?limit=30`;
    }

    const responce = await fetch(url);

    const data =  await responce.json();

    const products = data.products;

    interface DummyJsonProduct {
        id: number;
        title: string;
        description: string;
}
    const items: Item[] = products.map((product: DummyJsonProduct) => ({
        id: product.id,
        name: product.title,
        description: product.description
    }));

    return items;
}