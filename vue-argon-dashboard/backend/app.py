from flask import Flask, request, jsonify, abort
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
import logging
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import hashlib
import logging
import datetime
import jwt
import requests
from flask_mail import Mail, Message
from dotenv import load_dotenv
import secrets
import os
from transformers import pipeline

from scipy.io import wavfile
import pandas as pd
from io import BytesIO

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
from transformers import pipeline

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

def update_secret_key_in_env():
    # Generate a new secret key
    secret_key = secrets.token_hex(32)  # Generates a 64-character hexadecimal string

    # Path to the .env file
    env_file_path = '.env'

    # Check if the .env file exists
    if os.path.exists(env_file_path):
        # Read the existing contents
        with open(env_file_path, 'r') as file:
            lines = file.readlines()

        # Check if SECRET_KEY is already in the file
        secret_key_updated = False
        with open(env_file_path, 'w') as file:
            for line in lines:
                if line.startswith('SECRET_KEY='):
                    file.write(f'SECRET_KEY={secret_key}\n')
                    secret_key_updated = True
                else:
                    file.write(line)
            # If SECRET_KEY was not in the file, add it
            if not secret_key_updated:
                file.write(f'SECRET_KEY={secret_key}\n')
    else:
        # Create the .env file and write the SECRET_KEY
        with open(env_file_path, 'w') as file:
            file.write(f'SECRET_KEY={secret_key}\n')

    print(f'SECRET_KEY has been updated in {env_file_path}.')
    return secret_key

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

# Routes for user signup
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    user_name = data.get('userName')
    password = hash_password(data.get('password', ''))
    branch_id = data.get('branchId')
    email = data.get('email')

    if not all([user_name, password, branch_id, email]):
        return jsonify({'message': 'Missing required fields'}), 400

    existing_user = User.query.filter(
        (User.user_name == user_name) | (User.email == email)
    ).first()

    if existing_user:
        return jsonify({'message': 'User with this username or email already exists'}), 409

    new_user = User(user_name=user_name, password=password, branch_id=branch_id, email=email)
    db.session.add(new_user)
    try:
        db.session.commit()
        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error occurred during signup: {e}")
        return jsonify({'message': f'Error occurred: {str(e)}'}), 500

