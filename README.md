# Aura | Premium AI Chatbot Demo

Aura is a state-of-the-art AI chatbot built to demonstrate modern web development skills and seamless integration with Google's Gemini AI. It features a premium "Nature in the Dark" inspired Glassmorphism UI and a robust Python/Flask backend.

## 🚀 Features

- **Model**: Powered by `gemini-3-flash-preview` (the latest cutting-edge model).
- **Design**: Premium Glassmorphism interface with smooth animations and neon accents.
- **Backend**: Python/Flask server for secure API handling.
- **Responsive**: Fully responsive design for desktop and mobile.

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla CSS3, JavaScript (ES6+).
- **Backend**: Python 3.x, Flask.
- **AI**: Google Generative AI SDK (Gemini API).
- **Icons**: Lucide Icons.

## 📋 Prerequisites

- Python 3.8 or higher.
- A Google Gemini API Key (get one from [Google AI Studio](https://aistudio.google.com/)).

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vishwa-2420/internship-chatbot.git
   cd internship-chatbot
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**:
   - **Windows**:
     ```bash
     .\venv\Scripts\activate
     ```
   - **macOS/Linux**:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Configure Environment Variables**:
   Create a file named `.env` in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

## 🚀 Running the App

1. Start the Flask server:
   ```bash
   python app.py
   ```
2. Open your browser and navigate to:
   ```
   http://127.0.0.1:5000
   ```

## 📄 License

This project is for demonstration purposes. Feel free to use and modify it for your own learning!
