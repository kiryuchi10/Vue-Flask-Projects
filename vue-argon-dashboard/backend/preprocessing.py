import os
import time
import joblib
import librosa
import numpy as np
from collections import Counter
import pandas as pd
from sklearn.utils import resample

def extract_file_info():
    DATA_PATH = "speech_emotion_recognition/data"

    df = pd.DataFrame(columns=["file", "gender", "emotion", "intensity"])

    for dirname, _, filenames in os.walk(DATA_PATH):
        for filename in filenames:

            emotion = filename[7]
            if emotion == "1":
                emotion = "neutral"
            elif emotion == "2":
                emotion = "calm"
            elif emotion == "3":
                emotion = "happy"
            elif emotion == "4":
                emotion = "sad"
            elif emotion == "5":
                emotion = "angry"
            elif emotion == "6":
                emotion = "fearful"
            elif emotion == "7":
                emotion = "disgusted"
            elif emotion == "8":
                emotion = "surprised"

            intensity = filename[10]
            if intensity == "1":
                emotion_intensity = "normal"
            elif intensity == "2":
                emotion_intensity = "strong"

            gender = filename[-6:-4]
            if int(gender) % 2 == 0:
                gender = "female"
            else:
                gender = "male"

            df = df.append(
                {
                    "file": filename,
                    "gender": gender,
                    "emotion": emotion,
                    "intensity": emotion_intensity,
                },
                ignore_index=True,
            )

    df.to_csv("speech_emotion_recognition/features/df_file_features.csv", index=False)


def extract_features(path, save_dir):
    """This function loops over the audio files,
    extracts the MFCC, and saves X and y in joblib format.
    """
    feature_list = []

    start_time = time.time()
    for dir, _, files in os.walk(path):
        for file in files:
            y_lib, sample_rate = librosa.load(
                os.path.join(dir, file), res_type="kaiser_fast"
            )
            mfccs = np.mean(
                librosa.feature.mfcc(y=y_lib, sr=sample_rate, n_mfcc=40).T, axis=0
            )

            file = int(file[7:8]) - 1
            arr = mfccs, file
            feature_list.append(arr)

    print("Data loaded in %s seconds." % (time.time() - start_time))

    X, y = zip(*feature_list)
    X, y = np.asarray(X), np.asarray(y)
    print(X.shape, y.shape)

    X_save, y_save = "X.joblib", "y.joblib"
    joblib.dump(X, os.path.join(save_dir, X_save))
    joblib.dump(y, os.path.join(save_dir, y_save))

    return "Preprocessing completed."


def custom_oversample(X, y):
    """Custom oversampling to balance the dataset."""
    # Find the maximum number of samples for any class
    max_samples = max(Counter(y).values())

    X_resampled = []
    y_resampled = []

    for label in np.unique(y):
        X_class = X[y == label]
        y_class = y[y == label]

        # Resample the class to have the same number of samples as the max_samples
        X_class_resampled, y_class_resampled = resample(
            X_class,
            y_class,
            replace=True,
            n_samples=max_samples,
            random_state=42
        )

        X_resampled.append(X_class_resampled)
        y_resampled.append(y_class_resampled)

    # Combine the resampled data
    X_resampled = np.vstack(X_resampled)
    y_resampled = np.hstack(y_resampled)

    return X_resampled, y_resampled


def oversample(X, y):
    X = joblib.load("speech_emotion_recognition/features/X.joblib")  # mfcc
    y = joblib.load("speech_emotion_recognition/features/y.joblib")
    print(Counter(y))  # {7: 192, 4: 192, 3: 192, 1: 192, 6: 192, 2: 192, 5: 192, 0: 96}

    X_over, y_over = custom_oversample(X, y)

    X_over_save, y_over_save = "X_over.joblib", "y_over.joblib"
    joblib.dump(X_over, os.path.join("speech_emotion_recognition/features/", X_over_save))
    joblib.dump(y_over, os.path.join("speech_emotion_recognition/features/", y_over_save))


if __name__ == "__main__":
    print("Extracting file info...")
    extract_file_info()
    print("Extracting audio features...")
    FEATURES = extract_features(
        path="speech_emotion_recognition/data/",
        save_dir="speech_emotion_recognition/features/",
    )
    print("Finished extracting audio features.")
    print("Performing oversampling...")
    X, y = joblib.load("speech_emotion_recognition/features/X.joblib"), joblib.load("speech_emotion_recognition/features/y.joblib")
    oversample(X, y)
    print("Oversampling completed.")