# Routes for user login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user_name = data.get('userName')
    password = data.get('password', '')

    user = User.query.filter_by(user_name=user_name).first()

    if user and check_password_hash(user.password, password):
        token = generate_token(user.user_no)
        user.auth_code = token
        db.session.commit()
        return jsonify({'message': 'Login successful', 'token': token}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

# Route to handle password reset request
@app.route('/findpassword', methods=['POST'])
def find_password():
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({'error': 'Email not found'}), 404

    token = secrets.token_urlsafe(20)
    expiry = datetime.datetime.utcnow() + datetime.timedelta(hours=1)

    new_token = PasswordResetToken(token=token, email=email, expiry=expiry)
    db.session.add(new_token)
    try:
        db.session.commit()

        msg = Message('Password Reset Request',
                      sender=app.config['MAIL_DEFAULT_SENDER'],  # Ensure the sender is configured
                      recipients=[email])
        msg.body = f"Dear {user.user_name},\n\n" \
                   f"You requested a password reset. Please use the following link to reset your password:\n\n" \
                   f"http://localhost:5000/reset-password/{token}\n\n" \
                   f"If you did not request this, please ignore this email.\n\n" \
                   f"Best regards,\nYour App Team"
        mail.send(msg)
        return jsonify({'message': 'Password reset link sent'}), 200
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error occurred during password reset request: {e}")
        return jsonify({'message': 'Password reset request received, but an error occurred while sending the email.'}), 500

# Route to reset the password
@app.route('/reset-password/<token>', methods=['POST'])
def reset_password_token(token):
    try:
        new_password = request.json.get('new_password')

        if not new_password:
            return jsonify({'message': 'New password is required'}), 400

        # Decode the token using your SECRET_KEY
        user_token = PasswordResetToken.query.filter_by(token=token).first()

        if not user_token or user_token.expiry < datetime.datetime.utcnow():
            return jsonify({'message': 'Invalid or expired token'}), 400

        user = User.query.filter_by(email=user_token.email).first()

        if not user:
            return jsonify({'message': 'User not found'}), 404

        hashed_password = hash_password(new_password)
        user.password = hashed_password
        db.session.delete(user_token)  # Token used, delete it
        db.session.commit()

        return jsonify({'message': 'Password reset successful'}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token has expired'}), 400
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 400

# Route to retrieve user profile
@app.route('/profile', methods=['GET'])
def profile():
    token = request.headers.get('Authorization')
    if not token:
        abort(401, description='Authorization token is missing')

    token = token.replace('Bearer ', '')
    try:
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = data['user_id']
        user = User.query.get(user_id)

        if not user:
            abort(401, description='Invalid token')

        return jsonify({
            'userNo': user.user_no,
            'userName': user.user_name,
            'branchId': user.branch_id,
            'authCode': user.auth_code
        })
    except jwt.ExpiredSignatureError:
        abort(401, description='Token has expired')
    except jwt.InvalidTokenError:
        abort(401, description='Invalid token')

# Route to check login status
@app.route('/check-login', methods=['GET'])
def check_login():
    auth_token = request.headers.get('Authorization')

    if not auth_token:
        return jsonify({'message': 'No auth token provided'}), 401

    auth_token = auth_token.replace('Bearer ', '')
    try:
        data = jwt.decode(auth_token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = data['user_id']
        user = User.query.get(user_id)

        if user:
            return jsonify({'user_name': user.user_name}), 200
        else:
            return jsonify({'message': 'Invalid token'}), 401
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401

# CRUD operations for To-Do list
@app.route('/api/todos/<date>', methods=['GET'])
def get_todos(date):
    try:
        date = datetime.datetime.strptime(date, '%Y-%m-%d').date()
        todos = ToDo.query.filter_by(date=date).all()
        todo_list = [{'id': todo.id, 'text': todo.text} for todo in todos]
        return jsonify(todo_list), 200
    except ValueError:
        return jsonify({'error': 'Invalid date format'}), 400

@app.route('/api/todos/<date>', methods=['POST'])
def add_todo(date):
    data = request.json
    text = data.get('text')
    if not text:
        return jsonify({'error': 'Text is required'}), 400

    try:
        date = datetime.datetime.strptime(date, '%Y-%m-%d').date()
        new_todo = ToDo(date=date, text=text)
        db.session.add(new_todo)
        db.session.commit()
        return jsonify({'message': 'ToDo added successfully'}), 201
    except ValueError:
        return jsonify({'error': 'Invalid date format'}), 400
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error occurred while adding ToDo: {e}")
        return jsonify({'message': f'Error occurred: {str(e)}'}), 500

@app.route('/api/todos/<int:id>', methods=['DELETE'])
def delete_todo(id):
    todo = ToDo.query.get(id)
    if not todo:
        return jsonify({'error': 'ToDo not found'}), 404

    db.session.delete(todo)
    try:
        db.session.commit()
        return jsonify({'message': 'ToDo deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error occurred while deleting ToDo: {e}")
        return jsonify({'message': f'Error occurred: {str(e)}'}), 500

import torch

def check_tensor(tensor):
    if torch.any(torch.isnan(tensor)) or torch.any(torch.isinf(tensor)):
        return False
    return True

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('flask_app')

# Load the DialoGPT model and tokenizer
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

@app.route('/recording',  methods=['GET', 'POST'])
def recording():
    fs = 44100  # Sample rate
    seconds = 4  # Duration of recording
    if request.method == "POST":
        print("-----------------------START RECORDING-------------------------")
        myrecording = sd.rec(int(seconds * fs), samplerate=fs, channels=2)
        sd.wait()  
        print("-----------------------STOP RECORDING-------------------------")
        write('static/output.wav', fs, myrecording)  
    return render_template('recording.html')

@app.route('/predicting', methods=['GET', 'POST'])
def predicting():
    if not sys.warnoptions:
        warnings.simplefilter("ignore")
    warnings.filterwarnings("ignore", category=DeprecationWarning) 
    data, sample_rate = librosa.load('static/output.wav')
    def Decoding(list):
        if list[0] == 0:
            return "Angry"
        elif list[0] == 1:
            return "Fear"
        elif list[0] == 2:
            return "Surprise"
        elif list[0] == 3:
            return "Disgust"
        elif list[0] == 4:
            return "Calm"
        elif list[0] == 5:
            return "Happy"
        elif list[0] == 6:
            return "Sad"
        else:
            return "Neutral"
    def noise(data):
        noise_amp = 0.035*np.random.uniform()*np.amax(data)
        data = data + noise_amp*np.random.normal(size=data.shape[0])
        return data

    def stretch(data, rate=0.8):
        return librosa.effects.time_stretch(data, rate)

    def shift(data):
        shift_range = int(np.random.uniform(low=-5, high = 5)*1000)
        return np.roll(data, shift_range)

    def pitch(data, sampling_rate, pitch_factor=0.7):
        return librosa.effects.pitch_shift(data, sampling_rate, pitch_factor)

    def extract_features(data):
        # ZCR
        result = np.array([])
        zcr = np.mean(librosa.feature.zero_crossing_rate(y=data).T, axis=0)
        result=np.hstack((result, zcr)) # stacking horizontally

        # Chroma_stft
        stft = np.abs(librosa.stft(data))
        chroma_stft = np.mean(librosa.feature.chroma_stft(S=stft, sr=sample_rate).T, axis=0)
        result = np.hstack((result, chroma_stft)) # stacking horizontally

        # MFCC
        mfcc = np.mean(librosa.feature.mfcc(y=data, sr=sample_rate).T, axis=0)
        result = np.hstack((result, mfcc)) # stacking horizontally

        # Root Mean Square Value
        rms = np.mean(librosa.feature.rms(y=data).T, axis=0)
        result = np.hstack((result, rms)) # stacking horizontally

        # MelSpectogram
        mel = np.mean(librosa.feature.melspectrogram(y=data, sr=sample_rate).T, axis=0)
        result = np.hstack((result, mel)) # stacking horizontally
        
        return result

    # Load pre-trained models
CNN = tf.keras.models.load_model('Model/content/CNN')
LR = joblib.load("Model/LogisticRegresion.pkl")
SVM = joblib.load("Model/SVM.pkl")
Knn = joblib.load("Model/Knn.pkl")

def extract_features(data):
    # Add your feature extraction logic here
    pass

def get_features(path):
    # Load the audio file and extract features
    data, sample_rate = librosa.load(path, duration=4, offset=0.6)
    res1 = extract_features(data)
    result = np.array(res1)
    return result

def Decoding(pred):
    # Add your decoding logic here
    pass

@app.route('/api/predict', methods=['POST'])
def predict():
    # Assume the file is saved as 'static/output.wav'
    test_case = 'static/output.wav'
    featuring = get_features(test_case)
    X3 = [featuring]
    X4 = np.expand_dims(X3, axis=2)

    # Make predictions
    pred_test_1 = LR.predict(X3)
    pred_test_2 = SVM.predict(X3)
    pred_test_3 = Knn.predict(X3)
    pred_test_4 = CNN.predict(X4)
    pred_test_4 = pred_test_4.flatten()

    # Determine the CNN prediction index
    nl = []
    for pred in pred_test_4:
        nl.append(pred)
    index_max = max(nl)
    i = nl.index(index_max)

    # Decode predictions
    predictions = {
        "LogisticRegression": Decoding(pred_test_1),
        "SVM": Decoding(pred_test_2),
        "Knn": Decoding(pred_test_3),
        'CNN': Decoding(np.ndarray(i))
    }

    # Return predictions as JSON
    return jsonify(predictions)

app.config['UPLOAD_FOLDER'] = './uploads'  # Folder to store uploaded files
app.config['CSV_FOLDER'] = './csv_files'  # Folder to store generated CSV files

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['CSV_FOLDER'], exist_ok=True)


import tempfile
from Wav2Csv import Wav2Csv  # Ensure this import is correct based on your module structure


app.config['UPLOAD_FOLDER'] = './uploads'  # Directory to store uploaded files
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

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
    update_secret_key_in_env()
    app.run(debug=True)