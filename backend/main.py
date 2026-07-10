from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from qna import answer_question
from explanation_module import explain_concept
from summary_module import summarize_text
from quiz_module import generate_quiz
from learning_path import learning_recommendation


from fastapi import UploadFile, File
from pypdf import PdfReader
import os
import tempfile

from summary_module import summarize_text

app = FastAPI(title="EduGenie AI Learning Assistant")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UserInput(BaseModel):
    text: str


@app.get("/")
async def root():
    return {
        "message": "EduGenie Backend Running 🚀",
        "status": "success"
    }


@app.post("/qna")
async def qna(data: UserInput):
    response = answer_question(data.text)
    return {"response": response}


@app.post("/explain")
async def explain(data: UserInput):
    response = explain_concept(data.text)
    return {"response": response}


@app.post("/summarize")
async def summarize(data: UserInput):
    response = summarize_text(data.text)
    return {"response": response}


@app.post("/quiz")
async def quiz(data: UserInput):
    response = generate_quiz(data.text)
    return {"response": response}


@app.post("/learning-path")
async def learning_path(data: UserInput):
    response = learning_recommendation(data.text)
    return {"response": response}


@app.get("/health")
async def health():
    return {
        "status": "Running",
        "application": "EduGenie",
        "version": "1.0"
    }
@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):

    try:

        # Allow only PDF files
        if not file.filename.lower().endswith(".pdf"):
            return {
                "success": False,
                "response": "Please upload a PDF file only."
            }

        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp:

            temp.write(await file.read())

            temp_path = temp.name

        # Read PDF
        reader = PdfReader(temp_path)

        pdf_text = ""

        for page in reader.pages:

            page_text = page.extract_text()

            if page_text:
                pdf_text += page_text + "\n"

        # Delete temp file
        os.remove(temp_path)

        if pdf_text.strip() == "":

            return {
                "success": False,
                "response": "No readable text found inside PDF."
            }

        # Summarize using Gemini
        summary = summarize_text(pdf_text)

        return {

            "success": True,

            "response": summary

        }

    except Exception as e:

        return {

            "success": False,

            "response": str(e)

        }