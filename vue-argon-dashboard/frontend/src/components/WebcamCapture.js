import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [emotion, setEmotion] = useState("");
  
  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    // Send image to Flask backend for emotion detection
    axios.post("http://localhost:5000/detect_emotion", { image: imageSrc })
      .then((response) => {
        setEmotion(response.data.emotion);
      })
      .catch((error) => {
        console.error("Error detecting emotion:", error);
      });
  };

  // Capture an image every 5 seconds
  useEffect(() => {
    const interval = setInterval(captureImage, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
      <h2>Detected Emotion: {emotion}</h2>
    </div>
  );
};

export default WebcamCapture;