import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import Bomb from './Bomb';

describe('Bomb component', () => {
  it('renders nothing when shouldExplode is false', () => {
    const { container } = render(<Bomb shouldExplode={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('throws an error with correct message when shouldExplode is true', () => {
    // Подавляем ошибки React в консоли
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<Bomb shouldExplode={true} />)).toThrow('Bomb is explode');
  });
});