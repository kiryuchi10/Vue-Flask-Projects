import cv2
import mediapipe as mp
import numpy as np
from tensorflow.keras.models import load_model

# Load pre-trained FER model
model_path = "FER_model.h5"  # Update this with the correct path to your model
fer_model = load_model(model_path)

# Define emotion labels and assign a minimum threshold for display
emotions = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]

def get_emotion_label(emotion_scores):
    return emotions[np.argmax(emotion_scores)]

def get_emotion_labels(emotion_scores):
    # Filter and sort emotions by confidence score
    emotion_labels = [(emotion, score) for emotion, score in zip(emotions, emotion_scores) if score > 0.1]
    emotion_labels.sort(key=lambda x: x[1], reverse=True)
    return "\n".join([f"{emotion}: {score:.2%}" for emotion, score in emotion_labels])

def draw_emotion_labels(frame, pos_x, pos_y, emotion_labels):
    text_size = cv2.getTextSize("test", cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)[0]
    text_height = text_size[1]

    for i, line in enumerate(emotion_labels.split("\n")):
        y_offset = int(i * text_height * 1.1)
        cv2.putText(frame, line, (pos_x - 1, pos_y + y_offset - 1), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1)
        cv2.putText(frame, line, (pos_x, pos_y + y_offset), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 1)

def process_video(input_video_path, output_video_path):
    cap = cv2.VideoCapture(input_video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)

    mp_face_mesh = mp.solutions.face_mesh
    face_mesh = mp_face_mesh.FaceMesh()

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out = cv2.VideoWriter(output_video_path, fourcc, fps, (int(cap.get(3)), int(cap.get(4))))

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = face_mesh.process(rgb_frame)

        if result.multi_face_landmarks:
            for facial_landmarks in result.multi_face_landmarks:
                landmarks = np.array([(pt.x, pt.y) for pt in facial_landmarks.landmark])
                landmarks_pixels = (landmarks * np.array([frame.shape[1], frame.shape[0]])).astype(int)
                
                hull = cv2.convexHull(landmarks_pixels)
                cv2.drawContours(frame, [hull], -1, (0, 0, 255, 126), 1)

                (x, y, w, h) = cv2.boundingRect(landmarks_pixels)

                if 0 < w <= frame.shape[1] and 0 < h <= frame.shape[0] and x >= 0 and y >= 0:
                    face_roi = frame[y : y + h, x : x + w]
                    if face_roi.size != 0:
                        face_roi_gray = cv2.cvtColor(face_roi, cv2.COLOR_BGR2GRAY)
                        face_roi_gray = cv2.resize(face_roi_gray, (48, 48)) / 255.0
                        face_roi_gray = np.expand_dims(face_roi_gray, axis=[0, -1])

                        # Predict emotion
                        emotion_scores = fer_model.predict(face_roi_gray)[0]
                        emotion_labels = get_emotion_labels(emotion_scores)

                        pos_x, pos_y = int(x + w / 2), int(y + h * 0.05)
                        draw_emotion_labels(frame, pos_x, pos_y, emotion_labels)

        cv2.imshow("Facial Landmarks with Emotion", frame)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

        out.write(frame)

    cap.release()
    out.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    input_video = "nosubs.mp4"  # Path to the input video
    output_video = "nosubs-output.mp4"  # Path to the output video with emotions overlay
    process_video(input_video, output_video)
