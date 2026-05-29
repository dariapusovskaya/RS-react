import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from './ThemeContext';


const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={toggleTheme} data-testid="toggle-button">
        Toggle Theme
      </button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    document.documentElement.classList.remove('dark-theme');
    document.documentElement.style.backgroundColor = '';
    document.documentElement.style.color = '';
  });

  it('renders children correctly', () => {
    render(
      <ThemeProvider>
        <div data-testid="child">Child Component</div>
      </ThemeProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Child Component')).toBeInTheDocument();
  });

  it('provides default theme as light', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
  });

  it('loads saved theme from localStorage', () => {
    localStorage.setItem('theme', 'dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
  });

  it('toggles theme when toggleTheme is called', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-value')).toHaveTextContent('light');

    const toggleButton = screen.getByTestId('toggle-button');
    await user.click(toggleButton);

    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
  });

  it('saves theme to localStorage when toggled', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-button');
    await user.click(toggleButton);

    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('applies dark theme CSS class and styles when theme is dark', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-button');
    await user.click(toggleButton);

    expect(document.documentElement.classList.contains('dark-theme')).toBe(true);
    expect(document.documentElement.style.backgroundColor).toBe('rgb(26, 26, 46)');
    expect(document.documentElement.style.color).toBe('rgb(0, 0, 0)');
  });

  it('removes dark theme styles when switching back to light', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-button');
    await user.click(toggleButton);

    expect(document.documentElement.classList.contains('dark-theme')).toBe(true);

    await user.click(toggleButton);

    expect(document.documentElement.classList.contains('dark-theme')).toBe(false);
    expect(document.documentElement.style.backgroundColor).toBe('rgb(255, 255, 255)');
  });

  it('throws error when useTheme is used outside ThemeProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      'useTheme must be used within ThemeProvider'
    );

    consoleSpy.mockRestore();
  });

  it('toggles theme correctly on multiple calls', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-button');
    const themeValue = screen.getByTestId('theme-value');

    expect(themeValue).toHaveTextContent('light');

    await user.click(toggleButton);
    expect(themeValue).toHaveTextContent('dark');

    await user.click(toggleButton);
    expect(themeValue).toHaveTextContent('light');

    await user.click(toggleButton);
    expect(themeValue).toHaveTextContent('dark');
  });
});