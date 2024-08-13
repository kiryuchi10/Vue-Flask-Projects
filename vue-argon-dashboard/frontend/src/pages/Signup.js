import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [branchId, setBranchId] = useState('');
    const [email, setEmail] = useState('');  // New state for email

    const handleSignup = () => {
        axios.post('/signup', {
            userName: userName,
            password: password,
            branchId: branchId,
            email: email   // Include email in the request payload
        })
        .then(response => {
            alert(response.data.message);
        })
        .catch(error => {
            console.error('There was an error signing up!', error);
            alert('Error: ' + error.response.data.message);
        });
    };

    return (
        <div className="signup">
            <h2>Sign Up</h2>
            <input
                type="text"
                placeholder="User Name"
                onChange={(e) => setUserName(e.target.value)}
                value={userName}
            />
            <input
                type="email"   // Input type email for email address
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />
            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />
            <input
                type="text"
                placeholder="Branch ID"
                onChange={(e) => setBranchId(e.target.value)}
                value={branchId}
            />
            <button onClick={handleSignup}>Sign Up</button>
        </div>
    );
};

export default Signup;
