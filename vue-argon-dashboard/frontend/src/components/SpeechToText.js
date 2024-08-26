import React, { useState, useEffect } from "react";
import { ReactMic } from "react-mic";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const SpeechToText = ({ onTextSubmit }) => {
  const [recording, setRecording] = useState(false);
  const [progress, setProgress] = useState(0); // Progress for time bar
  const [predictedEmotion, setPredictedEmotion] = useState(null); // Store the predicted emotion
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    let timer;
    let progressInterval;

    if (recording) {
      setProgress(0);

      // Increment the progress bar every 50ms to reach 100% in 5 seconds
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 1;
        });
      }, 50);

      // Stop recording after 5 seconds
      timer = setTimeout(() => {
        stopRecording();
      }, 5000);
    }

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [recording]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const startRecording = async () => {
    setRecording(true);
    resetTranscript(); // Clear previous transcript when starting a new recording
    SpeechRecognition.startListening({ continuous: true });

    // Trigger the backend to start recording
    try {
      const res = await fetch("/start-recording", {
        method: "POST",
      });

      if (!res.ok) {
        console.error("Error starting recording:", await res.text());
        setRecording(false);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setRecording(false);
    }
  };

  const stopRecording = async () => {
    setRecording(false);
    SpeechRecognition.stopListening();

    // Trigger the backend to stop recording and predict the emotion
    try {
      const res = await fetch("/api/predict-voice", {
        method: "POST",
      });

      if (!res.ok) {
        console.error("Error stopping recording:", await res.text());
        return;
      }

      const data = await res.json();
      setPredictedEmotion(data.emotion);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <ReactMic
        record={recording}
        className="sound-wave"
        onStop={() => {}}
        strokeColor="#000000"
        backgroundColor="#FF4081"
        mimeType="audio/wav" // Explicitly setting the MIME type to ensure it's a WAV file
      />
      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#f0f0f0",
          borderRadius: "5px",
          minHeight: "100px",
        }}
      >
        <p>
          <strong>Real-Time Converted Text:</strong>
        </p>
        <p>{transcript}</p>
      </div>
      <div
        style={{
          marginTop: "10px",
          height: "5px",
          backgroundColor: "#ddd",
          borderRadius: "5px",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: "#007bff",
            borderRadius: "5px",
          }}
        />
      </div>
      {/* Button container with flexbox for 1 by 4 arrangement */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between", // Evenly distribute space between buttons
          marginTop: "20px",
        }}
      >
        <button
          onClick={startRecording}
          style={{ flex: 1, margin: "0 5px" }}
          disabled={recording}
        >
          Start
        </button>
        <button
          onClick={stopRecording}
          style={{ flex: 1, margin: "0 5px" }}
          disabled={!recording}
        >
          Stop
        </button>
        <button
          onClick={resetTranscript}
          style={{ flex: 1, margin: "0 5px" }}
        >
          Reset
        </button>
        <button
          onClick={() => onTextSubmit(transcript)}
          style={{ flex: 1, margin: "0 5px" }}
          disabled={!transcript}
        >
          Submit
        </button>
      </div>

      {/* Display predicted emotion */}
      {predictedEmotion && (
        <div style={{ marginTop: "20px" }}>
          <h3>Predicted Emotion:</h3>
          <p>{predictedEmotion}</p>
        </div>
      )}
    </div>
  );
};

export default SpeechToText;
