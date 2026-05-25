import { useState, useEffect } from 'react';

interface SearchProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  isLoading?: boolean;
}

export const Search = ({ searchTerm, onSearch, isLoading }: SearchProps) => {
  const [inputValue, setInputValue] = useState(searchTerm || '');

  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  const handleSearchClick = () => {
    const trimmedValue = inputValue.trim();
    onSearch(trimmedValue);
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search..."
      />
      <button onClick={handleSearchClick} disabled={isLoading}>
        Search
      </button>
    </div>
  );
};