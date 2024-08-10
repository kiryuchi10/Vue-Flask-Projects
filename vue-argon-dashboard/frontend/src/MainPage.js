import React from 'react';
import { Link } from 'react-router-dom';

const MainPage = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
            <h1>Welcome to the Main Page</h1>
            <p>
                <Link to="/login">
                    <button style={{ padding: '10px', margin: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
                        Login
                    </button>
                </Link>
            </p>
            <p>
                <Link to="/signup">
                    <button style={{ padding: '10px', margin: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
                        Signup
                    </button>
                </Link>
            </p>
        </div>
    );
};

export default MainPage;
