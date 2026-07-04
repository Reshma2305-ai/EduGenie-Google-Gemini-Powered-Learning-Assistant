import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load .env from the backend folder
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

print("API KEY:", api_key)

genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-2.5-flash")


def generate(prompt):
    response = model.generate_content(prompt)
    return response.text