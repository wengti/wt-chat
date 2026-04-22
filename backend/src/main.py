import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv

from src.ai import gemini
from src.ai.gemini import GeminiModel
from src.ai.gpt import GPTModel
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
@app.post("/chat")
def sendMessageToGemini(request: AiRequest, response_model=StreamingResponse):

    system_prompt = (
        load_serious_prompts() if request.is_serious else load_playful_prompts()
    )

    model = None

    """ Create client """
    if request.model_name == "gemini":
        model_name = os.getenv("GEMINI_MODEL_NAME")
        if model_name == None:
            raise HTTPException(
                status_code=500, detail="The model name for Gemini is not defined."
            )
        model = GeminiModel(
            system_prompt=system_prompt,
            model_name=model_name,
        )
    elif request.model_name == "gpt":
        model_name = os.getenv("OPENAI_MODEL_NAME")
        if model_name == None:
            raise HTTPException(
                status_code=500, detail="The model name for Gemini is not defined."
            )
        model = GPTModel(
            system_prompt=system_prompt,
            model_name=model_name,
        )

    if model == None:
        raise HTTPException(status_code=500, detail="Fail to create an AI client.")

    """ Generating response """
    """ Any function that contains yield becomes a generator, and the caller iterates over it. """
    return StreamingResponse(
        model.chat(
            history=request.history,
            user_prompt=request.user_prompt,
        ),
        media_type="text/plain",
    )


@app.post("/title")
def getTitleFromGemini(request: AiTitleRequest, response_model=AiTitleResponse):

    model = None
    """ Create client """
    if request.model_name == "gemini":
        model_name = os.getenv("GEMINI_MODEL_NAME")
        if model_name == None:
            raise HTTPException(
                status_code=500, detail="The model name for Gemini is not defined."
            )
        model = GeminiModel(
            system_prompt="",
            model_name=model_name,
        )
    elif request.model_name == "gpt":
        model_name = os.getenv("OPENAI_MODEL_NAME")
        if model_name == None:
            raise HTTPException(
                status_code=500, detail="The model name for Gemini is not defined."
            )
        model = GPTModel(
            system_prompt="",
            model_name=model_name,
        )

    if model == None:
        raise HTTPException(status_code=500, detail="Fail to create an AI client.")

    title = model.generate_title(user_prompt=request.prompt)

    return AiTitleResponse(title=title)
