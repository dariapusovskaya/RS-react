import { Link, Outlet } from "react-router-dom";

const RootLayout = () => {
    return (
        <div>
        <nav style={{
            display: 'flex',
            gap: '20px',
            padding: '16px',
            backgroundColor: '#f0f0f0',
            borderBottom: '1px solid #ccc'
        }}>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
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