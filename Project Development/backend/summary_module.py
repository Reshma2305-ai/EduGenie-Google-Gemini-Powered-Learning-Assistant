from gemini import generate

def summarize_text(text):

    prompt = f"""
You are an expert educational assistant.

Summarize the following notes into concise bullet points.

Text:

{text}
"""

    return generate(prompt)