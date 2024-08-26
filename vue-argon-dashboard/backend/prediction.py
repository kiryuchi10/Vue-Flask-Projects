import os
import numpy as np
import pandas as pd
import librosa
import keras

def make_predictions(file):
    # Get the current directory of the script
    current_dir = os.path.dirname(os.path.abspath(__file__))

    # Construct the full path to the cnn_model.h5 file
    model_path = os.path.join(current_dir, 'models', 'emotion_model.h5')

    # Load the model
    cnn_model = keras.models.load_model(model_path)
    
    # Load the audio file
    prediction_data, prediction_sr = librosa.load(
        file,
        res_type="kaiser_fast",
        duration=3,
        sr=22050,
        offset=0.5,
    )

    # Extract MFCC features
    mfccs = np.mean(
        librosa.feature.mfcc(y=prediction_data, sr=prediction_sr, n_mfcc=40).T, axis=0
    )
    x = np.expand_dims(mfccs, axis=1)
    x = np.expand_dims(x, axis=0)

    # Predict probabilities for each emotion
    predictions = cnn_model.predict(x)

    # Map predictions to emotion labels
    emotions_dict = {
        "0": "neutral",
        "1": "calm",
        "2": "happy",
        "3": "sad",
        "4": "angry",
        "5": "fearful",
        "6": "disgusted",
        "7": "surprised",
    }

    # Ensure we only use available predictions
    prediction_dict = {emotions_dict[str(i)]: predictions[0][i] for i in range(predictions.shape[1])}

    return prediction_dict


def predict_all_files_in_folder(folder_path):
    results = []
    for file_name in os.listdir(folder_path):
        if file_name.endswith('.wav'):
            file_path = os.path.join(folder_path, file_name)
            prediction_dict = make_predictions(file_path)
            prediction_dict['filename'] = file_name
            results.append(prediction_dict)
    
    # Convert results into a DataFrame
    df = pd.DataFrame(results)
    return df

# Example usage
current_path=os.getcwd()
folder_path = 'recordings'
df_results = predict_all_files_in_folder(folder_path)
print(df_results)
