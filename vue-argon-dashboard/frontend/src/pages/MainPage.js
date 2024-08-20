import React, { useState } from 'react';
import './MainPage.css'; // Import the CSS file
import SpeechToText from '../components/SpeechToText'; // Import the SpeechToText component

const MainPage = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTextSubmit = async (text) => {
    setLoading(true); // Start loading

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const errorMessage = await res.text();
        console.error('Error:', errorMessage);
        setResponse('Error processing your request.'); // Display error message
        return;
      }

      const data = await res.json();
      setResponse(data.response); // Set the bot's response
    } catch (error) {
      console.error('Fetch error:', error);
      setResponse('An error occurred while processing your request.'); // Display catch error
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="main-page-container">
      <div className="main-page-content">
        <h1>Welcome to the Main Page</h1>
        <p>This is the central content of the main page.</p>
        
        {/* Integrate the SpeechToText component */}
        <SpeechToText onTextSubmit={handleTextSubmit} />
        
        {/* Display the buffering bar while loading */}
        {loading && <div className="buffering-bar"></div>}

        {/* Display the response from the chatbot */}
        <div className="chatgpt-response">
          <h2>Response from the Chatbot:</h2>
          <p>{response}</p>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
