import React, { useState } from 'react';
import './MainPage.css'; // Import the CSS file
import SpeechToText from '../components/SpeechToText'; // Import the SpeechToText component

const MainPage = () => {
  const [messages, setMessages] = useState([]); // Store the conversation messages
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTextSubmit = async (text) => {
    if (text.trim() === '') return;

    // Add the user's message to the conversation
    const userMessage = { sender: 'user', text: text };
    setMessages([...messages, userMessage]);
    setInput('');
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
        const botMessage = { sender: 'bot', text: 'Error processing your request.' };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        return;
      }

      const data = await res.json();
      const botMessage = { sender: 'bot', text: data.response };

      // Add the bot's response to the conversation
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Fetch error:', error);
      const botMessage = { sender: 'bot', text: 'An error occurred while processing your request.' };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleTextSubmit(input);
  };

  return (
    <div className="main-page-container">

      {/* Integrate the SpeechToText component (Voicegram) */}
      <SpeechToText onTextSubmit={handleTextSubmit} />

      <div className="chat-box">
        <div className="messages-container">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.text}
            </div>
          ))}
          {loading && <div className="message bot">Typing...</div>}
        </div>
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="input-field"
          />
          <button type="submit" className="send-button">Send</button>
        </form>
      </div>
    </div>
  );
};

export default MainPage;