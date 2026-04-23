from typing import Literal, TypedDict
from pydantic import BaseModel


# ---------------------------------------------------------------
# Pydantic / Type
# ---------------------------------------------------------------
class RootResponse(BaseModel):
    status: str = "The server is up and running."


class HistoryEntry(TypedDict):
    role: str
    message: str


class AiRequest(BaseModel):
    user_prompt: str
    history: list[HistoryEntry]
    is_serious: bool = True
    model_name: Literal["gpt", "gemini"]


class AiTitleRequest(BaseModel):
    prompt: str = ""
    model_name: Literal["gpt", "gemini"]


class AiTitleResponse(BaseModel):
    title: str = ""
