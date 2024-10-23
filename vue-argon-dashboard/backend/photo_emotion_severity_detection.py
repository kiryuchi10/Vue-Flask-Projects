# emotion_model.py
import cv2
import numpy as np
from keras.models import load_model

# Load a pre-trained emotion detection model
model = load_model('path_to_your_emotion_model.h5')

def detect_emotion(image):
    # Pre-process the image for emotion detection
    gray_image = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    faces = face_cascade.detectMultiScale(gray_image, 1.3, 5)

    if len(faces) == 0:
        return "No face detected", 0
    
    for (x, y, w, h) in faces:
        face = gray_image[y:y+h, x:x+w]
        face = cv2.resize(face, (48, 48))
        face = face / 255.0
        face = np.expand_dims(face, axis=0)
        face = np.expand_dims(face, axis=-1)

        # Predict the emotion
        prediction = model.predict(face)
        emotion_index = np.argmax(prediction)
        emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']
        emotion = emotion_labels[emotion_index]

        # Assign a severity score (you can customize this logic)
        severity = assign_severity(emotion)
        
        return emotion, severity

def assign_severity(emotion):
    severity_levels = {
        'Angry': 3,
        'Disgust': 2,
        'Fear': 4,
        'Happy': 1,
        'Sad': 3,
        'Surprise': 2,
        'Neutral': 1
    }
    return severity_levels.get(emotion, 1)
