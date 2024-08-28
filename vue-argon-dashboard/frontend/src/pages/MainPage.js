import React, { useState, useEffect } from "react";
import "./MainPage.css"; // Import the CSS file
import SpeechToText from "../components/SpeechToText"; // Import the SpeechToText component

const MainPage = () => {
  const [messages, setMessages] = useState([]); // Store the conversation messages
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState(null); // Store predictions
  const [graphUrl, setGraphUrl] = useState(null); // Store URL for the bar chart image

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
      const res = await fetch("/api/predict-voice", {
        method: "POST",
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

      // Fetch the graph after predicting emotions
      fetchGraph();
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

  const fetchGraph = async () => {
    try {
      const res = await fetch("/api/generate-graph");
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setGraphUrl(url);
      } else {
        console.error("Failed to fetch graph");
      }
    } catch (error) {
      console.error("Fetch error:", error);
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

      {/* Integrate the SpeechToText component */}
      <SpeechToText onTextSubmit={handleTextSubmit} />

      {/* Recording and Prediction Section */}
      <div className="recording-container">
        <button onClick={handlePredictEmotion}>
          Predict Emotion
        </button>
        {predictions && (
          <div className="predictions">
            <h3>Predictions:</h3>
            {Object.entries(predictions).map(([emotion, value]) => (
              <p key={emotion}>{`${emotion}: ${value.toFixed(2)}`}</p>
            ))}
          </div>
        )}
      </div>

      {/* Image element to display the combined bar chart */}
      {graphUrl && (
        <div className="chart-container">
          <h3>Emotion Predictions Bar Chart</h3>
          <img
            src={graphUrl}
            alt="Emotion Predictions Bar Chart"
            style={{ width: "100%", height: "auto", maxWidth: "800px" }}
          />
        </div>
      )}
    </div>
  );
};

export default MainPage;
