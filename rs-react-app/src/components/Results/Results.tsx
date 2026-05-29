import CardList from './CardList';
import Loader from '../Loader/Loader';
import type { Item, ResultsProps } from '../../types';


interface ExtendedResultsProps {
    results: Item[];
    loading: boolean;
    error: string | null;
    onItemClick?: (id: number) => void;
    selectedItemId?: string | null;
}

const Results = ({ results, loading, error, onItemClick, selectedItemId }: ExtendedResultsProps) => {
  if (loading) {
      return <Loader />;
  }

  if (error) {
      return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;
  }

  const items = Array.isArray(results) ? results : [];

  return (
      <div style={{ padding: '20px' }}>
      <CardList items={items}
                onItemClick={onItemClick}
                selectedItemId={selectedItemId} />
      </div>
  );
}


export default Results;