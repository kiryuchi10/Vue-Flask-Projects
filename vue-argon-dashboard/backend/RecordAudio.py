import soundfile as sf
import sounddevice as sd
from datetime import datetime
import os

def record_voice():
    """This function records your voice and saves the output as .wav file."""
    fs = 44100  # Sample rate
    seconds = 3  # Duration of recording
    directory = "recordings"

    # Ensure the directory exists
    os.makedirs(directory, exist_ok=True)

    # Generate a unique filename based on the current date and time
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = os.path.join(directory, f"voice_{timestamp}.wav")

    print("Say something:")
    myrecording = sd.rec(int(seconds * fs), samplerate=fs, channels=2)
    sd.wait()  # Wait until recording is finished

    # Save the recording as a WAV file
    sf.write(filename, myrecording, fs)
    print(f"Voice recording saved as {filename}.")

    return filename
