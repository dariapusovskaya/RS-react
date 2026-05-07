export interface Item {
    id: number;
    name: string;
    description: string;
}

export interface AppState {
    searchTerm: string;
    results: Item[];
    loading: boolean;
    error: string | null;
}

export interface SearchProps {
    searchTerm: string;
    onSearch: (term: string) => void;
    isLoading?: boolean;
}

export interface ApiResponce {
    products: {
        id: number;
        name: string;
        description: string;
    }[];
    total: number;
    skip: number;
    limit: number;
}

export interface ResultsProps {
    results: Item[];
    loading: boolean;
    error: string | null;
}

export interface CardProps {
    item: Item;
}