import os
from dotenv import load_dotenv
import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted

# Load environment variables
load_dotenv()

# Get API Key
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file")

# Configure Gemini
genai.configure(api_key=api_key)

# Load Gemini Model
model = genai.GenerativeModel("gemini-2.5-flash")


def generate(prompt):
    try:
        response = model.generate_content(prompt)

        if response and hasattr(response, "text"):
            return response.text
        else:
            return "No response generated."

    except ResourceExhausted:
        return (
            "⚠️ Gemini API quota exceeded.\n"
            "Please wait until your quota resets or use another API key."
        )

    except Exception as e:
        return f"Error: {str(e)}"