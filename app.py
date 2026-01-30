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

@app.route('/qa')
def qa():
    return render_template('qa.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        model = genai.GenerativeModel(MODEL_NAME)
        response = model.generate_content(user_message)
        return jsonify({
            "response": response.text,
            "model": MODEL_NAME
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/qa', methods=['POST'])
def api_qa():
    user_query = request.json.get('message')
    if not user_query:
        return jsonify({"error": "No question provided"}), 400

    # Specialized System Instruction for AI/ML Expert
    system_instruction = (
        "You are an expert tutor in Artificial Intelligence and Machine Learning basics. "
        "Your goal is to provide **CONCISE**, **SIMPLE**, and **ANALOGY-DRIVEN** answers. "
        "Use bullet points and bold text for key terms. "
        "Always keep your answer to 2-3 short paragraphs max. "
        "At the very end of your response, you MUST provide exactly 3 suggested follow-up topics "
        "related to the current question. Format them exactly like this: "
        "SUGGESTIONS: [Topic 1], [Topic 2], [Topic 3]"
    )

    try:
        model = genai.GenerativeModel(MODEL_NAME)
        # Combine instruction with user query for this simple demo
        full_prompt = f"{system_instruction}\n\nStudent Question: {user_query}"
        response = model.generate_content(full_prompt)
        
        return jsonify({
            "response": response.text,
            "model": MODEL_NAME
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
