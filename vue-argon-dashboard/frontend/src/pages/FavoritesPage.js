import React, { useState, useEffect } from "react";
import "./FavoritesPage.css"; // Import styles for the page

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]); // State to store favorite restaurants
  const [loading, setLoading] = useState(false); // State to track loading status
  const [error, setError] = useState(null); // State to handle errors
  const [transcribedText, setTranscribedText] = useState(""); // Store real-time transcribed text
  const [restaurantResults, setRestaurantResults] = useState([]); // Store fetched restaurants
  const [recording, setRecording] = useState(false); // State to track if recording is in progress
  const [textInput, setTextInput] = useState(""); // Store text input

  const userId = 1; // Replace with actual user ID from authentication context

  // Initialize the Speech Recognition API
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition;
  
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true; // Continuous transcription
    recognition.interimResults = true; // Get interim results
  } else {
    setError("Your browser doesn't support speech recognition.");
  }

  // Function to start recording audio and transcribing it in real-time
  const startRecording = () => {
    if (!recognition) return;

    setRecording(true);
    setError(null); // Clear any existing errors
    setTranscribedText(""); // Clear previous transcription

    recognition.start();

    // Event when we get results from speech recognition
    recognition.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscribedText((prev) => prev + transcript + " ");
        } else {
          interimTranscript += transcript;
        }
      }
      setTranscribedText((prev) => prev + interimTranscript); // Update with interim text
    };

    // Event when an error occurs in speech recognition
    recognition.onerror = (event) => {
      setError("Speech recognition error: " + event.error);
    };
  };

  // Function to stop recording and submit transcribed text for processing
  const stopRecording = () => {
    if (!recognition) return;

    recognition.stop();
    setRecording(false);

    if (transcribedText.trim()) {
      searchRestaurants(); // Submit the transcribed text when recording is stopped
    } else {
      setError("No transcribed text found. Please try again.");
    }
  };

  // Function to send either audio or text input to Flask API for restaurant search
  const searchRestaurants = async () => {
    const formData = new FormData();

    if (transcribedText.trim()) {
      formData.append("text", transcribedText);
    } else if (textInput.trim()) {
      formData.append("text", textInput);
    } else {
      setError("Please provide either transcribed text or text input.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/search-restaurants", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process search");
      }

      const data = await response.json();
      if (data.restaurants) {
        setRestaurantResults(data.restaurants); // Display restaurant recommendations
      } else {
        setError("No restaurants found or incorrect intent detected.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Remove a favorite restaurant
  const removeFavorite = async (restaurantName) => {
    try {
      const response = await fetch(`/api/favorites`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, restaurant_name: restaurantName }),
      });

      if (response.ok) {
        setFavorites(favorites.filter((restaurant) => restaurant !== restaurantName)); // Remove from UI
      } else {
        throw new Error("Failed to remove favorite");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // Fetch favorites on component mount
  useEffect(() => {
    fetchFavorites();
  }, []);

  // Function to fetch favorite restaurants
  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/favorites/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch favorites");
      }
      const data = await response.json();
      setFavorites(data); // Set the list of favorite restaurants
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="favorites-page">
      <h1>Your Favorite Restaurants</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {/* Text Input for Restaurant Search */}
      <div className="text-input-container">
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Enter text for restaurant search"
        />
        <button onClick={searchRestaurants}>Search Restaurants</button>
      </div>

      <div className="voice-controls">
        {!recording ? (
          <button onClick={startRecording} className="record-btn">
            Start Recording
          </button>
        ) : (
          <button onClick={stopRecording} className="stop-btn">
            Stop Recording and Submit
          </button>
        )}
        <p>Transcribed Text: {transcribedText}</p>
      </div>

      {!loading && favorites.length === 0 && <p>No favorite restaurants found.</p>}
      <ul className="favorites-list">
        {favorites.map((restaurant, index) => (
          <li key={index} className="favorite-item">
            <span>{restaurant}</span>
            <button onClick={() => removeFavorite(restaurant)} className="remove-btn">
              Remove
            </button>
          </li>
        ))}
      </ul>

      {restaurantResults.length > 0 && (
        <div className="restaurant-results">
          <h2>Recommended Restaurants</h2>
          <ul>
            {restaurantResults.map((restaurant, index) => (
              <li key={index}>
                <h3>{restaurant.name}</h3>
                <p>Rating: {restaurant.rating} / 5</p>
                <p>Total Reviews: {restaurant.total_reviews}</p>
                <p>Summary: {restaurant.summary}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
