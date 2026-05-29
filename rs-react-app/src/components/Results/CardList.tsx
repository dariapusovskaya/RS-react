import Card from './Card';
import type { Item } from '../../types';
import { useSelectedItemsStore } from '../../store/useSelectedItemsStore';

interface CardListProps {
  items?: Item[];
  onItemClick?: (id: number) => void;
  selectedItemId?: string | null;
}

const CardList = ({ items, onItemClick, selectedItemId }: CardListProps) => {
  const { toggleItem, isSelected } = useSelectedItemsStore();

  const handleCheckboxClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    toggleItem(id);
  };


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
            transition: 'background-color 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <input 
            type="checkbox"
            checked={isSelected(item.id)}
            onChange={() => {}}
            onClick={(e) => handleCheckboxClick(e, item.id)}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
          <div style={{flex: 1}}>
          <Card item={item} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardList;