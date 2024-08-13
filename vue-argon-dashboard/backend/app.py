from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import hashlib
import logging
import os
import secrets
from flask_mail import Mail, Message
import datetime

app = Flask(__name__)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('flask_app')

@app.before_request
def log_request_info():
    logger.info(f"Received {request.method} request for {request.url}")
    logger.info(f"Request Headers: {request.headers}")
    logger.info(f"Request Body: {request.get_data(as_text=True)}")

@app.after_request
def log_response_info(response):
    logger.info(f"Response Status: {response.status}")
    logger.info(f"Response Headers: {response.headers}")
    logger.info(f"Response Body: {response.get_data(as_text=True)}")
    return response

# MySQL configurations
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:1234@localhost/aichatbotproject'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Configure Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.example.com'  # Replace with your mail server
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'your-email@example.com'
app.config['MAIL_PASSWORD'] = 'your-email-password'
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
mail = Mail(app)

# Define User model
class User(db.Model):
    __tablename__ = 'users'
    user_no = db.Column(db.String(100), primary_key=True)
    user_name = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    branch_id = db.Column(db.String(100))
    auth_code = db.Column(db.String(100))

class PasswordResetToken(db.Model):
    __tablename__ = 'password_reset_tokens'
    token = db.Column(db.String(255), primary_key=True)
    email = db.Column(db.String(100), nullable=False)
    expiry = db.Column(db.DateTime, nullable=False)

# Hash function for passwords
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    user_no = data.get('userNo')
    user_name = data.get('userName')
    password = hash_password(data.get('password', ''))
    branch_id = data.get('branchId')
    auth_code = data.get('authCode')

    # Validate required fields
    if not all([user_no, user_name, password, branch_id, auth_code]):
        return jsonify({'message': 'Missing required fields'}), 400

    # Check if user_no or user_name already exists
    existing_user = User.query.filter(
        (User.user_no == user_no) | (User.user_name == user_name)
    ).first()

    if existing_user:
        return jsonify({'message': 'User with this ID or username already exists'}), 409

    new_user = User(user_no=user_no, user_name=user_name, password=password, branch_id=branch_id, auth_code=auth_code)
    db.session.add(new_user)
    try:
        db.session.commit()
        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error occurred during signup: {e}")
        return jsonify({'message': 'Error occurred: ' + str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user_name = data.get('userName')
    password = hash_password(data.get('password', ''))

    if not user_name or not password:
        return jsonify({'message': 'Missing username or password'}), 400

    user = User.query.filter_by(user_name=user_name, password=password).first()

    if user:
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/findpassword', methods=['POST'])
def find_password():
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    user = User.query.filter_by(user_name=email).first()

    if not user:
        return jsonify({'error': 'Email not found'}), 404

    token = secrets.token_urlsafe(20)
    expiry = datetime.datetime.utcnow() + datetime.timedelta(hours=1)

    new_token = PasswordResetToken(token=token, email=email, expiry=expiry)
    db.session.add(new_token)
    try:
        db.session.commit()

        msg = Message('Password Reset Request',
                      sender='your-email@example.com',
                      recipients=[email])
        reset_link = f'http://localhost:5000/resetpassword?token={token}'
        msg.body = f'Click the following link to reset your password: {reset_link}'
        mail.send(msg)

        return jsonify({'message': 'Password reset link sent'}), 200
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error occurred during password reset request: {e}")
        return jsonify({'message': 'Error occurred: ' + str(e)}), 500

@app.route('/resetpassword', methods=['POST'])
def reset_password():
    data = request.json
    token = data.get('token')
    new_password = data.get('new_password')

    if not token or not new_password:
        return jsonify({'error': 'Token and new password are required'}), 400

    token_data = PasswordResetToken.query.filter_by(token=token).first()

    if not token_data:
        return jsonify({'error': 'Invalid or expired token'}), 400

    if datetime.datetime.utcnow() > token_data.expiry:
        return jsonify({'error': 'Token expired'}), 400

    user = User.query.filter_by(user_name=token_data.email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    user.password = hash_password(new_password)
    db.session.delete(token_data)
    try:
        db.session.commit()
        return jsonify({'message': 'Password successfully reset'}), 200
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error occurred during password reset: {e}")
        return jsonify({'message': 'Error occurred: ' + str(e)}), 500

# Enable CORS
CORS(app)

# Sanity check route
@app.route('/test', methods=['GET'])
def test_router():
    return jsonify('This is Docker Test developments Server!')

@app.route("/mainPage")
def mainPage():
    return jsonify("This is the main page!")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
