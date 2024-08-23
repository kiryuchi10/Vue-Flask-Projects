import React, { useState, useEffect } from "react";
import { ReactMic } from "react-mic";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { saveAs } from "file-saver";

const SpeechToText = ({ onTextSubmit }) => {
  const [recording, setRecording] = useState(false);
  const [progress, setProgress] = useState(0); // Progress for time bar
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

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

  const startRecording = () => {
    setRecording(true);
    resetTranscript(); // Clear previous transcript when starting a new recording
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopRecording = () => {
    setRecording(false);
    SpeechRecognition.stopListening();
  };

  const onStop = (recordedBlob) => {
    // Validate the recorded audio before saving
    if (validateAudioFile(recordedBlob)) {
      saveAsWAV(recordedBlob); // Save the audio data as a WAV file
    } else {
      alert("The recorded file is not in a valid audio format.");
    }
  };

  const validateAudioFile = (recordedBlob) => {
    // Check if the audio file is in the correct format (WAV)
    return recordedBlob.blob && recordedBlob.blob.type === "audio/wav";
  };

  const saveAsWAV = (recordedBlob) => {
    // Generate the current date and time in a readable format
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:.]/g, ""); // Format as YYYYMMDDTHHmmss
    const filename = `voicegram_data_${timestamp}.wav`;

    // Save the WAV file with the generated filename
    saveAs(recordedBlob.blob, filename);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <ReactMic
        record={recording}
        className="sound-wave"
        onStop={onStop}
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
    </div>
  );
};

export default SpeechToText;