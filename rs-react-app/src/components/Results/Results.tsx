import React from 'react';
import CardList from './CardList';
import Loader from '../Loader/Loader';
import type { ResultsProps } from '../../types';

class Results extends React.Component<ResultsProps> {
  render() {
    const { results, loading, error } = this.props;

    if (loading) {
      return <Loader />;
    }

    if (error) {
      return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;
    }

    return (
      <div style={{ padding: '20px' }}>
        <CardList items={results} />
      </div>
    );
  }
}

export default Results;