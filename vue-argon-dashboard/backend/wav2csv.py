import subprocess
import scipy.io.wavfile as wavfile
import numpy as np
import pandas as pd
import os
import sys
import tempfile

def convert_to_wav_ffmpeg(input_file):
    """
    Convert a non-standard audio file to a standard WAV file using FFmpeg.
    :param input_file: Path to the input file.
    :return: Path to the temporary WAV file.
    """
    try:
        temp_wav_path = tempfile.mktemp(suffix='.wav')
        command = ['ffmpeg', '-i', input_file, '-acodec', 'pcm_s16le', '-ar', '44100', temp_wav_path]
        subprocess.run(command, check=True)
        return temp_wav_path
    except subprocess.CalledProcessError as e:
        print(f"Error converting file {input_file}: {e}")
        return None

def extract_features(wav_file):
    """
    Extract basic audio features from a WAV file using scipy.io.wavfile.
    :param wav_file: Path to the WAV file.
    :return: Dictionary with feature names and their values.
    """
    try:
        sr, y = wavfile.read(wav_file)
        
        # Normalize the audio data
        y = y / np.max(np.abs(y), axis=0)

        # Compute basic features
        duration = len(y) / sr
        mean_amplitude = np.mean(np.abs(y))
        max_amplitude = np.max(np.abs(y))
        rms = np.sqrt(np.mean(y**2))
        zero_crossing_rate = np.mean(np.diff(np.sign(y)) != 0)

        features = {
            'file_name': os.path.basename(wav_file),
            'duration': duration,
            'mean_amplitude': mean_amplitude,
            'max_amplitude': max_amplitude,
            'rms': rms,
            'zero_crossing_rate': zero_crossing_rate,
        }
        return features
    except Exception as e:
        print(f"Error extracting features from {wav_file}: {e}")
        return None

def save_to_csv(features_list, output_file):
    df = pd.DataFrame(features_list)
    df.to_csv(output_file, index=False)

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python wav2csv.py output.csv file1.wav file2.wav ...")
        sys.exit(1)

    output_file = sys.argv[1]
    wav_files = sys.argv[2:]

    all_features = []
    for file in wav_files:
        # Convert to WAV format using FFmpeg
        wav_file = convert_to_wav_ffmpeg(file)
        if wav_file is not None:
            # Extract features from the converted WAV file
            features = extract_features(wav_file)
            if features is not None:
                all_features.append(features)
            # Remove the temporary WAV file after processing
            os.remove(wav_file)

    save_to_csv(all_features, output_file)
    print(f"Features extracted and saved to {output_file}.")
