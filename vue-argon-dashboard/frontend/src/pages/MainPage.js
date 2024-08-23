import React, { useState } from "react";
import "./MainPage.css"; // Import the CSS file
import SpeechToText from "../components/SpeechToText"; // Import the SpeechToText component

const MainPage = () => {
  const [messages, setMessages] = useState([]); // Store the conversation messages
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]); // Store uploaded files

  const handleTextSubmit = async (text) => {
    if (text.trim() === "") return;

    // Add the user's message to the conversation
    const userMessage = { sender: "user", text: text };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true); // Start loading

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const errorMessage = await res.text();
        console.error("Error:", errorMessage);
        const botMessage = {
          sender: "bot",
          text: "Error processing your request.",
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        return;
      }

      const data = await res.json();
      const botMessage = { sender: "bot", text: data.response };

      // Add the bot's response to the conversation
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Fetch error:", error);
      const botMessage = {
        sender: "bot",
        text: "An error occurred while processing your request.",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleTextSubmit(input);
  };

  const handleFileUpload = (e) => {
    setFiles(e.target.files);
  };

  const handleFileSubmit = async () => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files[]", files[i]);
    }

    setLoading(true);
    try {
      const res = await fetch("/api/upload-wav", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorMessage = await res.text();
        console.error("Error:", errorMessage);
        const botMessage = {
          sender: "bot",
          text: "Error processing your files.",
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        return;
      }

      const data = await res.json();
      const botMessage = {
        sender: "bot",
        text: "Files processed successfully. Download the CSV from the provided link.",
      };

      // Add the bot's response to the conversation
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Fetch error:", error);
      const botMessage = {
        sender: "bot",
        text: "An error occurred while processing your files.",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-page-container">
      <div className="chat-box">
        <div className="messages-container">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.text}
            </div>
          ))}
          {loading && <div className="message bot">Processing...</div>}
        </div>
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="input-field"
          />
          <button type="submit" className="send-button">
            Send
          </button>
        </form>
      </div>

      {/* Integrate the SpeechToText component (Voicegram) */}
      <SpeechToText onTextSubmit={handleTextSubmit} />

      {/* File upload section */}
      <div className="file-upload-container">
        <button onClick={handleFileSubmit} disabled={files.length === 0}>
          Upload and Process Files
        </button>
        <input type="file" multiple accept=".wav" onChange={handleFileUpload} />
      </div>
    </div>
  );
};

export default MainPage;
