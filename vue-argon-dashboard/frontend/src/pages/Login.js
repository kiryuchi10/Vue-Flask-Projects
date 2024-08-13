import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Login.css'; // Import the CSS file for login page styling

const Login = () => {
    const [message, setMessage] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName, password })
            });

            if (response.ok) {
                const data = await response.json();
                
                // Assuming the server responds with a token
                const { token } = data;
                
                // Store token in local storage
                localStorage.setItem('authToken', token);

                setMessage('Login successful');
                
                // Redirect to main page
                navigate('/mainpage');
            } else {
                const errorText = await response.text(); // Get error text from response
                setMessage(`Login failed: ${errorText}`);
            }
        } catch (error) {
            setMessage(`Login failed: ${error.message}`);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
                {message && <p className="message">{message}</p>} {/* Display message */}
                <div className="links">
                    <a href="/signup">Sign Up</a> {/* Link to Sign Up page */}
                    <br />
                    <a href="/forgot-password">Forgot Password?</a> {/* Link to Forgot Password page */}
                </div>
            </div>
        </div>
    );
};

export default Login;
