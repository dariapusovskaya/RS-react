import Card from './Card';
import type { Item } from '../../types';

interface CardListProps {
  items?: Item[];
  onItemClick?: (id: number) => void;
  selectedItemId?: string | null;
}

const CardList = ({ items, onItemClick, selectedItemId }: CardListProps) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
     return <p>No items found</p>;
  }

  return (
         <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {items.map(item => (
        <div 
          key={item.id} 
          onClick={() => onItemClick?.(item.id)}
          style={{ 
            cursor: onItemClick ? 'pointer' : 'default',
            backgroundColor: selectedItemId === String(item.id) ? '#e3f2fd' : 'transparent',
            borderRadius: '8px',
            transition: 'background-color 0.2s ease'
          }}
        >
          <Card item={item} />
        </div>
      ))}
    </div>
  );
};

export default CardList;