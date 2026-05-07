import React from 'react';
import type { CardProps } from '../../types';

class Card extends React.Component<CardProps> {
  render() {
    const { item } = this.props;
    return (
      <div style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        margin: '8px 0',
        backgroundColor: '#f9f9f9'
      }}>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
      </div>
    );
  }
}

export default Card;