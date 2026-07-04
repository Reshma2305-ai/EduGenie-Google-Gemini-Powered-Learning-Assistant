from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models import UserInput
from gemini import generate
from prompts import (
    QUESTION_PROMPT,
    EXPLAIN_PROMPT,
    QUIZ_PROMPT,
    SUMMARY_PROMPT,
    ROADMAP_PROMPT
)
from utils import format_response

app = FastAPI(title="EduGenie API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Welcome to EduGenie API"}


@app.post("/ask")
def ask(data: UserInput):
    result = generate(QUESTION_PROMPT.format(input=data.text))
    return format_response(result)


@app.post("/explain")
def explain(data: UserInput):
    result = generate(EXPLAIN_PROMPT.format(input=data.text))
    return format_response(result)


@app.post("/quiz")
def quiz(data: UserInput):
    result = generate(QUIZ_PROMPT.format(input=data.text))
    return format_response(result)


@app.post("/summary")
def summary(data: UserInput):
    result = generate(SUMMARY_PROMPT.format(input=data.text))
    return format_response(result)


@app.post("/roadmap")
def roadmap(data: UserInput):
    result = generate(ROADMAP_PROMPT.format(input=data.text))
    return format_response(result)