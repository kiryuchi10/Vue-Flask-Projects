import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import MainPage from './MainPage';
import Signup from './Signup';
import Login from './Login';

const NavigationButtons = () => {
    const navigate = useNavigate();

    return (
        <nav>
            <button onClick={() => navigate('/')}>Main Page</button>
            <button onClick={() => navigate('/signup')}>Signup</button>
            <button onClick={() => navigate('/login')}>Login</button>
        </nav>
    );
};

const App = () => {
    const [message, setMessage] = useState('');

    return (
        <Router>
            <div>
                <NavigationButtons />
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login setMessage={setMessage} />} />
                </Routes>

                {message && <p>{message}</p>}
            </div>
        </Router>
    );
};

export default App;
