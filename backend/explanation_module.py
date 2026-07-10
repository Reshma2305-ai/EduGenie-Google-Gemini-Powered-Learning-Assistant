from gemini import generate

def explain_concept(topic):
    prompt = f"""
Explain the following concept in simple language.

Topic:
{topic}

Rules:
- Beginner friendly
- Give examples
- Keep it easy to understand.
"""

    return generate(prompt)