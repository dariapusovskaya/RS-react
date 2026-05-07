import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loader from './Loader';

describe('Loader component', () => {
    it('enders loading indicator', () => {
        render(<Loader />);

        expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });

    it('has spinner element', () => {
        const { container } = render(<Loader />);

        const spinner = container.querySelector('[style*="animation"]');
        expect(spinner).toBeInTheDocument();
    });

});