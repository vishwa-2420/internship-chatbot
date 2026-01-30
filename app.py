import os
from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Configure Gemini API
# Note: GEMINI_API_KEY should be set in .env
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
else:
    print("Warning: GEMINI_API_KEY not found in environment variables.")

# Model selection: gemini-3-flash-preview
MODEL_NAME = "gemini-3-flash-preview"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        # Initialize the model
        model = genai.GenerativeModel(MODEL_NAME)
        
        # In a real app, you might want to handle chat history
        # For this demo, we'll keep it simple
        response = model.generate_content(user_message)
        
        return jsonify({
            "response": response.text,
            "model": MODEL_NAME
        })
    except Exception as e:
        # Fallback to 2.0 if 3.0 fails (just in case the model name is slightly different/unreleased in user region)
        try:
            FALLBACK_MODEL = "gemini-2.0-flash-exp"
            model = genai.GenerativeModel(FALLBACK_MODEL)
            response = model.generate_content(user_message)
            return jsonify({
                "response": response.text,
                "model": FALLBACK_MODEL,
                "note": "Using fallback model 2.0"
            })
        except Exception as fallback_e:
            return jsonify({"error": str(fallback_e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
