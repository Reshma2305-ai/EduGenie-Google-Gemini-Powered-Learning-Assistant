from gemini import generate

def generate_quiz(topic):
    prompt = f"""
You are an expert educational quiz generator.

Generate exactly 5 multiple-choice questions in English only.

Rules:
1. Use clear and simple English.
2. Do NOT use Markdown.
3. Do NOT use symbols like *, #, -, _, or backticks.
4. Do NOT include explanations.
5. Each question must have exactly four options:
   A)
   B)
   C)
   D)
6. Mention the correct answer after each question.

Format:

Q1. Question

A. Option

B. Option

C. Option

D. Option

Answer: B

Q2. ...

Topic:
{topic}
"""

    return generate(prompt)