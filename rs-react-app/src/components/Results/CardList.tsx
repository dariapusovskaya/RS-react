import React from 'react';
import Card from './Card';
import type { Item } from '../../types';

interface CardListProps {
  items?: Item[];
}

class CardList extends React.Component<CardListProps> {
  render() {
    const { items } = this.props;
    
    if (!items || items.length === 0) {
      return <p>No items found</p>;
    }

    return (
      <div>
        {items.map(item => (
          <Card key={item.id} item={item} />
        ))}
      </div>
    );
  }
}

export default CardList;