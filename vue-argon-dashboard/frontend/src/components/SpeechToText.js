import React, { useState } from 'react';
import { ReactMic } from 'react-mic';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const SpeechToText = ({ onTextSubmit }) => {
  const [recording, setRecording] = useState(false);
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const startRecording = () => {
    setRecording(true);
    SpeechRecognition.startListening();
  };

  const stopRecording = () => {
    setRecording(false);
    SpeechRecognition.stopListening();
  };

  const onStop = (recordedBlob) => {
    console.log('Recorded Blob:', recordedBlob);
    // Handle the recorded blob if necessary
  };

  return (
    <div>
      <ReactMic
        record={recording}
        className="sound-wave"
        onStop={onStop}
        strokeColor="#000000"
        backgroundColor="#FF4081"
      />
      <button onClick={startRecording}>Start</button>
      <button onClick={stopRecording}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <p>{transcript}</p>
      <button onClick={() => onTextSubmit(transcript)}>Submit to ChatGPT</button>
    </div>
  );
};

export default SpeechToText;
