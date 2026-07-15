from gemini import generate

def learning_recommendation(topic):
    prompt = f"""
Create a learning roadmap for:

{topic}

Include:

1. Beginner topics
2. Intermediate topics
3. Advanced topics
4. Recommended books
5. Recommended YouTube resources
6. Practice projects
"""

    return generate(prompt)