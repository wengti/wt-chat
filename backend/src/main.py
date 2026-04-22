import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from src.ai import gemini
from src.ai.gemini import GeminiModel
from src.ai.load_system_prompts import load_playful_prompts, load_serious_prompts
from src.types import AiRequest, AiResponse, RootResponse


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
def root() -> RootResponse:
    return RootResponse()


# POST
@app.post("/gemini")
def sendMessageToGemini(request: AiRequest):

    system_prompt = (
        load_serious_prompts() if request.is_serious else load_playful_prompts()
    )
    model_name = os.getenv("GEMINI_MODEL_NAME")
    if model_name == None:
        raise HTTPException(
            status_code=500, detail="The model name for Gemini is not defined."
        )

    gemini_model = GeminiModel(system_prompt=system_prompt, model_name=model_name)

    """ Generating title """
    title = ""
    if request.is_new_conversation:
        title = gemini_model.generate_title(
            user_prompt=request.user_prompt,
        )

    """ Generating response """
    system_response = gemini_model.chat(
        history=request.history,
        user_prompt=request.user_prompt,
    )

    return AiResponse(
        system_response=system_response,
        title=title,
    )
