interface BombProps {
  shouldExplode: boolean;
}

const Bomb = ({ shouldExplode }: BombProps) => {
  if (shouldExplode) {
    throw new Error('Bomb is explode');
  }
  return null;
};


export default Bomb;