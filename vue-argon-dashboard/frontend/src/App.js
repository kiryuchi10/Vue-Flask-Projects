import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';
import Signup from './Signup';
import Login from './Login';

const App = () => {
    const [message, setMessage] = useState('');

    return (
        <Router>
            <div>
                {message && <p>{message}</p>}
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login setMessage={setMessage} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
