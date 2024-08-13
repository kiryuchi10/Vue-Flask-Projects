import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    try {
      // Assuming you have an API endpoint for password reset
      const response = await fetch('/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('A password reset link has been sent to your email address.');
      } else {
        const errorText = await response.text(); // Get error text from response
        setMessage(`Password reset failed: ${errorText}`);
      }
    } catch (error) {
      setMessage(`Password reset failed: ${error.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Forgot Password</h2>
      <form onSubmit={handlePasswordReset}>
        <div style={{ marginBottom: '16px' }}>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>
          Send Reset Link
        </button>
      </form>
      {message && <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>} {/* Display message */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Link to="/login" style={{ textDecoration: 'none', color: '#007bff' }}>
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
