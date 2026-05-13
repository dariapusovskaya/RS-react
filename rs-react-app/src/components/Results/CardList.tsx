import Card from './Card';
import type { Item } from '../../types';

interface CardListProps {
  items?: Item[];
}

const CardList = ({ items }: CardListProps) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
     return <p>No items found</p>;
  }

  return (
         <div>
        {items.map(item => (
        <div 
          key={item.id}
        >
          <Card item={item} />
        </div>
      ))}
    </div>
  );
};

export default CardList;