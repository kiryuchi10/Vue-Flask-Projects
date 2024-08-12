import React, { useState } from 'react';

const Login = () => {  // Fixed the syntax error
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); // Correctly initialized

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName, password })
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(`Login successful: ${data.userName}`);
            } else {
                setMessage('Login failed');
            }
        } catch (error) {
            setMessage('Login failed');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}  {/* Display the message */}
        </div>
    );
};

export default Login;
