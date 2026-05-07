import React from 'react';

interface BombProps {
  shouldExplode: boolean;
}

class Bomb extends React.Component<BombProps> {
  render() {
    if (this.props.shouldExplode) {
      throw new Error(' Bomb is explode');
  }
  return null;
}
}

export default Bomb;