import os
from flask import Flask, request, jsonify
from transformers import pipeline
import speech_recognition as sr
from flask_cors import CORS
from dotenv import load_dotenv
import requests

# Load environment variables from .env file
load_dotenv()

# Initialize the Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Google Places API key from .env file
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

# Initialize Hugging Face summarization model
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# Initialize speech recognition
recognizer = sr.Recognizer()

# Directory to save transcribed text files
TRANSCRIPTIONS_DIR = "transcriptions"
os.makedirs(TRANSCRIPTIONS_DIR, exist_ok=True)

# Function to transcribe audio using Google's API
def transcribe_audio(audio_file):
    try:
        with sr.AudioFile(audio_file) as source:
            audio = recognizer.record(source)
            text = recognizer.recognize_google(audio)
            return text
    except sr.UnknownValueError:
        return "Unable to recognize speech"
    except sr.RequestError:
        return "Request Error with Google Speech Recognition"
    except Exception as e:
        return str(e)

# Function to save transcribed text as a .txt file
def save_transcription(text, filename="transcription.txt"):
    file_path = os.path.join(TRANSCRIPTIONS_DIR, filename)
    with open(file_path, "w") as file:
        file.write(text)

# Function to search for restaurants using Google Places API
def search_google_places(query, location="New York"):
    url = f"https://maps.googleapis.com/maps/api/place/textsearch/json"
    params = {
        'query': query,
        'location': '40.7128,-74.0060',  # New York City coordinates
        'radius': 10000,  # 10 km radius
        'key': GOOGLE_API_KEY
    }

    response = requests.get(url, params=params)
    data = response.json()

    if 'results' in data:
        restaurants = []
        for place in data['results']:
            name = place['name']
            rating = place.get('rating', 'No rating')
            user_ratings_total = place.get('user_ratings_total', 0)
            reviews_summary = "No reviews available."

            if 'place_id' in place:
                # Fetch detailed reviews
                place_id = place['place_id']
                detail_url = f"https://maps.googleapis.com/maps/api/place/details/json"
                detail_params = {
                    'place_id': place_id,
                    'fields': 'review',
                    'key': GOOGLE_API_KEY
                }
                detail_response = requests.get(detail_url, params=detail_params)
                detail_data = detail_response.json()

                if 'result' in detail_data and 'reviews' in detail_data['result']:
                    reviews = [review['text'] for review in detail_data['result']['reviews']]
                    reviews_text = " ".join(reviews)
                    summary = summarizer(reviews_text, max_length=100, min_length=30, do_sample=False)
                    reviews_summary = summary[0]['summary_text']

            restaurants.append({
                'name': name,
                'rating': rating,
                'total_reviews': user_ratings_total,
                'summary': reviews_summary
            })

        # Sort restaurants by rating and return top 5
        top_5_restaurants = sorted(restaurants, key=lambda x: x['rating'], reverse=True)[:5]
        return top_5_restaurants
    else:
        return []

# API route to handle voice or text input and perform restaurant search
@app.route('/search-restaurants', methods=['POST'])
def search_restaurants():
    try:
        audio_file = request.files.get('audio')
        text_input = request.form.get('text')

        if audio_file:
            # Convert voice to text if audio is provided
            transcript = transcribe_audio(audio_file)
            save_transcription(transcript, filename="transcription.txt")  # Save transcription
            if "Request Error" in transcript:
                return jsonify({'error': transcript}), 500
        elif text_input:
            # Use the provided text directly
            transcript = text_input
            save_transcription(transcript, filename="transcription.txt")  # Save transcription
        else:
            return jsonify({'error': 'No audio or text provided'}), 400

        # Search restaurants from Google Places based on the text
        restaurants = search_google_places(transcript)
        if not restaurants:
            return jsonify({'message': 'No restaurants found'}), 404

        return jsonify({'restaurants': restaurants}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Main entry point to run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
