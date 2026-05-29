export interface MockFetch {
  mockResolvedValue: (value: unknown) => void;
  mockRejectedValue: (value: unknown) => void;
  mockResolvedValueOnce: (value: unknown) => void;
  mockRejectedValueOnce: (value: unknown) => void;
  mockClear: () => void;
  mockReset: () => void;
}

export interface DummyJsonProduct {
  id: number;
  title: string;
  description: string;
}

export interface DummyJsonResponse {
  products: DummyJsonProduct[];
  total: number;
  skip: number;
  limit: number;
}