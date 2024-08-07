from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import hashlib
import logging
import os

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
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # To disable a feature that is no longer necessary
db = SQLAlchemy(app)

# Define User model
class User(db.Model):
    __tablename__ = 'users'  # Explicitly set the table name
    user_no = db.Column(db.String(100), primary_key=True)  # Set user_no as the primary key
    user_name = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    branch_id = db.Column(db.String(100))
    auth_code = db.Column(db.String(100))

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

# Enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})

# Sanity check route
@app.route('/', methods=['GET'])
def test_router():
    return jsonify('This is Docker Test developments Server!')

@app.route("/hello")
def hello_flask():
    return "<h1>Hello Flask!</h1>"

@app.route("/first")
def hello_first():
    return "<h3>Hello First</h3>"

@app.route('/health_check', methods=['GET'])
def health_check():
    return jsonify('good')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('FLASK_RUN_PORT', 5000)), debug=bool(os.getenv('FLASK_DEBUG', True)))
