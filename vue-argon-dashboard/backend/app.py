import tempfile
from flask import Flask, request, jsonify, abort, send_file
import logging
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import datetime
import jwt
import secrets
import os
from flask_mail import Mail, Message
from dotenv import load_dotenv
import numpy as np
import librosa
import tensorflow as tf
import joblib
from scipy.io.wavfile import write
import sounddevice as sd
from datetime import datetime
import glob as glob


import Wav2Csv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('flask_app')

# MySQL configurations
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:1234@localhost/aichatbotproject'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Configure Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME')  # Ensure default sender is set
mail = Mail(app)

# Set the secret key for JWT
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

# Set up CORS
CORS(app)

# Initialize the chat model using transformers
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM

# Define User model
class User(db.Model):
    __tablename__ = 'users'
    user_no = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_name = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    branch_id = db.Column(db.String(100))
    auth_code = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True, nullable=False)

# Define PasswordResetToken model
class PasswordResetToken(db.Model):
    __tablename__ = 'password_reset_tokens'
    token = db.Column(db.String(255), primary_key=True)
    email = db.Column(db.String(100), nullable=False)
    expiry = db.Column(db.DateTime, nullable=False)

# Define ToDo model
class ToDo(db.Model):
    __tablename__ = 'todos'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    text = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return f"<ToDo {self.text}>"

# Function to generate a token
def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)  # Token valid for 1 day
    }
    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    return token

# Hash function for passwords
def hash_password(password):
    return generate_password_hash(password)

# Routes for user signup, login, and password management omitted for brevity...

# Initialize the chat model using transformers
tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-small")
model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-small")

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    text = data.get('text')

    if not text:
        return jsonify({'error': 'Text is required'}), 400

    try:
        # Encode the input and generate a response
        input_ids = tokenizer.encode(text + tokenizer.eos_token, return_tensors='pt')
        response_ids = model.generate(input_ids, max_length=100, pad_token_id=tokenizer.eos_token_id)

        # Decode and return the response
        response_text = tokenizer.decode(response_ids[:, input_ids.shape[-1]:][0], skip_special_tokens=True)

        return jsonify({'response': response_text.strip()})
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

import os
import threading  # Add this import
from flask import Flask, jsonify
import sounddevice as sd
from scipy.io.wavfile import write
from datetime import datetime
from RecordAudio import record_voice


# Global variable to track recording
recording_thread = None
is_recording = False

@app.route('/start-recording', methods=['POST'])
def start_recording():
    global recording_thread, is_recording
    if is_recording:
        return jsonify({'message': 'Recording already in progress'}), 400
    
    is_recording = True
    filename = record_voice()  # Start recording using the function from recordaudio.py
    return jsonify({'message': 'Recording started', 'file_path': filename}), 200

@app.route('/stop-recording', methods=['POST'])
def stop_recording():
    global is_recording
    if not is_recording:
        return jsonify({'message': 'No recording in progress'}), 400
    
    is_recording = False
    # If you need to do anything else to stop recording, handle it here
    return jsonify({'message': 'Recording stopped'}), 200

from prediction import make_predictions
@app.route('/api/predict-voice', methods=['POST'])
def classify_myvoice():
    # Use the latest .wav file in the recordings directory
    recordings_folder = "recordings"
    latest_voice_file = max(glob.glob(os.path.join(recordings_folder, "*.wav")), key=os.path.getctime)

    if not os.path.exists(latest_voice_file):
        return jsonify({"error": "Voice file not found"}), 404

    # Call the make_predictions function and get the predicted emotion
    emotion = make_predictions(latest_voice_file)
    
    return jsonify({"emotion": emotion}), 200
    
# File upload and CSV generation route
@app.route('/api/upload-wav', methods=['POST'])
def upload_wav():
    try:
        if 'files[]' not in request.files:
            return jsonify({'error': 'No files part'}), 400

        files = request.files.getlist('files[]')
        if not files or len(files) == 0:
            return jsonify({'error': 'No files selected'}), 400

        uploaded_files = []
        for file in files:
            if file.filename == '':
                continue
            if file and file.filename.endswith('.wav'):
                filename = secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                uploaded_files.append(filepath)

        if len(uploaded_files) > 0:
            converter = Wav2Csv(uploaded_files)

            # Save to a temporary CSV file
            output_file = tempfile.NamedTemporaryFile(delete=False, suffix='.csv')
            converter.save_to_csv(output_file.name)

            # Return the CSV file for download
            return send_file(output_file.name, as_attachment=True, download_name="features.csv")
        else:
            return jsonify({'error': 'No valid WAV files were processed'}), 400

    except Exception as e:
        return jsonify({'error': f'An internal server error occurred: {str(e)}'}), 500



if __name__ == '__main__':
    app.run(debug=True)
