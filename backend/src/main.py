import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv

from src.ai import gemini
from src.ai.gemini import GeminiModel
from src.ai.load_system_prompts import load_playful_prompts, load_serious_prompts
from src.types import (
    AiRequest,
    AiResponse,
    AiTitleRequest,
    AiTitleResponse,
    RootResponse,
)


# ---------------------------------------------------------------
# Load environmental variable
# ---------------------------------------------------------------
load_dotenv()

# ---------------------------------------------------------------
# Initialize app
# ---------------------------------------------------------------

front_end_url = os.getenv("FRONT_END_URL", "")
print(front_end_url)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[front_end_url],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------
# Routes
# ---------------------------------------------------------------

# GET


@app.get("/")
def root(response_model=RootResponse):
    return RootResponse()


# POST
# Gemini
@app.post("/gemini")
def sendMessageToGemini(request: AiRequest, response_model=StreamingResponse):

    system_prompt = (
        load_serious_prompts() if request.is_serious else load_playful_prompts()
    )
    model_name = os.getenv("GEMINI_MODEL_NAME")
    if model_name == None:
        raise HTTPException(
            status_code=500, detail="The model name for Gemini is not defined."
        )

    gemini_model = GeminiModel(
        system_prompt=system_prompt,
        model_name=model_name,
    )

    """ Generating response """
    """ Any function that contains yield becomes a generator, and the caller iterates over it. """

    return StreamingResponse(
        gemini_model.chat(
            history=request.history,
            user_prompt=request.user_prompt,
        ),
        media_type="text/plain",
    )


@app.post("/gemini/title")
def getTitleFromGemini(request: AiTitleRequest, response_model=AiTitleResponse):
    model_name = os.getenv("GEMINI_MODEL_NAME")
    if model_name == None:
        raise HTTPException(
            status_code=500, detail="The model name for Gemini is not defined."
        )

    gemini_model = GeminiModel(
        system_prompt="",
        model_name=model_name,
    )

    title = gemini_model.generate_title(user_prompt=request.prompt)

    return AiTitleResponse(title=title)
