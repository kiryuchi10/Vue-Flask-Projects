from flask import Flask, request, jsonify, abort
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import hashlib
import logging
import os
import secrets
from flask_mail import Mail, Message
import datetime
import secrets

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
    user_no = db.Column(db.Integer, primary_key=True, autoincrement=True)  # Auto-incrementing primary key
    user_name = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    branch_id = db.Column(db.String(100))
    auth_code = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True, nullable=False)

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
def generate_token():
    return secrets.token_urlsafe(16)  # Generates a 16-byte random token

# Hash function for passwords
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    user_name = data.get('userName')
    password = hash_password(data.get('password', ''))
    branch_id = data.get('branchId')
    email = data.get('email')

    # Validate required fields
    if not all([user_name, password, branch_id, email]):
        return jsonify({'message': 'Missing required fields'}), 400

    # Check if user_name or email already exists
    existing_user = User.query.filter(
        (User.user_name == user_name) | (User.email == email)
    ).first()

    if existing_user:
        return jsonify({'message': 'User with this username or email already exists'}), 409

    # Generate a unique auth_code
    auth_code = generate_token()

    new_user = User(user_name=user_name, password=password, branch_id=branch_id, auth_code=auth_code, email=email)
    db.session.add(new_user)
    try:
        db.session.commit()
        return jsonify({'message': 'User created successfully', 'auth_code': auth_code}), 201
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error occurred during signup: {e}")
        return jsonify({'message': 'Error occurred: ' + str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user_name = data.get('userName')
    password = hash_password(data.get('password', ''))

    user = User.query.filter_by(user_name=user_name, password=password).first()

    if user:
        token = generate_token()
        user.auth_code = token
        db.session.commit()
        return jsonify({'message': 'Login successful', 'token': token}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

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

        # Send email logic (omitted for brevity)
        # ...

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

    user = User.query.filter_by(email=token_data.email).first()
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

@app.route('/profile', methods=['GET'])
def profile():
    token = request.headers.get('Authorization')
    if not token:
        abort(401, description='Authorization token is missing')

    token = token.replace('Bearer ', '')  # Extract token if prefixed with 'Bearer '
    user = User.query.filter_by(auth_code=token).first()
    
    if not user:
        abort(401, description='Invalid token')

    return jsonify({
        'userNo': user.user_no,
        'userName': user.user_name,
        'branchId': user.branch_id,
        'authCode': user.auth_code
    })

@app.route('/check-login', methods=['GET'])
def check_login():
    auth_token = request.headers.get('Authorization')
    
    if not auth_token:
        return jsonify({'message': 'No auth token provided'}), 401

    auth_token = auth_token.replace('Bearer ', '')  # Extract token if prefixed with 'Bearer '
    user = User.query.filter_by(auth_code=auth_token).first()

    if user:
        return jsonify({'user_name': user.user_name}), 200
    else:
        return jsonify({'message': 'Invalid token'}), 401
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
        return jsonify({'id': new_todo.id, 'text': new_todo.text}), 201
    except ValueError:
        return jsonify({'error': 'Invalid date format'}), 400

@app.route('/api/todos/<date>/<int:todo_id>', methods=['DELETE'])
def delete_todo(date, todo_id):
    try:
        date = datetime.datetime.strptime(date, '%Y-%m-%d').date()
        todo = ToDo.query.filter_by(id=todo_id, date=date).first()
        if not todo:
            return jsonify({'error': 'To-do not found'}), 404

        db.session.delete(todo)
        db.session.commit()
        return jsonify({'message': 'To-do deleted successfully'}), 200
    except ValueError:
        return jsonify({'error': 'Invalid date format'}), 400

@app.route('/api/todos/<date>/<int:todo_id>', methods=['PUT'])
def update_todo(date, todo_id):
    data = request.json
    text = data.get('text')
    if not text:
        return jsonify({'error': 'Text is required'}), 400

    try:
        date = datetime.datetime.strptime(date, '%Y-%m-%d').date()
        todo = ToDo.query.filter_by(id=todo_id, date=date).first()
        if not todo:
            return jsonify({'error': 'To-do not found'}), 404

        todo.text = text
        db.session.commit()
        return jsonify({'id': todo.id, 'text': todo.text}), 200
    except ValueError:
        return jsonify({'error': 'Invalid date format'}), 400

def get_user_from_token(token):
    # Simulated function to convert token to user ID
    # Replace with actual token verification logic
    if token == 'valid-token':  # Example token check
        return 'user1'  # Example user ID
    return None

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
