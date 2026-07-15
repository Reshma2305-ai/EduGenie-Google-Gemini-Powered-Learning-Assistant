from gemini import generate

def answer_question(question):
    prompt = f"""
You are an AI educational assistant.

Answer the following question clearly and accurately.

Question:
{question}
"""

    return generate(prompt)