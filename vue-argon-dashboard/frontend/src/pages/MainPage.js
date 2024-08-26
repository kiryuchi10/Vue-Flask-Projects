import React, { useState } from "react";
import "./MainPage.css"; // Import the CSS file
import SpeechToText from "../components/SpeechToText"; // Import the SpeechToText component

const MainPage = () => {
  const [messages, setMessages] = useState([]); // Store the conversation messages
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]); // Store uploaded files
  const [filePath, setFilePath] = useState(""); // Store the path of the recorded file
  const [predictions, setPredictions] = useState(null); // Store predictions

  const handleTextSubmit = async (text) => {
    if (text.trim() === "") return;

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

  const handlePredictEmotion = async () => {
    setLoading(true);
    try {
      const res = await fetch("/predicting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file_path: filePath }),
      });

      if (!res.ok) {
        const errorMessage = await res.text();
        console.error("Error:", errorMessage);
        const botMessage = {
          sender: "bot",
          text: "Error during prediction.",
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        return;
      }

      const data = await res.json();
      setPredictions(data);

      const botMessage = {
        sender: "bot",
        text: "Prediction successful!",
      };

      // Add the bot's response to the conversation
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Fetch error:", error);
      const botMessage = {
        sender: "bot",
        text: "An error occurred during prediction.",
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

      {/* Recording and Prediction Section */}
      <div className="recording-container">
        <button onClick={handlePredictEmotion} disabled={!filePath}>
          Predict Emotion
        </button>
        {predictions && (
          <div className="predictions">
            <h3>Predictions:</h3>
            <p>Logistic Regression: {predictions.LogisticRegression}</p>
            <p>SVM: {predictions.SVM}</p>
            <p>KNN: {predictions.Knn}</p>
            <p>CNN: {predictions.CNN}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
