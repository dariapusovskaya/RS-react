import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode}) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        return savedTheme || 'light';
    });

    useEffect(() => {
        localStorage.setItem('theme', theme);

        if (theme === 'dark') {
            document.documentElement.classList.add('dark-theme');
            document.documentElement.style.backgroundColor = '#1a1a2e';
            document.documentElement.style.color = '#000000';
        } else {
            document.documentElement.classList.remove('dark-theme');
            document.documentElement.style.backgroundColor = '#ffffff';
            document.documentElement.style.color = '#000000';
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
        const context = useContext(ThemeContext);
        if (!context) {
            throw new Error('useTheme must be used within ThemeProvider');
        }
        return context;
    };