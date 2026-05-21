import { Link, Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const RootLayout = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div>
        <nav style={{
            display: 'flex',
            gap: '20px',
            padding: '16px',
            backgroundColor: '#f0f0f0',
            borderBottom: '1px solid #ccc'
        }}>
            <Link to="/" style={{ color: theme === 'dark' ? '#fff' : '#000' }}>Home</Link>
            <Link to="/about" style={{ color: theme === 'dark' ? '#fff' : '#000' }}>About</Link>
            <button
                onClick={toggleTheme}
                style={{
                    marginLeft: 'auto',
                    padding: '8px 16px',
                    backgroundColor: theme === 'dark' ? '#e94560' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
                >
                {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
        </nav>

        <main style={{padding:'20px'}}>
            <Outlet />
        </main>

        <footer style={{
            textAlign: 'center',
            padding: '16px',
            borderTop: '1px solid #ccc',
            marginTop: '40px'
        }}>
            2026 dariapusovskaya
        </footer>
        </div>
    );
};

export default RootLayout;