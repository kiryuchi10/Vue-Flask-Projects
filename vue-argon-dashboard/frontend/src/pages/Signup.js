import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
    const [userNo, setUserNo] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [branchId, setBranchId] = useState('');
    const [authCode, setAuthCode] = useState('');

    const handleSignup = () => {
        axios.post('/signup', {
            userNo: userNo,
            userName: userName,
            password: password,
            branchId: branchId,
            authCode: authCode
        })
        .then(response => {
            alert(response.data);
        })
        .catch(error => {
            console.error(error);
        });
    };

    return (
        <div className="signup">
            <h2>Sign Up</h2>
            <input
                type="number"
                placeholder="User Number"
                onChange={(e) => setUserNo(e.target.value)}
                value={userNo}
            />
            <input
                type="text"
                placeholder="User Name"
                onChange={(e) => setUserName(e.target.value)}
                value={userName}
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
            <input
                type="text"
                placeholder="Auth Code"
                onChange={(e) => setAuthCode(e.target.value)}
                value={authCode}
            />
            <button onClick={handleSignup}>Sign Up</button>
        </div>
    );
};

export default Signup;