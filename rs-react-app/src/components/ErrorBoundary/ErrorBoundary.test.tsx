import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';


const ErrorComponent = () => {
    throw new Error('test error')
};

const SafeComponent = () => <div>Safe component</div>;

describe('ErrorBoundary Component', () => {
    beforeEach(() => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('catches and handles errors in child components', () => {
        render(
            <ErrorBoundary>
                <ErrorComponent />
            </ErrorBoundary>
        );

        expect(screen.getByText(/Smth went wrong/i)).toBeInTheDocument();
    });

    it('renders children when no error occurs', () => {
        render(
            <ErrorBoundary>
                 <SafeComponent />
            </ErrorBoundary>
            );

        expect(screen.getByText('Safe component')).toBeInTheDocument();
        expect(screen.queryByText(/Smth went wrong/i)).not.toBeInTheDocument();
    });

    it('displays fallback UI with error message', () => {
        render(
            <ErrorBoundary>
                <ErrorComponent />
            </ErrorBoundary>
        );

        expect(screen.getByText(/Smth went wrong/i)).toBeInTheDocument();
        expect(screen.getByText(/Technical details/i)).toBeInTheDocument();
    });

});